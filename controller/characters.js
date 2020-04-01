var express = require("express");
var router = express.Router();
var debug = require("debug")("bs-tabletop-rpg-backend:routers:characters");
const characterRepository = require("../repository/characterRepository");
const {
  createCharacter,
  updateCharacter,
  getCharacterById,
  listCharactersByUser
} = require("../service/characterService")(characterRepository);

router.get("/", listCharacters);
router.get("/:characterId", getCharacter);
router.post("/", postCharacter);
router.put("/:characterId", putCharacter);

module.exports = router;

async function postCharacter(req, res, next) {
  debug("postCharacter", req.body, req.headers);

  try {
    var character = await createCharacter(req.body /*, req.user.sub*/);
    res.status(201).json(character);
  } catch (err) {
    next(err);
  }
}

async function putCharacter(req, res, next) {
  debug("putCharacter", req.body, req.headers);

  try {
    var character = await updateCharacter(req.body /*, req.user.sub*/);
    res.status(200).json(character);
  } catch (err) {
    next(err);
  }
}

async function getCharacter(req, res, next) {
  const { characterId } = req.params;
  debug("getCharacter", characterId);

  try {
    var character = await getCharacterById(characterId /*, req.user.sub*/);
    res.status(200).json(character);
  } catch (err) {
    next(err);
  }
}

async function listCharacters(req, res, next) {
  debug("listCharacters");
  try {
    var characters = await listCharactersByUser(/*req.user.sub*/);
    res.status(200).json(characters);
  } catch (err) {
    next(err);
  }
}
