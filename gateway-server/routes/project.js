var express = require("express");
var router = express.Router();
const { newProjectHandler } = require("../handlers/project");
const { checkAuth } = require("../middlewares/auth");

require("dotenv").config();

router.post("/new_project", checkAuth, newProjectHandler);

module.exports = router;
