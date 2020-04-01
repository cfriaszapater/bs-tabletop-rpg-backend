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

function emptyCharacter() {
  return {
    attributes: {
      endurance: 0,
      agility: 0,
      strength: 0,
      will: 0,
      intelligence: 0,
      leadership: 0,
      power: 0,
      defense: 0,
      extension: 0
    },
    characteristics: {
      initiative: {
        current: 0,
        max: 0
      },
      stamina: {
        current: 0,
        max: 0
      },
      impact: 0,
      damage: 0,
      health: {
        current: 0,
        max: 0
      },
      dodge: 0,
      coverage: {
        current: 0,
        max: 0
      },
      blunt: 0,
      cut: 0,
      penetrating: 0,
      reach: 0
    },
    equipment: { equipped: {}, carried: [] }
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
  will,
  emptyCharacter
};
