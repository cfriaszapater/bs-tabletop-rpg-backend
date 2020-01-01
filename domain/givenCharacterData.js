// Just enough character attributes needed in specs
function givenCharacterData(id, ini, reach, agi, int) {
  return {
    id: id,
    attributes: {
      agility: agi,
      intelligence: int,
      will: 2
    },
    characteristics: {
      initiative: {
        current: ini
      },
      reach: reach,
      stamina: {
        current: 10
      },
      health: {
        current: 10
      }
    },
    equipment: {
      equipped: {
        hand1: {
          weaponType: "sword",
          name: "long sword",
          id: "sw-1",
          level: 1,
          reach: 2,
          structure: 3,
          weight: 2,
          impact: 4,
          damage: 5
        },
        hand2: null,
        body: {
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
        }
      }
    }
  };
}

exports.givenCharacterData = givenCharacterData;
