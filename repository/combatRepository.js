const combatsById = new Map();

exports.saveCombat = async combat => {
  combatsById.set(combat.id, combat);
  return Promise.resolve(combat);
};

exports.getCombatById = async id => {
  return Promise.resolve(combatsById.get(id));
};

exports.listCombatsByUser = async userId => {
  return Promise.resolve([...combatsById.values()]);
};
