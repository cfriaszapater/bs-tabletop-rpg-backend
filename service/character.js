const debug = require("debug")("bs-tabletop-rpg-backend:domain:character");
const uuidv4 = require("uuid/v4");

const charactersById = new Map();

exports.createCharacter = async function createCharacter(character, userId) {
  const id = uuidv4();
  debug("id: " + id);
  character.id = id;
  charactersById.set(id, character);
  debug("saved character: " + JSON.stringify(character));
  return character;
};

exports.getCharacterById = async function getCharacterById(id, userId) {
  return charactersById.get(id);
};

exports.listCharactersByUser = async function listCharactersByUser(userId) {
  return [...charactersById.values()];
};
