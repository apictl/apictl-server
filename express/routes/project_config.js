var express = require("express");
const { getProjectInfo } = require("../handlers/project_config");
const { checkAuth } = require("../middlewares/auth");
const { checkUserPerms } = require("../middlewares/project_perms");
var router = express.Router({ mergeParams: true });

require("dotenv").config();

router.get("/", checkAuth, checkUserPerms, getProjectInfo);

module.exports = router;
