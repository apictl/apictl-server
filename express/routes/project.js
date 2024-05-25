var express = require("express");
const { newProjectHandler } = require("../handlers/project");
const { checkAuth } = require("../middlewares/auth");
var router = express.Router();

require("dotenv").config();

router.post("/new_project", checkAuth, newProjectHandler);

module.exports = router;
