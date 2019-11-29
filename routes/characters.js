var express = require("express");
var router = express.Router();
var debug = require("debug")("bs-tabletop-rpg-backend:routers:characters");

router.get("/", listCharacters);
router.get("/:characterId", getCharacter);

module.exports = router;

async function getCharacter(req, res, next) {
  debug("get character", req.params.characterId);

  return "TODO character";
}

async function listCharacters(req) {
  return "TODO list characters";
}
