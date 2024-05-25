var express = require("express");
const { registerHandler, verifyHandler, loginHandler } = require("../handlers/auth");
var router = express.Router();

router.post("/register", registerHandler);
router.get("/verify", verifyHandler);
router.post("/login", loginHandler)

module.exports = router;
