const {
  startCombat,
  selectOpponent,
  notEnoughParticipantsError,
  selectOpponentNoDefenderError
} = require("./combat");
const random = require("../util/random");
jest.mock("../util/random");

describe("Combat", () => {
  it("should highest Ini character be turn.attacker on combat start", () => {
    const character1 = character("C1", 6);
    const character2 = character("C2", 5);
    const combat = { participants: [character1, character2] };

    const startedCombat = startCombat(combat);

    expect(startedCombat.turn.attacker).toEqual(character1);
  });

  it("should highest reach character be turn.attacker on combat start and equal Ini", () => {
    const character1 = character("C1", 6, 1);
    const character2 = character("C2", 6, 2);
    const combat = { participants: [character1, character2] };

    const startedCombat = startCombat(combat);

    expect(startedCombat.turn.attacker).toEqual(character2);
  });

  it("should highest Agi character be turn.attacker on combat start and equal Ini, reach", () => {
    const character1 = character("C1", 6, 1, 2);
    const character2 = character("C2", 6, 1, 3);
    const combat = { participants: [character1, character2] };

    const startedCombat = startCombat(combat);

    expect(startedCombat.turn.attacker).toEqual(character2);
  });

  it("should highest Int character be turn.attacker on combat start and equal Ini, reach, Agi", () => {
    const character1 = character("C1", 6, 1, 2, 3);
    const character2 = character("C2", 6, 1, 2, 2);
    const combat = { participants: [character1, character2] };

    const startedCombat = startCombat(combat);

    expect(startedCombat.turn.attacker).toEqual(character1);
  });

  it("should random character be turn.attacker on combat start and equal Ini, reach, Agi, Int", () => {
    random.getRandomInt.mockReturnValue(1);

    const character1 = character("C1", 6, 1, 2, 2);
    const character2 = character("C2", 6, 1, 2, 2);
    const combat = { participants: [character1, character2] };

    const startedCombat = startCombat(combat);

    expect(startedCombat.turn.attacker).toEqual(character2);
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
      startCombat({ participants: [character("jarl", 1)] });
    }).toThrow(notEnoughParticipantsError);
  });
});

it("should start combat", () => {
  const actingCharacterId = "C1";
  const combat = {
    participants: [character(actingCharacterId, 6), character("C2", 5)]
  };

  const startedCombat = startCombat(combat);

  expect(startedCombat.turn.step).toEqual("SelectOpponent");
  expect(startedCombat.turn.number).toBe(1);
  expect(startedCombat.events.length).toBe(2);
  expect(startedCombat.events[0]).toEqual({ event: "CombatStarted" });
  expect(startedCombat.events[1]).toEqual({
    event: "TurnStarted",
    data: actingCharacterId
  });
});

it("should set charactersToAct on turn start", () => {
  const combat = {
    participants: [character("C1", 6), character("C2", 5)]
  };

  const startedCombat = startCombat(combat);

  expect(startedCombat.charactersToAct.length).toBe(1);
  expect(startedCombat.charactersToAct[0]).toEqual("C2");
});

it("should select opponent", () => {
  const combat = startCombat({
    participants: [character("C1", 6), character("C2", 5)]
  });

  const patchedCombat = selectOpponent(combat, { defender: "C2" });

  expect(patchedCombat.turn.defender.id).toBe("C2");
  expect(patchedCombat.turn.step).toBe("DecideStaminaLowerIni");
  expect(patchedCombat.turn.currentDecision).toBe("defender");
  expect(patchedCombat.events.length).toBe(combat.events.length + 1);
  expect(patchedCombat.events[patchedCombat.events.length - 1]).toEqual({
    event: "OpponentSelected",
    data: "C2"
  });
});

it("should error on select opponent without defender", () => {
  const actingCharacterId = "C1";
  const combat = startCombat({
    participants: [character(actingCharacterId, 6), character("C2", 5)]
  });

  expect(() => {
    selectOpponent(combat, { jarl: "C2" });
  }).toThrow(selectOpponentNoDefenderError);
});

// Character with only the attributes needed to decide who acts first in initiative turn
function character(id, ini, reach, agi, int) {
  return {
    id: id,
    attributes: {
      agility: agi,
      intelligence: int
    },
    characteristics: {
      initiative: {
        current: ini
      },
      reach: reach
    }
  };
}
