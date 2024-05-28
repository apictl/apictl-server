const { PrismaClient } = require("@prisma/client");
const { validateEmail, validatePassword } = require("../utils/validators");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/email");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { generateProjectToken } = require("../utils/token_gen");

dotenv.config();
const domain = process.env.DOMAIN;
const jwtSecret = process.env.JWT_SECRET;

const prisma = new PrismaClient();
const saltRounds = 10;

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
  newProjectHandler,
};
