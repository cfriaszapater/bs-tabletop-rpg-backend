const { resolveAttack } = require("./attack");
const { givenCharacterData } = require("./givenCharacterData");
const character = require("./character");
jest.mock("./character");

describe("Attack resolution", () => {
  it("should resolve attack", () => {
    character.resolveImpact.mockReturnValue(5);
    character.resolveDodge.mockReturnValue(4);
    character.resolveDamage.mockReturnValue(6);
    character.resolveBlock.mockReturnValue(3);
    character.will.mockReturnValue(2);

    const attackResult = resolveAttack({
      attacker: givenCharacterData("C1"),
      attackerStamina: { impact: 0, damage: 0 },
      defender: givenCharacterData("C2"),
      defenderStamina: { dodge: 0, block: 0 }
    });

    expect(attackResult).toEqual({
      hit: true,
      damage: 3,
      coverageDamage: 0,
      stunned: 1
    });
  });
});
