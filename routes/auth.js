var express = require("express");
var router = express.Router();

const {
  registerHandler,
  verifyHandler,
  loginHandler,
  forgotPasswordHandler,
  verifyOtpHandler,
  resetPasswordHandler,
  userDataHandler,
} = require("../handlers/auth");
const { checkAuth } = require("../middlewares/auth");

router.post("/register", registerHandler);
router.get("/verify", verifyHandler);
router.post("/login", loginHandler);
router.post("/forgotPassword", forgotPasswordHandler);
router.post("/verifyOTP", verifyOtpHandler);
router.post("/resetPassword", resetPasswordHandler);
router.get("/user", checkAuth, userDataHandler);

module.exports = router;
