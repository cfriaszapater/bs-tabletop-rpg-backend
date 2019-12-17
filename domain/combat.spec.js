const { startCombat, notEnoughParticipantsError } = require("./combat");
const random = require("../util/random");
jest.mock("../util/random");

describe("Combat", () => {
  it("should turn.attacker be highest Ini on combat start", () => {
    const character1 = character("C1", 6);
    const character2 = character("C2", 5);
    const combat = { participants: [character1, character2] };

    const startedCombat = startCombat(combat);

    expect(startedCombat.turn.attacker).toEqual(character1);
  });

  it("should turn.attacker be highest reach on combat start and equal Ini", () => {
    const character1 = character("C1", 6, 1);
    const character2 = character("C2", 6, 2);
    const combat = { participants: [character1, character2] };

    const startedCombat = startCombat(combat);

    expect(startedCombat.turn.attacker).toEqual(character2);
  });

  it("should turn.attacker be highest Agi on combat start and equal Ini, reach", () => {
    const character1 = character("C1", 6, 1, 2);
    const character2 = character("C2", 6, 1, 3);
    const combat = { participants: [character1, character2] };

    const startedCombat = startCombat(combat);

    expect(startedCombat.turn.attacker).toEqual(character2);
  });

  it("should turn.attacker be highest Int on combat start and equal Ini, reach, Agi", () => {
    const character1 = character("C1", 6, 1, 2, 3);
    const character2 = character("C2", 6, 1, 2, 2);
    const combat = { participants: [character1, character2] };

    const startedCombat = startCombat(combat);

    expect(startedCombat.turn.attacker).toEqual(character1);
  });

  it("should turn.attacker be random on combat start and equal Ini, reach, Agi, Int", () => {
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
