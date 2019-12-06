const debug = require("debug")("bs-tabletop-rpg-backend:service:character");
const uuidv4 = require("uuid/v4");

module.exports = characterRepository => ({
  createCharacter: async (character, userId) => {
    const id = uuidv4();
    debug("id: " + id);
    character.id = id;
    return await characterRepository.saveCharacter(character);
  },

  getCharacterById: async (id, userId) => {
    return characterRepository.getCharacterById(id);
  },

  listCharactersByUser: async userId => {
    return characterRepository.listCharactersByUser(userId);
  }
});
