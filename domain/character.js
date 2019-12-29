function character(characterData) {
  return {
    ...characterData,
    stamina: () => characterData.characteristics.stamina.current,
    investStamina: staminaAmount =>
      (characterData.characteristics.stamina.current =
        characterData.characteristics.stamina.current - staminaAmount)
  };
}

module.exports = {
  character
};
