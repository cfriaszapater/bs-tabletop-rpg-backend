var express = require("express");
var router = express.Router();
var debug = require("debug")("bs-tabletop-rpg-backend:routers:combats");

router.get("/:combatId", get);

module.exports = router;

const get = async function(req, res, next) {
  debug("get combat", req.params.combatId);

  return "TODO combat";
};
