const { throwRunes } = require("./runes");

const agility = character => character.attributes.agility;
const strength = character => character.attributes.strength;
const will = character => character.attributes.will;

const stamina = character => character.characteristics.stamina.current;
const health = character => character.characteristics.health.current;

function investStamina(character, staminaAmount) {
  return {
    ...character,
    characteristics: {
      ...character.characteristics,
      stamina: {
        ...character.characteristics.stamina,
        current: character.characteristics.stamina.current - staminaAmount
      }
    }
  };
}

function resolveImpact(character, stamina) {
  return (
    throwRunes(impactRunes(character, stamina)) +
    character.equipment.equipped.hand1.impact
  );
}

function impactRunes(character, stamina) {
  if (!stamina) {
    stamina = 0;
  }
  return agility(character) * (stamina + 1);
}

function resolveDamage(character, stamina) {
  return (
    throwRunes(damageRunes(character, stamina)) +
    character.equipment.equipped.hand1.damage
  );
}

function damageRunes(character, stamina) {
  if (!stamina) {
    stamina = 0;
  }
  return strength(character) * (stamina + 1);
}

function resolveDodge(character, stamina) {
  return (
    throwRunes(dodgeRunes(character, stamina)) +
    character.equipment.equipped.body.dodge
  );
}

function dodgeRunes(character, stamina) {
  if (!stamina) {
    stamina = 0;
  }
  return agility(character) * (stamina + 1);
}

function resolveBlock(character, stamina) {
  return (
    throwRunes(blockRunes(character, stamina)) +
    // TODO specific resistance depending on impact on armor and damage type
    character.equipment.equipped.body.cut
  );
}

function blockRunes(character, stamina) {
  if (!stamina) {
    stamina = 0;
  }
  return strength(character) * (stamina + 1);
}

function sufferConsequences(character, attackResult) {
  return {
    ...character,
    characteristics: {
      ...character.characteristics,
      health: {
        ...character.characteristics.health,
        current: character.characteristics.health.current - attackResult.damage
      }
    }
  };
}

module.exports = {
  stamina,
  health,
  investStamina,
  sufferConsequences,
  resolveImpact,
  resolveDodge,
  resolveDamage,
  resolveBlock,
  impactRunes,
  will
};
