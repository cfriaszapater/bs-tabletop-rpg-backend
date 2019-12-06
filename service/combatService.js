const uuidv4 = require("uuid/v4");
const { startCombat } = require("../domain/combat");

module.exports = combatRepository => ({
  createCombat: async (combat, userId) => {
    const startedCombat = await startCombat({
      ...combat,
      user: userId,
      id: uuidv4()
    });
    return await combatRepository.saveCombat(startedCombat);
  },

  listCombatsByUser: async userId => {
    return combatRepository.listCombatsByUser(userId);
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
