var express = require("express");
var router = express.Router();
const { allProjectsHandler, newProjectHandler } = require("../handlers/project");
const { checkAuth } = require("../middlewares/auth");

require("dotenv").config();

router.get("/", checkAuth, allProjectsHandler);
router.post("/create", checkAuth, newProjectHandler);

module.exports = router;
