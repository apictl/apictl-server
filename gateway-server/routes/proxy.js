var express = require("express");
var router = express.Router({ mergeParams: true });

const {
  proxyHandler,
} = require("../handlers/proxy");

router.get("/", proxyHandler);

module.exports = router;
