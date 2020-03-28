const uuidv4 = require("uuid/v4");
const {
  startCombat,
  selectOpponent,
  declareActionLowerIni,
  declareActionHigherIni,
  startTurn
} = require("../domain/combat");
const { BadRequestError } = require("../domain/BadRequestError");
const { UnexpectedError } = require("../domain/UnexpectedError");

module.exports = (combatRepository, characterRepository) => ({
  createCombat: async (combat, userId) => {
    const combatWithParticipants = await loadParticipants(
      combat,
      characterRepository
    );
    const startedCombat = await startCombat({
      ...combatWithParticipants,
      user: userId,
      id: uuidv4()
    });
    return await combatRepository.save(startedCombat);
  },

  /**
   * Execute an action in a turn (eg: SelectOpponent).
   *
   * Returns patched combat.
   */
  turnAction: async (combatId, turnNumber, turnPatch, userId) => {
    const combat = await combatRepository.findById(combatId);
    if (combat.turn.number !== turnNumber) {
      throw new BadRequestError(
        "Turn [" +
          turnNumber +
          "] does not match the current turn [" +
          combat.turn.number +
          "]"
      );
    }
    if (combat.turn.step === "SelectOpponent") {
      const patchedCombat = selectOpponent(combat, turnPatch, userId);
      return await combatRepository.save(patchedCombat);
    } else if (combat.turn.step === "DecideStaminaLowerIni") {
      const patchedCombat = declareActionLowerIni(combat, turnPatch, userId);
      return await save(patchedCombat, characterRepository, combatRepository);
    } else if (combat.turn.step === "DecideStaminaHigherIni") {
      const patchedCombat = declareActionHigherIni(combat, turnPatch, userId);
      return await save(patchedCombat, characterRepository, combatRepository);
    } else {
      throw new UnexpectedError(
        "Unexpected combat.turn.step [" + combat.turn.step + "]"
      );
    }
  },

  startTurn: async (combatId, characterId) => {
    const combat = await combatRepository.findById(combatId);
    const character = await characterRepository.findById(characterId);

    const patchedCombat = startTurn(combat, character);

    return await combatRepository.save(patchedCombat);
  },

  listCombatsByUser: async userId => {
    return combatRepository.listByUser(userId);
  }
});

async function save(patchedCombat, characterRepository, combatRepository) {
  await Promise.all([
    characterRepository.save(patchedCombat.turn.attacker),
    characterRepository.save(patchedCombat.turn.defender)
  ]);
  return await combatRepository.save(patchedCombat);
}

async function loadParticipants(combat, characterRepository) {
  return {
    ...combat,
    participants: await Promise.all(
      combat.participants.map(characterRepository.findById)
    )
  };
}
