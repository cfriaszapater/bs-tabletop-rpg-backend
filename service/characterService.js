const debug = require("debug")("bs-tabletop-rpg-backend:service:character");
const uuidv4 = require("uuid/v4");
const { isEmptyObject } = require("../util/isEmptyObject");
const { emptyCharacter } = require("../domain/character");

module.exports = characterRepository => ({
  createCharacter: async (character, userId) => {
    debug("received character " + JSON.stringify(character));
    if (isEmptyObject(character)) {
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
