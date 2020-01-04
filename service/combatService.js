const uuidv4 = require("uuid/v4");
const {
  startCombat,
  selectOpponent,
  declareActionLowerIni,
  declareActionHigherIni,
  startTurn
} = require("../domain/combat");
const { character } = require("../domain/character");

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
      throw "Turn [" +
        turnNumber +
        "] does not match the current turn [" +
        combat.turn.number +
        "]";
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
      throw "Unexpected combat.turn.step [" + combat.turn.step + "]";
    }
  },

  startTurn: async (combatId, characterId) => {
    const combat = await combatRepository.findById(combatId);
    const character = await characterRepository.findById(characterId);
    if (combat.turn.step === "AttackResolved") {
      const patchedCombat = startTurn(combat, character);
      return await combatRepository.save(patchedCombat);
    } else {
      throw "Unexpected combat.turn.step [" +
        combat.turn.step +
        "], should be AttackResolved for startTurn";
    }
  },

  listCombatsByUser: async userId => {
    return combatRepository.listByUser(userId);
  },

  declareAttack: async (combatId, attackNumber, attackStamina, userId) => {
    // TODO find combat by id
    /* TODO BEGIN DOMAIN LOGIC */
    // Check if attack declaration is correct:
    // - combat.turn.currentDecision === "attacker"
    // - attackNumber === combat.turn.attacks.length (it's the current attack)
    // - userId owns combat.turn.attacker character
    // If pending attacker or defender declaration, just add declaration to attack and modify currentDecision
    // - add attackStamina to attack[attackNumber]
    // Else (attacker and defender declarations are complete in attack), resolve attack
    // - throw runes, cause damage
    // - const resolvedTurn = turn in "AttackResolved" step with attack result
    // - as we don't implement yet post-attack actions, automatically end turn
    //   - turns.push(turn)
    //   - set combat.turn as undefined
    // - schedule next turn start with setTimeout ?
    //   - next turn start:
    //     - turn = next turn
    //     - as we're in 1v1 combat, select opponent automatically, so go to step "DecideStaminaLowerIni"
    // - return resolvedTurn
    /* TODO END DOMAIN LOGIC */
    // TODO update combat, eg if attack is not resolved, something like:
    // await Combat.where({ _id: combatId, "turn.currentDecision": "attacker" })
    //   .update(
    //     { "turn.attacks.id": attackNumber },
    //     { $set: { "turn.attacks.$.attackerStamina": attackStamina } }
    //   )
    //   .exec();
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
      combat.participants.map(characterId =>
        characterRepository.findById(characterId)
      )
    )
  };
}
