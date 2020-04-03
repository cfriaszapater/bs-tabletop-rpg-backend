const { longestWeapon, shield, armor } = require("./equipment");

const longSword = {
  type: "weapon",
  weaponType: "sword",
  name: "long sword",
  id: "sw-1",
  level: 1,
  reach: 2,
  structure: 3,
  weight: 2,
  impact: 4,
  damage: 5,
  damageType: "cut"
};
const dagger = {
  type: "weapon",
  weaponType: "sword",
  name: "dagger",
  id: "sw-2",
  level: 1,
  reach: 0,
  structure: 3,
  weight: 0.5,
  impact: 4,
  damage: 4,
  damageType: "cut"
};
const roundShield = {
  type: "shield",
  name: "round shield",
  id: "sh-1",
  level: 1,
  structure: 1,
  weight: 1,
  dodge: 0,
  coverage: 1,
  blunt: 0,
  cut: 0,
  penetrating: 2
};
const chainmail = {
  type: "armor",
  name: "chainmail",
  id: "ch-1",
  level: 1,
  structure: 3,
  weight: 11,
  dodge: 2,
  coverage: 5,
  blunt: 2,
  cut: 3,
  penetrating: 3
};

const swordAndShield = {
  equipped: {
    hand1: longSword,
    hand2: roundShield
  },
  carried: []
};

const daggerAndSword = {
  equipped: {
    hand1: dagger,
    hand2: longSword
  },
  carried: []
};

const swordShieldAndArmor = {
  ...swordAndShield,
  equipped: {
    ...swordAndShield.equipped,
    body: chainmail
  }
};

describe("Character equipment", () => {
  it("should return longest weapon", () => {
    expect(longestWeapon(swordAndShield)).toStrictEqual(longSword);
    expect(longestWeapon(daggerAndSword)).toStrictEqual(longSword);
  });

  it("should return shield", () => {
    expect(shield(swordAndShield)).toStrictEqual(roundShield);
  });

  it("should return armor", () => {
    expect(armor(swordShieldAndArmor)).toStrictEqual(chainmail);
  });
});

module.exports = {
  longSword,
  dagger,
  roundShield,
  chainmail
};
