// Just enough character attributes needed in specs
function givenCharacterData(id, ini, reach, agi, int) {
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
      reach: reach,
      stamina: {
        current: 10
      },
      health: {
        current: 10
      }
    }
  };
}

exports.givenCharacterData = givenCharacterData;
