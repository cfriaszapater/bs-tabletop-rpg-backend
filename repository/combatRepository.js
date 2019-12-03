const combatsById = new Map();

exports.saveCombat = async combat => {
  combatsById.set(combat.id, combat);
  return combat;
};

exports.getCombatById = async id => {
  return combatsById.get(id);
};

exports.listCombatsByUser = async userId => {
  return [...combatsById.values()];
};
