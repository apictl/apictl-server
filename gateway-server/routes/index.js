var express = require("express");
var router = express.Router();

require("dotenv").config();

router.get("/", function (req, res, next) {
  res.render("index", {
    title: "API Gateway",
    text: process.env.DISPLAY_TEXT,
  });
});

module.exports = router;
