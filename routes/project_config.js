var express = require("express");
var router = express.Router({ mergeParams: true });
const { checkAuth } = require("../middlewares/auth");
const { checkUserPerms } = require("../middlewares/user_perms");
const {
  getProjectInfoHandler,
  newEndpointHandler,
} = require("../handlers/project_config");

require("dotenv").config();

router.use(checkAuth, checkUserPerms);
router.get("/", getProjectInfoHandler);
router.patch("/endpoint/create", newEndpointHandler);

module.exports = router;
