var express = require("express");
var router = express.Router({ mergeParams: true });
const { checkAuth } = require("../middlewares/auth");
const { checkUserPerms } = require("../middlewares/user_perms");
const {
  getProjectInfo,
  newApiEndpoint,
} = require("../handlers/project_config");

require("dotenv").config();

router.use(checkAuth, checkUserPerms);
router.get("/", getProjectInfo);
router.patch("/new_endpoint", newApiEndpoint);

module.exports = router;
