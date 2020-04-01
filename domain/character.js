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
    name: "The Nameless One",
    // XXX stub initial attributes until calc characteristics is done
    attributes: {
      endurance: 2,
      agility: 2,
      strength: 3,
      will: 3,
      intelligence: 2,
      leadership: 2,
      power: 2,
      defense: 2,
      extension: 1
    },
    // XXX fixed characteristics until calc characteristics is done
    characteristics: {
      initiative: {
        current: 5,
        max: 6
      },
      stamina: {
        current: 9,
        max: 10
      },
      impact: 4,
      damage: 5,
      health: {
        current: 14,
        max: 15
      },
      dodge: 2,
      coverage: {
        current: 5,
        max: 6
      },
      blunt: 2,
      cut: 3,
      penetrating: 5,
      reach: 2
    },
    // XXX stub equipment until buying is implemented
    equipment: {
      equipped: {
        hand1: {
          type: "weapon",
          weaponType: "sword",
          name: "long sword",
          id: "sw-1",
          level: 1,
          reach: 2,
          structure: 3,
          weight: 2
        },
        hand2: {
          type: "shield",
          name: "round shield",
          id: "sh-1",
          level: 1,
          structure: 1,
          weight: 1,
          dodge: 0,
          coverage: 1,
          blunt: 0,
          cut: 0,
          penetrating: 2
        },
        body: {
          type: "armor",
          name: "chainmail",
          id: "ch-1",
          level: 1,
          structure: 3,
          weight: 11,
          dodge: 2,
          coverage: 5,
          blunt: 2,
          cut: 3,
          penetrating: 3
        }
      },
      carried: [
        {
          type: "weapon",
          weaponType: "sword",
          name: "dagger",
          id: "dagger-1",
          level: 1,
          reach: 0,
          structure: 3,
          weight: 0.5
        },
        {
          type: "weapon",
          weaponType: "sword",
          name: "long sword",
          id: "sw-1",
          level: 1,
          reach: 2,
          structure: 3,
          weight: 2
        },
        {
          type: "shield",
          name: "round shield",
          id: "sh-1",
          level: 1,
          structure: 1,
          weight: 1,
          dodge: 0,
          coverage: 1,
          blunt: 0,
          cut: 0,
          penetrating: 2
        },
        {
          type: "armor",
          name: "chainmail",
          id: "ch-1",
          level: 1,
          structure: 3,
          weight: 11,
          dodge: 2,
          coverage: 5,
          blunt: 2,
          cut: 3,
          penetrating: 3
        },
        {
          type: "misc",
          id: "misc-1",
          weight: 0,
          level: 1,
          name: "flask"
        }
      ]
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
  will,
  emptyCharacter
};
