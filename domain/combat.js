const { ClientError } = require("./ClientError");

const { resolveAttack } = require("./attack");
const { investStamina, sufferConsequences } = require("./character");
const { actingOrder } = require("./initiative");

function startCombat(combat) {
  if (!enoughParticipants(combat)) {
    throw new NotEnoughParticipantsError();
  }

  const startedCombat = _startCombat(combat);

  const { charactersToAct, participants } = startedCombat;
  return startTurn(
    startedCombat,
    participants.filter(character => character.id === charactersToAct[0])[0]
  );
}

function _startCombat(combat) {
  return {
    ...combat,
    charactersToAct: combat.participants
      .sort(actingOrder)
      .map(character => character.id),
    events: [{ event: "CombatStarted" }],
    pastTurns: []
  };
}

function startTurn(combat, attacker) {
  if (combat.turn) {
    // Turn after first
    if (combat.turn.step !== "AttackResolved") {
      throw new ClientError(
        "Unexpected step [" + combat.turn.step + "] on startTurn"
      );
    }
  }
  if (combat.charactersToAct[0] !== attacker.id) {
    throw new ClientError(
      "Character [" +
        attacker.id +
        "] cannot start turn, it is not next to act [" +
        combat.charactersToAct[0] +
        "]"
    );
  }
  return {
    ...combat,
    turn: {
      attacker,
      step: "SelectOpponent",
      number: combat.turn ? combat.pastTurns.length + 2 : 1
    },
    charactersToAct: combat.charactersToAct.filter(
      characterId => characterId !== attacker.id
    ),
    events: combat.events.concat([
      {
        event: "TurnStarted",
        data: attacker.id
      }
    ]),
    pastTurns: combat.turn ? combat.pastTurns.concat([combat.turn]) : []
  };
}

class NotEnoughParticipantsError extends ClientError {
  constructor() {
    super("There should be at least 2 participants to start combat");
    this.name = "NotEnoughParticipantsError";
  }
}

function enoughParticipants(combat) {
  return (
    typeof combat.participants !== "undefined" &&
    combat.participants.length >= 2
  );
}

class SelectOpponentNoDefenderError extends ClientError {
  constructor() {
    super("defender expected on selectOpponent");
    this.name = "SelectOpponentNoDefenderError";
  }
}

function selectOpponent(combat, turnPatch /*, userId*/) {
  // XXX if (combat.turn.attacker.user !== userId) {
  //   throw "User " +
  //     userId +
  //     " not allowed to select opponent at this turn step " +
  //     combat.turn.step;
  // }
  const defenderId = turnPatch.defender;
  if (defenderId === undefined) {
    throw new SelectOpponentNoDefenderError();
  }

  const defender = combat.participants.find(
    character => character.id === defenderId
  );
  const attacker = combat.turn.attacker;

  const selectOpponentEvents = [
    { event: "OpponentSelected", data: defenderId }
  ];

  return {
    ...combat,
    turn: {
      ...combat.turn,
      defender,
      step: "DecideStaminaLowerIni",
      currentDecision:
        actingOrder(attacker, defender) < 0 ? "defender" : "attacker"
    },
    events: combat.events.concat(selectOpponentEvents)
  };
}

function declareActionLowerIni(combat, turnPatch) {
  if (combat.turn.currentDecision === "defender") {
    const { defenderStamina } = turnPatch;
    if (defenderStamina === undefined) {
      throw new ClientError(
        declareActionNoDefenderStamina("declareActionLowerIni")
      );
    }

    const staminaAmount = defenderStamina.block + defenderStamina.dodge;
    const defender = investStamina(combat.turn.defender, staminaAmount);

    const declareDefenseEvents = [
      { event: "DefenseDeclared", data: combat.turn.defender.id }
    ];

    return {
      ...combat,
      turn: {
        ...combat.turn,
        defenderStamina,
        step: "DecideStaminaHigherIni",
        currentDecision: "attacker",
        defender
      },
      events: combat.events.concat(declareDefenseEvents)
    };
  } else if (combat.turn.currentDecision === "attacker") {
    const { attackerStamina } = turnPatch;
    if (attackerStamina === undefined) {
      throw new ClientError(
        declareActionNoAttackerStamina("declareActionLowerIni")
      );
    }

    const staminaAmount = attackerStamina.impact + attackerStamina.damage;
    const attacker = investStamina(combat.turn.attacker, staminaAmount);

    return {
      ...combat,
      turn: {
        ...combat.turn,
        attackerStamina,
        step: "DecideStaminaHigherIni",
        currentDecision: "defender",
        attacker
      },
      events: combat.events.concat([
        { event: "AttackDeclared", data: attacker.id }
      ])
    };
  } else {
    throw new ClientError(
      "Unexpected combat.turn.currentDecision [" +
        combat.turn.currentDecision +
        "]"
    );
  }
}

