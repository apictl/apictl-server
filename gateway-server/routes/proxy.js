var express = require("express");
var router = express.Router({ mergeParams: true });

const { proxyHandler } = require("../handlers/proxy");
const { proxyVerification } = require("../middlewares/proxy_verification");

router.use("/", proxyVerification, proxyHandler);

module.exports = router;
