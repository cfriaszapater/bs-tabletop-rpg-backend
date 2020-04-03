const debug = require("debug")("bs-tabletop-rpg-backend:service:character");
const uuidv4 = require("uuid/v4");
const { isEmptyObject } = require("../util/isEmptyObject");
const { emptyCharacter, updateCharacter } = require("../domain/character");

module.exports = characterRepository => ({
  createCharacter: async (character, userId) => {
    if (isEmptyObject(character)) {
      character = emptyCharacter();
    }

    const id = uuidv4();
    character.id = id;

    debug("creating character " + JSON.stringify(character));
    return await characterRepository.save(character);
  },

  updateCharacter: async (character, userId) => {
    debug("updating character " + JSON.stringify(character));

    const previousCharacter = await characterRepository.findById(character.id);

    const updatedCharacter = await updateCharacter(
      previousCharacter,
      character
    );

    return await characterRepository.save(updatedCharacter);
  },
  getCharacterById: async (id, userId) => {
    return characterRepository.findById(id);
  },

  listCharactersByUser: async userId => {
    return characterRepository.listByUser(userId);
  }
});
