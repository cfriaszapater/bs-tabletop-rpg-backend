const combatsById = new Map();

exports.save = async combat => {
  combatsById.set(combat.id, combat);
  return Promise.resolve(combat);
};

exports.findById = async id => {
  return Promise.resolve(combatsById.get(id));
};

exports.listByUser = async userId => {
  return Promise.resolve([...combatsById.values()]);
};
