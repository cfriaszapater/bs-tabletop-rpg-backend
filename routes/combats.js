var express = require("express");
var router = express.Router();
var debug = require("debug")("bs-tabletop-rpg-backend:routers:combats");
const { createCombat, declareAttack } = require("../service/combat");

router.get("/", postCombat);
router.get("/:combatId", getCombat);
router.post(
  "/:combatId/turn/attacks/:attackNumber/attackerStamina",
  postAttackStamina
);

module.exports = router;

async function getCombat(req, res, next) {
  debug("get combat", req.params.combatId);

  return "TODO combat";
}

async function postCombat(req, res, next) {
  debug("postCombat", req.body);
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.statusMessage = "body must not be empty";
    res.status(400).end();
    return next();
  }

  try {
    var combat = await createCombat(req.body, req.user.sub);
    res.status(201).json(combat);
  } catch (err) {
    next(err);
  }
}

async function postAttackStamina(req, res, next) {
  const { combatId, attackNumber } = req.params;
  const attackStamina = req.body;
  debug("postAttack", combatId, attackStamina);
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.statusMessage = "body must not be empty";
    res.status(400).end();
    return next();
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
