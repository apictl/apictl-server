var express = require("express");
var router = express.Router();

const {
  registerHandler,
  verifyHandler,
  loginHandler,
} = require("../handlers/auth");

router.post("/register", registerHandler);
router.get("/verify", verifyHandler);
router.post("/login", loginHandler);

module.exports = router;
