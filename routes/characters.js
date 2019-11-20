var express = require("express");
var router = express.Router();
var debug = require("debug")("bs-tabletop-rpg-backend:routers:characters");

router.get("/", listCharacters);
router.get("/:characterId", getCharacter);

module.exports = router;

const getCharacter = async (req, res, next) => {
  debug("get character", req.params.characterId);

  return "TODO character";
};

const listCharacters = async req => {
  return "TODO list characters";
};
