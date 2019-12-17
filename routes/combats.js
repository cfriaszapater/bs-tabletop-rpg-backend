var express = require("express");
var router = express.Router();
var debug = require("debug")("bs-tabletop-rpg-backend:routers:combats");
const combatRepository = require("../repository/combatRepository");
const characterRepository = require("../repository/characterRepository");
const {
  createCombat,
  declareAttack,
  listCombatsByUser,
  turnAction
} = require("../service/combatService")(combatRepository, characterRepository);
const { validateNotEmpty } = require("./validateNotEmpty");

router.post("/", postCombat);
router.get("/", listCombats);
router.get("/:combatId", getCombat);
router.patch("/:combatId/turns/:turnId", patchTurn);
router.post(
  "/:combatId/turn/attacks/:attackNumber/attackerStamina",
  postAttackStamina
);

module.exports = router;

async function postCombat(req, res, next) {
  debug("postCombat", req.body);

  try {
    validateNotEmpty(req.body);
    var combat = await createCombat(req.body /*, req.user.sub*/);
    res.status(201).json(combat);
  } catch (err) {
    next(err);
  }
}

async function listCombats(req, res, next) {
  try {
    var combats = await listCombatsByUser(/*req.user.sub*/);
    res.status(200).json(combats);
  } catch (err) {
    next(err);
  }
}

async function getCombat(req, res, next) {
  debug("get combat", req.params.combatId);

  return "TODO combat";
}

async function patchTurn(req, res, next) {
  const { combatId, turnId } = req.params;
  const turnPatch = req.body;
  debug("patchTurn", combatId, turnId, turnPatch);

  try {
    validateNotEmpty(turnPatch);
    var turn = await turnAction(combatId, turnId, turnPatch /*, req.user.sub*/);
    res.status(200).json(turn);
  } catch (err) {
    next(err);
  }
  return "TODO return updated turn";
}

async function postAttackStamina(req, res, next) {
  const { combatId, attackNumber } = req.params;
  const attackStamina = req.body;
  debug("postAttack", combatId, attackStamina);

  try {
    validateNotEmpty(attackStamina);
    var turn = await declareAttack(
      combatId,
      attackNumber,
      attackStamina,
      req.user.sub
    );
    res.status(200).json(turn);
  } catch (err) {
    next(err);
  }
  return "TODO return updated turn";
}
