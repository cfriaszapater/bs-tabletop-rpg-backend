const { givenCharacterData } = require("./givenCharacterData");
const { stamina, investStamina } = require("./character");

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
});
