var express = require("express");
var router = express.Router();
var debug = require("debug")("bs-tabletop-rpg-backend:routers:combats");
const {
  createCombat,
  declareAttack,
  listCombatsByUser
} = require("../service/combat");
var createError = require("http-errors");

router.post("/", postCombat);
router.get("/", listCombats);
router.post(
  "/:combatId/turn/attacks/:attackNumber/attackerStamina",
  postAttackStamina
);
router.get("/:combatId", getCombat);

module.exports = router;

async function postCombat(req, res, next) {
  debug("postCombat", req.body);
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    return next(createError(400, "Body must not be empty"));
  }

  try {
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

async function postAttackStamina(req, res, next) {
  const { combatId, attackNumber } = req.params;
  const attackStamina = req.body;
  debug("postAttack", combatId, attackStamina);
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    return next(createError(400, "Body must not be empty"));
  }

  try {
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
