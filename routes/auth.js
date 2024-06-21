var express = require("express");
var router = express.Router();

const {
  registerHandler,
  verifyHandler,
  loginHandler,
  forgotPasswordHandler,
  verifyOtpHandler,
  resetPasswordHandler,
} = require("../handlers/auth");

router.post("/register", registerHandler);
router.get("/verify", verifyHandler);
router.post("/login", loginHandler);
router.post("/forgotPassword", forgotPasswordHandler);
router.post("/verifyOTP", verifyOtpHandler);
router.post("/resetPassword", resetPasswordHandler);

module.exports = router;
