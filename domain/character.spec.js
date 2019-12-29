const { givenCharacterData } = require("./givenCharacterData");
const { character } = require("./character");

describe("Character", () => {
  it("should return current stamina", () => {
    expect(character(givenCharacterData("C1", 6)).stamina()).toBe(10);
  });

  it("should invest stamina", () => {
    const c1 = character(givenCharacterData("C1", 6));
    const previousStamina = c1.stamina();

    c1.investStamina(1);

    expect(c1.stamina()).toBe(previousStamina - 1);
  });
});
