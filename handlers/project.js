const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const { generateProjectToken } = require("../utils/token_gen");

dotenv.config();

const prisma = new PrismaClient();

const allProjectsHandler = async (req, res) => {
  const user = req.user;
  const projects = await prisma.project.findMany({
    where: {
      userId: user.id,
    },
    include: {
      endpoint: true,
    },
  });
  if (projects.length == 0) {
    return res.status(404).json({
      success: false,
      message: "No projects found",
      data: null,
    });
  }
  res.status(200).json({
    success: true,
    message: "Projects found",
    data: projects,
  });
};

const newProjectHandler = async (req, res) => {
  const user = req.user;
  const { title } = req.body;
  if (!title || title.trim() == "") {
    return res.status(400).json({
      success: false,
      message: "Title cannot be empty",
      data: null,
    });
  }
  var project;
  const public_token = generateProjectToken(req.user.email);
  try {
    project = await prisma.project.create({
      data: {
        title,
        public_token,
        userId: user.id,
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Could not create a new project",
      data: null,
    });
  }
  res.json({
    success: true,
    message: "Created project succesfully",
    data: {
      project,
    },
  });
};

module.exports = {
  allProjectsHandler,
  newProjectHandler,
};
