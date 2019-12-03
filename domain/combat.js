exports.startCombat = combat => {
  // TODO TDD THIS:
  // TODO Validate characters exist, etc
  if (!combat.participants === undefined || combat.participants.length < 2) {
    throw new Error("There should be at least 2 participants to start combat");
  }

  // TODO Set character with highest Ini as turn.attacker

  return combat;
};
