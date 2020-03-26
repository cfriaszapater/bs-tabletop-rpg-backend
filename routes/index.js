var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res) {
  const baseUrl = req.protocol + "://" + req.get("host");
  res.status(200).json({
    links: {
      self: baseUrl + "/",
      characters: baseUrl + "/characters",
      combats: baseUrl + "/combats"
    }
  });
});

module.exports = router;
