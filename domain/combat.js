const random = require("../util/random");
const { resolveAttack } = require("./attack");
const { investStamina, sufferConsequences } = require("./character");

function startCombat(combat) {
  if (!enoughParticipants(combat)) {
    throw new Error(notEnoughParticipantsError);
  }

  // TODO Assume characters exist in the system (they have been validated before calling startCombat)

  const attacker = firstToAct(combat.participants);

  return startTurn(_startCombat(combat), attacker);
}

function _startCombat(combat) {
  return {
    ...combat,
    charactersToAct: combat.participants.map(character => character.id),
    events: [{ event: "CombatStarted" }],
    pastTurns: []
  };
}

function startTurn(combat, attacker) {
  if (combat.turn) {
    // Turn after first
    if (combat.turn.step !== "AttackResolved") {
      throw "Unexpected step [" + combat.turn.step + "] on startTurn";
    }
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

const notEnoughParticipantsError =
  "There should be at least 2 participants to start combat";

function enoughParticipants(combat) {
  return (
    typeof combat.participants !== "undefined" &&
    combat.participants.length >= 2
  );
}

function firstToAct(characters) {
  const reducer = (actsFirst, current) => {
    if (actsFirst === undefined || actingOrder(actsFirst, current) > 0) {
      return current;
    } else {
      return actsFirst;
    }
  };
  return characters.reduce(reducer);
}

/**
 * Returns:
 * &lt; 0 if c1 acts first,
 * &gt; 0 if c2 acts first
 */
function actingOrder(c1, c2) {
  // Compare (in order of precedence): Ini, reach, Agi, Int
  const iniDif =
    c2.characteristics.initiative.current -
    c1.characteristics.initiative.current;
  const reachDif = c2.characteristics.reach - c1.characteristics.reach;
  const agiDif = c2.attributes.agility - c1.attributes.agility;
  const intDif = c2.attributes.intelligence - c1.attributes.intelligence;
  if (iniDif !== 0) {
    return iniDif;
  } else if (reachDif !== 0) {
    return reachDif;
  } else if (agiDif !== 0) {
    return agiDif;
  } else if (intDif !== 0) {
    return intDif;
  } else {
    // Note: not implemented the last comparison criterion (max weapon skill level of wielded weapons)
    return random.getRandomInt(2) === 1 ? 1 : -1;
  }
}

const selectOpponentNoDefenderError = "defender expected on selectOpponent";

function selectOpponent(combat, turnPatch /*, userId*/) {
  // if (combat.turn.attacker.user !== userId) {
  //   throw "User " +
  //     userId +
  //     " not allowed to select opponent at this turn step " +
  //     combat.turn.step;
  // }
  const defenderId = turnPatch.defender;
  if (defenderId === undefined) {
    throw selectOpponentNoDefenderError;
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
      throw declareActionNoDefenderStamina;
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
      throw declareActionNoAttackerStamina("declareActionLowerIni");
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
    throw "Unexpected combat.turn.currentDecision [" +
      combat.turn.currentDecision +
      "]";
  }
}

const declareActionNoDefenderStamina =
  "defenderStamina expected on declareActionLowerIni and currentDecision is defender";

function declareActionHigherIni(combat, turnPatch) {
  if (combat.turn.currentDecision === "defender") {
    // TODO combat.turn.currentDecision === "defender"
    throw "TODO";
  } else if (combat.turn.currentDecision === "attacker") {
    const { attackerStamina } = turnPatch;
    if (attackerStamina === undefined) {
      throw declareActionNoAttackerStamina("declareActionHigherIni");
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
      events: combat.events
        .concat(declareAttackEvents)
        .concat(resolvedAttackEvents)
    };
  } else {
    throw "Unexpected combat.turn.currentDecision [" +
      combat.turn.currentDecision +
      "]";
  }
}

const declareActionNoAttackerStamina = step =>
  "attackerStamina expected on [" + step + "] and currentDecision is attacker";

module.exports = {
  startCombat,
  notEnoughParticipantsError,
  selectOpponent,
  selectOpponentNoDefenderError,
  declareActionLowerIni,
  declareActionNoDefenderStamina,
  declareActionHigherIni,
  startTurn
};
