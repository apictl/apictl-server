const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");

dotenv.config();

const prisma = new PrismaClient();

const getProjectInfo = async (req, res) => {
  const project = req.project;
  res.json({
    success: true,
    message: "Found project",
    data: {
      project,
    },
  });
};

module.exports = {
  getProjectInfo,
};
