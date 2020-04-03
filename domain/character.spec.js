const { givenCharacterData } = require("./givenCharacterData");
const {
  stamina,
  health,
  investStamina,
  sufferConsequences,
  resolveImpact,
  impactRunes,
  updateCharacter
} = require("./character");
const runes = require("./runes");
jest.mock("./runes");

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
    const attackResult = { hit: true, damage: 4 };

    const c2 = sufferConsequences(c1, attackResult);

    expect(health(c2)).toBe(health(c1) - attackResult.damage);
  });

  it("should impact runes be agility", () => {
    const c1 = givenCharacterData("C1", 6, 2, 3);

    expect(impactRunes(c1)).toBe(3);
  });

  it("should impact runes be agility * 2 with stamina", () => {
    const c1 = givenCharacterData("C1", 6, 2, 3);

    expect(impactRunes(c1, 1)).toBe(6);
  });

  it("should resolve impact", () => {
    const c1 = givenCharacterData("C1", 6);
    runes.throwRunes.mockReturnValue(2);

    const finalImpact = resolveImpact(c1, 1);

    expect(finalImpact).toBe(6);
  });

  test.todo(
    "should calc characteristics on update character with attributes change"
  );
  test.todo(
    "should store characteristics on update character with legal characteristics change"
  );
  test.todo(
    "should calc characteristics on update character on equipment change"
  );
  test.todo(
    "should error on update character with illegal characteristics change"
  );
});
