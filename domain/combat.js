const random = require("../util/random");

function startCombat(combat) {
  if (!enoughParticipants(combat)) {
    throw new Error(notEnoughParticipantsError);
  }

  // TODO Assume characters exist in the system (they have been validated before calling startCombat)

  const attacker = firstToAct(combat.participants);
  const startCombatEvents = [
    { event: "CombatStarted" },
    {
      event: "TurnStarted",
      data: attacker.id
    }
  ];
  const startedCombat = {
    ...combat,
    turn: {
      attacker: attacker,
      step: "SelectOpponent"
    },
    charactersToAct: combat.participants
      .filter(character => character.id !== attacker.id)
      .map(character => character.id),
    events: startCombatEvents
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
  const reducer = (actsFirst, current) => {
    if (actsFirst === undefined || actingOrder(actsFirst, current) > 0) {
      return current;
    } else {
      return actsFirst;
    }
  };
  return characters.reduce(reducer);
}

/**
 * Returns:
 * < 0 if c1 acts first
 * 0 if there is a tie
 * > 0 if c2 acts first
 */
function actingOrder(c1, c2) {
  // Compare (in order of precedence): Ini, reach, Agi, Int
  const iniDif =
    c2.characteristics.initiative.current -
    c1.characteristics.initiative.current;
  const reachDif = c2.characteristics.reach - c1.characteristics.reach;
  const agiDif = c2.attributes.agility - c1.attributes.agility;
  const intDif = c2.attributes.intelligence - c1.attributes.intelligence;
  if (iniDif !== 0) {
    return iniDif;
  } else if (reachDif !== 0) {
    return reachDif;
  } else if (agiDif !== 0) {
    return agiDif;
  } else if (intDif !== 0) {
    return intDif;
  } else {
    // Note: not implemented the last comparison criterion (max weapon skill level of wielded weapons)
    return random.getRandomInt(2);
  }
}

module.exports = {
  startCombat,
  notEnoughParticipantsError
};
