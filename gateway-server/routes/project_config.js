var express = require("express");
const {
  getProjectInfo,
  newApiEndpoint,
} = require("../handlers/project_config");
const { checkAuth } = require("../middlewares/auth");
const { checkUserPerms } = require("../middlewares/user_perms");
var router = express.Router({ mergeParams: true });

require("dotenv").config();

router.use(checkAuth, checkUserPerms);
router.get("/", getProjectInfo);
router.patch("/new_endpoint", newApiEndpoint);

module.exports = router;
