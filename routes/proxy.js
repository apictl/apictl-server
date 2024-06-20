var express = require("express");
var router = express.Router({ mergeParams: true });

const { proxyHandler } = require("../handlers/proxy");
const { proxyVerification } = require("../middlewares/proxy_verification");
const { proxyRateLimiter } = require("../middlewares/proxy_rate_limiter");
const { proxyAnalytics } = require("../middlewares/proxy_analytics.js");

router.use(
  "/",
  proxyAnalytics,
  proxyVerification,
  proxyRateLimiter,
  proxyHandler
);

module.exports = router;
