const { startCombat, notEnoughParticipantsError } = require("./combat");

describe("Combat", () => {
  it("given combat with participants, when start combat, then set turn.attacker as highest Ini character", () => {
    const character1 = character("C1", 6);
    const character2 = character("C2", 5);
    const combat = { participants: [character1, character2] };

    const startedCombat = startCombat(combat);

    expect(startedCombat.turn.attacker).toEqual(character1);
  });

  it("given no participants, when start combat, then error", () => {
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
