const charactersById = new Map();

exports.save = async character => {
  charactersById.set(character.id, character);
  return Promise.resolve(character);
};

exports.findById = async id => {
  return Promise.resolve(charactersById.get(id));
};

exports.listByUser = async userId => {
  return Promise.resolve([...charactersById.values()]);
};
