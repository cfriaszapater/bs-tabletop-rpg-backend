const { longestWeapon, armor, shield } = require("./equipment");

const NOARMOR_DODGE = 3;
const NOARMOR_COVERAGE = NOARMOR_DODGE;
const UNARMED_IMPACT = 5;
const UNARMED_DAMAGE = 0;
const UNARMED_DAMAGETYPE = "blunt";
const UNARMED_REACH = 0;

function characteristics(character) {
  const { endurance, agility, will, intelligence } = character.attributes;
  const { equipment } = character;
  const weapon = longestWeapon(equipment);
  const ini = initiative(intelligence, agility, weapon);
  const sta = 5 * endurance;
  const health = 5 * will;
  const _armor = armor(equipment);
  const _shield = shield(equipment);
  const cov = coverage(_armor, shield(equipment));
  return {
    initiative: {
      current: ini,
      max: ini
    },
    stamina: {
      current: sta,
      max: sta
    },
    impact: impact(weapon),
    damage: damage(weapon),
    damageType: damageType(weapon),
    health: {
      current: health,
      max: health
    },
    dodge: dodge(_armor),
    coverage: {
      current: cov,
      max: cov
    },
    blunt: blunt(_armor, _shield),
    cut: cut(_armor, _shield),
    penetrating: penetrating(_armor, _shield),
    reach: reach(weapon)
  };
}

function initiative(intelligence, agility, weapon) {
  return intelligence + agility + (weapon && weapon.reach);
}

function reach(weapon) {
  return weapon ? weapon.reach : UNARMED_REACH;
}

function impact(weapon) {
  return weapon ? weapon.impact : UNARMED_IMPACT;
}

function damage(weapon) {
  return weapon ? weapon.damage : UNARMED_DAMAGE;
}

function damageType(weapon) {
  return weapon ? weapon.damageType : UNARMED_DAMAGETYPE;
}

function dodge(armor) {
  return armor ? armor.dodge : NOARMOR_DODGE;
}

function coverage(armor, shield) {
  const armorCov = armor ? armor.coverage : NOARMOR_COVERAGE;
  const shieldCov = shield ? shield.coverage : 0;
  return armorCov + shieldCov;
}

function blunt(armor, shield) {
  const armorResistance = armor ? armor.blunt : 0;
  const shieldResistance = shield ? shield.blunt : 0;
  return armorResistance + shieldResistance;
}

function cut(armor, shield) {
  const armorResistance = armor ? armor.cut : 0;
  const shieldResistance = shield ? shield.cut : 0;
  return armorResistance + shieldResistance;
}

function penetrating(armor, shield) {
  const armorResistance = armor ? armor.penetrating : 0;
  const shieldResistance = shield ? shield.penetrating : 0;
  return armorResistance + shieldResistance;
}

module.exports = {
  characteristics
};
