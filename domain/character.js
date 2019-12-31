const stamina = character => character.characteristics.stamina.current;

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

module.exports = {
  stamina,
  investStamina
};
