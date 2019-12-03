var mongoose = require("mongoose");

var Schema = mongoose.Schema;

const AttackSchema = {
  id: Number,
  attackerStamina: { impact: Number, damage: Number },
  defenderStamina: { dodge: Number, block: Number }
};
var CombatSchema = new Schema({
  turn: {
    step: String,
    attacker: Schema.Types.Mixed,
    defender: Schema.Types.Mixed,
    attacks: [AttackSchema],
    currentDecision: String
  },
  participants: [Schema.Types.Mixed],
  rounds: [Schema.Types.Mixed],
  user: Schema.Types.ObjectId
});

// Export model
module.exports = mongoose.model("Combat", CombatSchema);
