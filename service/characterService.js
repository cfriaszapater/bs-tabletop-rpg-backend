const debug = require("debug")("bs-tabletop-rpg-backend:service:character");
const uuidv4 = require("uuid/v4");

module.exports = characterRepository => ({
  createCharacter: async (character, userId) => {
    if (!character) {
      character = emptyCharacter();
    }

    const id = uuidv4();
    character.id = id;

    debug("creating character " + JSON.stringify(character));
    return await characterRepository.save(character);
  },

  getCharacterById: async (id, userId) => {
    return characterRepository.findById(id);
  },

  listCharactersByUser: async userId => {
    return characterRepository.listByUser(userId);
  }
});

function emptyCharacter() {
  return {
    attributes: {
      endurance: 0,
      agility: 0,
      strength: 0,
      will: 0,
      intelligence: 0,
      leadership: 0,
      power: 0,
      defense: 0,
      extension: 0
    }
  };
}