const declareActionNoDefenderStamina = step =>
  "defenderStamina expected on [" + step + "] and currentDecision is defender";

function declareActionHigherIni(combat, turnPatch) {
  if (combat.turn.currentDecision === "defender") {
    const { defenderStamina } = turnPatch;
    if (defenderStamina === undefined) {
      throw new ClientError(
        declareActionNoDefenderStamina("declareActionHigherIni")
      );
    }

    const staminaAmount = defenderStamina.dodge + defenderStamina.block;
    const defender = investStamina(combat.turn.defender, staminaAmount);

    const declareDefenseEvents = [
      { event: "DefenseDeclared", data: combat.turn.defender.id }
    ];

    const turn = {
      ...combat.turn,
      defenderStamina
    };
    const clashResult = resolveAttack(turn);

    const defenderAfterClash = sufferConsequences(defender, clashResult);

    const resolvedClashEvents = [
      {
        event: "AttackResolved",
        data: {
          attackResult: clashResult,
          attacker: combat.turn.attacker.id,
          defender: defender.id
        }
      }
    ];

    return {
      ...combat,
      turn: {
        ...turn,
        step: "AttackResolved",
        currentDecision: undefined,
        defender: defenderAfterClash,
        attackResult: clashResult
      },
      charactersToAct: combat.participants
        .filter(character => combat.charactersToAct.includes(character.id))
        .sort(actingOrder)
        .map(character => character.id),
      events: combat.events
        .concat(declareDefenseEvents)
        .concat(resolvedClashEvents)
    };
  } else if (combat.turn.currentDecision === "attacker") {
    const { attackerStamina } = turnPatch;
    if (attackerStamina === undefined) {
      throw new ClientError(
        declareActionNoAttackerStamina("declareActionHigherIni")
      );
    }

    const staminaAmount = attackerStamina.impact + attackerStamina.damage;
    const attacker = investStamina(combat.turn.attacker, staminaAmount);

    const declareAttackEvents = [
      { event: "AttackDeclared", data: combat.turn.attacker.id }
    ];

    const turn = {
      ...combat.turn,
      attackerStamina
    };
    const attackResult = resolveAttack(turn);

    const defender = sufferConsequences(combat.turn.defender, attackResult);

    const resolvedAttackEvents = [
      {
        event: "AttackResolved",
        data: { attackResult, attacker: attacker.id, defender: defender.id }
      }
    ];

    return {
      ...combat,
      turn: {
        ...turn,
        step: "AttackResolved",
        currentDecision: undefined,
        attacker,
        defender,
        attackResult
      },
      charactersToAct: combat.participants
        .filter(character => combat.charactersToAct.includes(character.id))
        .sort(actingOrder)
        .map(character => character.id),
      events: combat.events
        .concat(declareAttackEvents)
        .concat(resolvedAttackEvents)
    };
  } else {
    throw new ClientError(
      "Unexpected combat.turn.currentDecision [" +
        combat.turn.currentDecision +
        "]"
    );
  }
}

const declareActionNoAttackerStamina = step =>
  "attackerStamina expected on [" + step + "] and currentDecision is attacker";

module.exports = {
  startCombat,
  NotEnoughParticipantsError,
  selectOpponent,
  SelectOpponentNoDefenderError,
  declareActionLowerIni,
  declareActionNoDefenderStamina,
  declareActionHigherIni,
  startTurn
};
