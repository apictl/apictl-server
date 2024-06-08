var express = require("express");
var router = express.Router();
const { newProjectHandler } = require("../handlers/project");
const { checkAuth } = require("../middlewares/auth");

require("dotenv").config();

router.post("/create", checkAuth, newProjectHandler);

module.exports = router;
