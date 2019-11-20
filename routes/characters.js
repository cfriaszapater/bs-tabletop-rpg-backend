var express = require("express");
var router = express.Router();
var debug = require("debug")("bs-tabletop-rpg-backend:routers:characters");

router.get("/:characterId", get);

module.exports = router;

const get = async function(req, res, next) {
  debug("get character", req.params.characterId);

  return "TODO combat";
};
