const { characteristics } = require("./characteristics");
const { longSword, roundShield, chainmail } = require("./equipment.spec");

describe("Character characteristics", () => {
  it("should calculate characteristics without equipment", () => {
    const character = {
      attributes: {
        endurance: 2,
        agility: 2,
        strength: 3,
        will: 3,
        intelligence: 2,
        leadership: 2,
        power: 2,
        defense: 2,
        extension: 1
      },
      equipment: {
        equipped: {
          hand1: {},
          hand2: {},
          body: {}
        },
        carried: []
      }
    };

    expect(characteristics(character)).toStrictEqual({
      initiative: {
        current: 4,
        max: 4
      },
      stamina: {
        current: 10,
        max: 10
      },
      impact: 5,
      damage: 0,
      damageType: "blunt",
      health: {
        current: 15,
        max: 15
      },
      dodge: 3,
      coverage: {
        current: 3,
        max: 3
      },
      blunt: 0,
      cut: 0,
      penetrating: 0,
      reach: 0
    });
  });

  it("should calculate characteristics with equipment", () => {
    const character = {
      attributes: {
        endurance: 2,
        agility: 2,
        strength: 3,
        will: 3,
        intelligence: 2,
        leadership: 2,
        power: 2,
        defense: 2,
        extension: 1
      },
      equipment: {
        equipped: {
          hand1: longSword,
          hand2: roundShield,
          body: chainmail,
          carried: []
        }
      }
    };

    expect(characteristics(character)).toStrictEqual({
      initiative: {
        current: 6,
        max: 6
      },
      stamina: {
        current: 10,
        max: 10
      },
      impact: 4,
      damage: 5,
      damageType: "cut",
      health: {
        current: 15,
        max: 15
      },
      dodge: 2,
      coverage: {
        current: 6,
        max: 6
      },
      blunt: 2,
      cut: 3,
      penetrating: 5,
      reach: 2
    });
  });
});
