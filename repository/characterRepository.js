const charactersById = new Map();

exports.saveCharacter = async character => {
  charactersById.set(character.id, character);
  return character;
};

exports.getCharacterById = async id => {
  return charactersById.get(id);
};

exports.listCharactersByUser = async userId => {
  return [...charactersById.values()];
};
