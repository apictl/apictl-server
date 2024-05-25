const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const domain = process.env.DOMAIN;
const jwtSecret = process.env.JWT_SECRET;

const prisma = new PrismaClient();
const saltRounds = 10;

const checkAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(403).json({
      success: false,
      message: "Authorization header is missing",
      data: null,
    });
  }
  const token = authorization.replace("Bearer ", "");
  if (!token) {
    return res.status(403).json({
      success: false,
      message: "Authorization bearer token is missing",
      data: null,
    });
  }
  var jwtUser;
  try {
    jwtUser = jwt.verify(token, jwtSecret);
  } catch (e) {
    return res.status(500).send("There was an error in verifying your account");
  }
  if (!jwtUser) {
    res.status(500).send("There was an error in verifying your account");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: jwtUser.id,
      email: jwtUser.email,
    },
  });
  if (!user) {
    return res.status(403).json({
      success: false,
      message: "Could not verify user",
      data: null,
    });
  }
  req.user = user;
  next();
};

module.exports = {
  checkAuth,
};