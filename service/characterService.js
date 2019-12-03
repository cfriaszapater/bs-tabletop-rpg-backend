const debug = require("debug")("bs-tabletop-rpg-backend:service:character");
const uuidv4 = require("uuid/v4");
const {
  saveCharacter,
  getCharacterById,
  listCharactersByUser
} = require("../repository/characterRepository");

exports.createCharacter = async (character, userId) => {
  const id = uuidv4();
  debug("id: " + id);
  character.id = id;
  return await saveCharacter(character);
};

exports.getCharacterById = async (id, userId) => {
  return getCharacterById(id);
};

exports.listCharactersByUser = async userId => {
  return listCharactersByUser(userId);
};
