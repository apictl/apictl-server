const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");

dotenv.config();
const prisma = new PrismaClient();

const checkUserPerms = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  if (!id || id.trim() == "") {
    return res.status(400).json({
      success: false,
      message: "Could not get project id",
      data: null,
    });
  }
  const project = await prisma.project.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Could not find project with id",
      data: null,
    });
  }
  req.project = project;
  next();
};

module.exports = {
  checkUserPerms,
};
