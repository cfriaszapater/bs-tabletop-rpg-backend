const { givenCharacterData } = require("./givenCharacterData");
const {
  stamina,
  health,
  investStamina,
  sufferConsequences
} = require("./character");

describe("Character", () => {
  it("should return current stamina", () => {
    expect(stamina(givenCharacterData("C1", 6))).toBe(10);
  });

  it("should invest stamina", () => {
    const c1 = givenCharacterData("C1", 6);

    const c2 = investStamina(c1, 1);

    expect(c2.characteristics.stamina.current).toBe(stamina(c1) - 1);
    expect(stamina(c2)).toBe(stamina(c1) - 1);
  });

  it("should suffer consequences of resolved attack", () => {
    const c1 = givenCharacterData("C1", 6);
    const attack1 = { hit: true, damage: 4 };

    const c2 = sufferConsequences(c1, attack1);

    expect(health(c2)).toBe(health(c1) - attack1.damage);
  });
});
