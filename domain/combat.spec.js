const { givenCharacterData } = require("./givenCharacterData");
const {
  startCombat,
  selectOpponent,
  declareActionLowerIni,
  declareActionHigherIni,
  notEnoughParticipantsError,
  selectOpponentNoDefenderError,
  startTurn
} = require("./combat");
const { stamina, health } = require("./character");
const random = require("../util/random");
jest.mock("../util/random");
const attack = require("./attack");
jest.mock("./attack");

describe("Combat", () => {
  it("should highest Ini character be turn.attacker on combat start", () => {
    const character1 = givenCharacterData("C1", 6);
    const character2 = givenCharacterData("C2", 5);
    const combat = { participants: [character1, character2] };

    const startedCombat = startCombat(combat);

    expect(startedCombat.turn.attacker).toEqual(character1);
  });

  it("should highest reach character be turn.attacker on combat start and equal Ini", () => {
    const character1 = givenCharacterData("C1", 6, 1);
    const character2 = givenCharacterData("C2", 6, 2);
    const combat = { participants: [character1, character2] };

    const startedCombat = startCombat(combat);

    expect(startedCombat.turn.attacker).toEqual(character2);
  });

  it("should highest Agi character be turn.attacker on combat start and equal Ini, reach", () => {
    const character1 = givenCharacterData("C1", 6, 1, 2);
    const character2 = givenCharacterData("C2", 6, 1, 3);
    const combat = { participants: [character1, character2] };

    const startedCombat = startCombat(combat);

    expect(startedCombat.turn.attacker).toEqual(character2);
  });

  it("should highest Int character be turn.attacker on combat start and equal Ini, reach, Agi", () => {
    const character1 = givenCharacterData("C1", 6, 1, 2, 3);
    const character2 = givenCharacterData("C2", 6, 1, 2, 2);
    const combat = { participants: [character1, character2] };

    const startedCombat = startCombat(combat);

    expect(startedCombat.turn.attacker).toEqual(character1);
  });

  it("should random character be turn.attacker on combat start and equal Ini, reach, Agi, Int", () => {
    random.getRandomInt.mockReturnValue(1);

    const character1 = givenCharacterData("C1", 6, 1, 2, 2);
    const character2 = givenCharacterData("C2", 6, 1, 2, 2);
    const combat = { participants: [character1, character2] };

    const startedCombat = startCombat(combat);

    expect(startedCombat.turn.attacker).toEqual(character1);
  });

  it("should error on combat start with no participants", () => {
    expect(() => {
      startCombat({});
    }).toThrow("2 participant");

    expect(() => {
      startCombat({ participants: undefined });
    }).toThrow(notEnoughParticipantsError);

    expect(() => {
      startCombat({ participants: [] });
    }).toThrow(notEnoughParticipantsError);

    expect(() => {
      startCombat({ participants: [givenCharacterData("jarl", 1)] });
    }).toThrow(notEnoughParticipantsError);
  });

  it("should start combat and first turn", () => {
    const actingCharacterId = "C1";
    const combat = {
      participants: [
        givenCharacterData(actingCharacterId, 6),
        givenCharacterData("C2", 5)
      ]
    };

    const startedCombat = startCombat(combat);

    expect(startedCombat.turn.step).toBe("SelectOpponent");
    expect(startedCombat.turn.number).toBe(1);
    expect(startedCombat.events.length).toBe(2);
    expect(startedCombat.events[0]).toEqual({ event: "CombatStarted" });
    expect(startedCombat.events[1]).toEqual({
      event: "TurnStarted",
      data: actingCharacterId
    });
  });

  it("should set charactersToAct on combat start", () => {
    const combat = {
      participants: [givenCharacterData("C1", 6), givenCharacterData("C2", 5)]
    };

    const startedCombat = startCombat(combat);

    expect(startedCombat.charactersToAct.length).toBe(1);
    expect(startedCombat.charactersToAct[0]).toEqual("C2");
  });

  it("should be currentDecision 'defender' on lower ini defender for step DecideStaminaLowerIni", () => {
    const combat = startCombat({
      participants: [givenCharacterData("C1", 6), givenCharacterData("C2", 5)]
    });

    const patchedCombat = selectOpponent(combat, { defender: "C2" });

    expect(patchedCombat.turn.defender.id).toBe("C2");
    expect(patchedCombat.turn.step).toBe("DecideStaminaLowerIni");
    expect(patchedCombat.turn.number).toBe(1);
    expect(patchedCombat.turn.currentDecision).toBe("defender");
    expect(patchedCombat.events.length).toBe(combat.events.length + 1);
    expect(patchedCombat.events[patchedCombat.events.length - 1]).toEqual({
      event: "OpponentSelected",
      data: "C2"
    });
  });

  it("should be currentDecision 'attacker' on lower ini attacker for step DecideStaminaLowerIni", () => {
    const combat = startCombat({
      participants: [givenCharacterData("C1", 3), givenCharacterData("C2", 5)]
    });

    const patchedCombat = selectOpponent(combat, { defender: "C2" });

    expect(patchedCombat.turn.defender.id).toBe("C2");
    expect(patchedCombat.turn.step).toBe("DecideStaminaLowerIni");
    expect(patchedCombat.turn.number).toBe(1);
    expect(patchedCombat.turn.currentDecision).toBe("attacker");
    expect(patchedCombat.events.length).toBe(combat.events.length + 1);
    expect(patchedCombat.events[patchedCombat.events.length - 1]).toEqual({
      event: "OpponentSelected",
      data: "C2"
    });
  });

  it("should error on select opponent without defender", () => {
    const combat = startCombat({
      participants: [givenCharacterData("C1", 6), givenCharacterData("C2", 5)]
    });

    expect(() => {
      selectOpponent(combat, { jarl: "C2" });
    }).toThrow(selectOpponentNoDefenderError);
  });

  it("should lower ini defender declare action on higher ini attacker selected opponent", () => {
    const defender = givenCharacterData("C2", 5);
    const startedCombat = startCombat({
      participants: [givenCharacterData("C1", 6), defender]
    });
    const opponentSelected = selectOpponent(startedCombat, { defender: "C2" });
    const defenderPreviousStamina = stamina(defender);

    const defenderStamina = { dodge: 1, block: 1 };
    const patchedCombat = declareActionLowerIni(opponentSelected, {
      defenderStamina
    });

    expect(patchedCombat.turn.defenderStamina).toBe(defenderStamina);
    expect(patchedCombat.events.length).toBe(
      opponentSelected.events.length + 1
    );
    expect(patchedCombat.events[patchedCombat.events.length - 1]).toEqual({
      event: "DefenseDeclared",
      data: "C2"
    });
    expect(stamina(patchedCombat.turn.defender)).toBe(
      defenderPreviousStamina - 2
    );
    expect(patchedCombat.turn.currentDecision).toBe("attacker");
    expect(patchedCombat.turn.step).toBe("DecideStaminaHigherIni");
  });

  it("should higher ini attacker declare action and resolve attack", () => {
    const defender = givenCharacterData("C2", 4);
    const attacker = givenCharacterData("C1", 6);
    const startedCombat = startCombat({
      participants: [attacker, defender, givenCharacterData("C3", 5)]
    });
    const opponentSelected = selectOpponent(startedCombat, { defender: "C2" });
    const declaredActionLowerIni = declareActionLowerIni(opponentSelected, {
      defenderStamina: { dodge: 1, block: 1 }
    });
    const attackerPreviousStamina = stamina(attacker);
    const previousEventsLength = declaredActionLowerIni.events.length;
    const attackResult = {
      hit: true,
      damage: 1,
      coverageDamage: 0,
      stunned: 0
    };
    attack.resolveAttack.mockReturnValue(attackResult);
    const defenderPreviousHealth = health(defender);

    const attackerStamina = { impact: 1, damage: 1 };
    const patchedCombat = declareActionHigherIni(declaredActionLowerIni, {
      attackerStamina
    });

    expect(patchedCombat.turn.attackerStamina).toBe(attackerStamina);
    expect(patchedCombat.events.length).toBeGreaterThan(previousEventsLength);
    expect(patchedCombat.events[previousEventsLength]).toEqual({
      event: "AttackDeclared",
      data: "C1"
    });
    expect(stamina(patchedCombat.turn.attacker)).toBe(
      attackerPreviousStamina - 2
    );
    expect(patchedCombat.turn.currentDecision).toBeUndefined();
    expect(patchedCombat.turn.step).toBe("AttackResolved");
    expect(patchedCombat.turn.attackResult).toEqual(attackResult);
    expect(patchedCombat.events[previousEventsLength + 1]).toEqual({
      event: "AttackResolved",
      data: { attackResult, attacker: attacker.id, defender: defender.id }
    });
    expect(health(patchedCombat.turn.defender)).toBe(
      defenderPreviousHealth - attackResult.damage
    );
    expect(patchedCombat.charactersToAct).toEqual(["C3", "C2"]);
  });

  it("should start second turn", () => {
    const attackerInSecondTurn = givenCharacterData("C1", 6);
    const startedCombat = startCombat({
      participants: [attackerInSecondTurn, givenCharacterData("C2", 7)]
    });
    const firstTurnEnded = {
      ...startedCombat,
      turn: { ...startedCombat.turn, step: "AttackResolved" }
    };

    const secondTurnStarted = startTurn(firstTurnEnded, attackerInSecondTurn);

    expect(secondTurnStarted.turn.step).toBe("SelectOpponent");
    expect(secondTurnStarted.turn.number).toBe(2);
    expect(secondTurnStarted.events.length).toBe(
      firstTurnEnded.events.length + 1
    );
    expect(secondTurnStarted.events[firstTurnEnded.events.length]).toEqual({
      event: "TurnStarted",
      data: attackerInSecondTurn.id
    });
    expect(secondTurnStarted.turn.attacker).toEqual(attackerInSecondTurn);
  });

  it("should start third turn", () => {
    const attackerInThirdTurn = givenCharacterData("C1", 6);
    const startedCombat = startCombat({
      participants: [
        attackerInThirdTurn,
        givenCharacterData("C2", 8),
        givenCharacterData("C3", 7)
      ]
    });
    const secondTurnEnded = {
      ...startedCombat,
      charactersToAct: [attackerInThirdTurn.id],
      turn: { ...startedCombat.turn, step: "AttackResolved" },
      pastTurns: [{ ...startedCombat.turn, step: "AttackResolved" }]
    };

    const thirdTurnStarted = startTurn(secondTurnEnded, attackerInThirdTurn);

    expect(thirdTurnStarted.turn.step).toBe("SelectOpponent");
    expect(thirdTurnStarted.turn.number).toBe(3);
    expect(thirdTurnStarted.events.length).toBe(
      secondTurnEnded.events.length + 1
    );
    expect(thirdTurnStarted.events[secondTurnEnded.events.length]).toEqual({
      event: "TurnStarted",
      data: attackerInThirdTurn.id
    });
    expect(thirdTurnStarted.turn.attacker).toEqual(attackerInThirdTurn);
  });

  it("should lower ini attacker in second turn declare action after selecting opponent", () => {
    const attackerInSecondTurn = givenCharacterData("C1", 6);
    const startedCombat = startCombat({
      participants: [attackerInSecondTurn, givenCharacterData("C2", 7)]
    });
    const firstTurnEnded = {
      ...startedCombat,
      turn: { ...startedCombat.turn, step: "AttackResolved" }
    };
    const secondTurnStarted = startTurn(firstTurnEnded, attackerInSecondTurn);
    const opponentSelected = selectOpponent(secondTurnStarted, {
      defender: "C2"
    });
    const attackerPreviousStamina = stamina(attackerInSecondTurn);

    const attackerStamina = { impact: 0, damage: 1 };
    const patchedCombat = declareActionLowerIni(opponentSelected, {
      attackerStamina
    });

    expect(patchedCombat.turn.attackerStamina).toBe(attackerStamina);
    expect(patchedCombat.events.length).toBe(
      opponentSelected.events.length + 1
    );
    expect(patchedCombat.events[patchedCombat.events.length - 1]).toEqual({
      event: "AttackDeclared",
      data: "C1"
    });
    expect(stamina(patchedCombat.turn.attacker)).toBe(
      attackerPreviousStamina - 1
    );
    expect(patchedCombat.turn.currentDecision).toBe("defender");
    expect(patchedCombat.turn.step).toBe("DecideStaminaHigherIni");
  });

  it("should sort characters to act on resolve attack", () => {
    const c1 = givenCharacterData("C1", 6);
    const startedCombat = startCombat({
      participants: [
        c1,
        givenCharacterData("C2", 7),
        givenCharacterData("C3", 5)
      ]
    });
    expect(startedCombat.charactersToAct).toEqual(["C1", "C3"]);
    const opponentSelected = selectOpponent(startedCombat, { defender: "C1" });
    const declaredActionLowerIni = declareActionLowerIni(opponentSelected, {
      defenderStamina: { dodge: 1, block: 1 }
    });
    // Simulate C1 lost initiative
    declaredActionLowerIni.participants
      .filter(character => character.id === "C1")
      .forEach(character => {
        character.characteristics.initiative.current = 3;
      });

    const patchedCombat = declareActionHigherIni(declaredActionLowerIni, {
      attackerStamina: { impact: 1, damage: 1 }
    });

    expect(patchedCombat.charactersToAct).toEqual(["C3", "C1"]);
  });
});
