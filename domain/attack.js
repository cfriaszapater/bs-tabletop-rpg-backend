const {
  resolveImpact,
  resolveDodge,
  resolveDamage,
  resolveBlock,
  will
} = require("./character");

function resolveAttack(turn) {
  const { attacker, attackerStamina, defender, defenderStamina } = turn;
  const hit =
    resolveImpact(attacker, attackerStamina.impact) >
    resolveDodge(defender, defenderStamina.dodge);
  const damage = Math.max(
    hit
      ? resolveDamage(attacker, attackerStamina.damage) -
          resolveBlock(defender, defenderStamina.block)
      : 0,
    0
  );
  return {
    hit,
    damage,
    coverageDamage: 0,
    stunned: stun(damage, will(defender))
  };
}

function stun(damage, will) {
  if (damage <= will) {
    return 0;
  } else if (damage > 2 * will) {
    return 2;
  } else if (damage > will) {
    return 1;
  }
}

module.exports = {
  resolveAttack
};
