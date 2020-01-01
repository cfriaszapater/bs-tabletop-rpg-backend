function resolveAttack(turn) {
  const { attacker, attackerStamina, defender, defenderStamina } = turn;
  return { hit: true, damage: 1, coverageDamage: 0, stunned: 0 };
}

module.exports = {
  resolveAttack
};
