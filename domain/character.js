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
  sufferConsequences
};
