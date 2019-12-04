function startCombat(combat) {
  if (!enoughParticipants(combat)) {
    throw new Error(notEnoughParticipantsError);
  }

  // TODO Assume characters exist in the system (they have been validated before calling startCombat)

  // TODO Set character with highest Ini as turn.attacker
  const startedCombat = {
    ...combat,
    turn: {
      attacker: firstToAct(combat.participants)
    }
  };

  return startedCombat;
}

const notEnoughParticipantsError =
  "There should be at least 2 participants to start combat";

function enoughParticipants(combat) {
  return (
    typeof combat.participants !== "undefined" &&
    combat.participants.length >= 2
  );
}

function firstToAct(characters) {
  const reducer = (highestIni, current) => {
    if (
      highestIni === undefined ||
      current.characteristics.initiative.current >
        highestIni.characteristics.initiative.current
    ) {
      return current;
    } else {
      return highestIni;
    }
  };
  return characters.reduce(reducer);
}

module.exports = {
  startCombat,
  notEnoughParticipantsError
};
