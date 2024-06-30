const { PrismaClient } = require("@prisma/client");
const { validateEmail, validatePassword } = require("../utils/validators");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/email");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { generateOtp } = require("../utils/generate_otp");
const { createClient } = require("redis");

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

const saltRounds = 10;
const prisma = new PrismaClient();
const redis = createClient({ url: process.env.REDIS_URL });
redis.connect();

const registerHandler = async (req, res) => {
  const { name, email, password } = req.body;
  if (
    !name ||
    !email ||
    !password ||
    name.trim() == "" ||
    email.trim() == "" ||
    password.trim() == ""
  ) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required",
      data: null,
    });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
      data: null,
    });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message:
        "The password must contain 8 letters, with 1 symbol, 1 lower case character, 1 upper case character, and 1 number",
      data: null,
    });
  }
  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (existingUser) {
    return res.status(403).json({
      success: false,
      message: "A user with this email already exists",
      data: null,
    });
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  var user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
  user.password = undefined;
  const token = jwt.sign({ name, email, id: user.id }, jwtSecret);

  const url = `${req.protocol}://${req.get("host")}/auth/verify?token=${token}`;
  await sendEmail(
    email,
    "Verify",
    `<h1>Please verify</h1>
Please verify your account on API Gateway by clicking on this <a href="${url}">link</a>.
Alternatively, you can visit this URL: ${url}`
  );
  res.json({
    success: true,
    message:
      "Registered succesfully, please check your email inbox for verification",
    data: user,
  });
};

const verifyHandler = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).send("This URL is invalid");
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
  try {
    await prisma.user.update({
      where: { id: jwtUser.id, email: jwtUser.email },
      data: { isVerified: true },
    });
  } catch (e) {
    res.status(500).send("There was an error in verifying your account");
  }
  res.send(
    `Your account has been verified succesfully. Click <a href="${
      req.protocol
    }://${req.get("host")}/">here</a> to go to API Gateway`
  );
};

const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  if (!validateEmail(email) || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
      data: null,
    });
  }
  var user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return res.status(403).json({
      success: false,
      message: "This email does not exist",
      data: null,
    });
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(403).json({
      success: false,
      message: "Invalid password",
      data: null,
    });
  }
  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your account to continue",
      data: null,
    });
  }
  user.password = undefined;
  const token = jwt.sign({ email, name: user.name, id: user.id }, jwtSecret);
  res.json({
    success: true,
    message: "Logged in succesfully",
    data: {
      token,
      user,
    },
  });
};

const forgotPasswordHandler = async (req, res) => {
  const { email } = req.body;
  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
      data: null,
    });
  }
  var user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return res.status(403).json({
      success: false,
      message: "This email does not exist",
      data: null,
    });
  }
  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your account to continue",
      data: null,
    });
  }
  const otp = await generateOtp();
  sendEmail(
    email,
    `Password reset for ${req.get("host")}`,
    `<h1>Your OTP</h1>
Your OTP for resetting the password is ${otp}. Do not share this with anyone.
OTP expires in 5 minutes.`
  );
  await redis.set(`password-otp:${email}`, otp, { EX: 60 * 5 });
  res.status(200).json({
    success: true,
    message: "OTP sent succesfully",
    data: null,
  });
};

const verifyOtpHandler = async (req, res) => {
  const { email, otp } = req.body;
  if (!validateEmail(email) || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
      data: null,
    });
  }
  var user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return res.status(403).json({
      success: false,
      message: "This email does not exist",
      data: null,
    });
  }
  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your account to continue",
      data: null,
    });
  }
  const otpRedisId = `password-otp:${email}`;
  const actualOtp = await redis.get(otpRedisId);
  if (otp != actualOtp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
      data: null,
    });
  }
  await redis.set(`allow-password-change:${email}`, 1, { EX: 10 * 60 });
  await redis.del(otpRedisId);
  res.status(200).json({
    success: true,
    message:
      "OTP verified succesfully, you have 10 minutes to reset your password",
    data: null,
  });
};

const resetPasswordHandler = async (req, res) => {
  const { email, password } = req.body;
  if (!validateEmail(email) || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
      data: null,
    });
  }
  var user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return res.status(403).json({
      success: false,
      message: "This email does not exist",
      data: null,
    });
  }
  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your account to continue",
      data: null,
    });
  }
  const redisId = `allow-password-change:${email}`;
  const passwordChangePerm = await redis.get(`allow-password-change:${email}`);
  if (passwordChangePerm != 1) {
    return res.status(403).json({
      success: false,
      message: "Please verify your OTP to continue",
      data: null,
    });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message:
        "The password must contain 8 letters, with 1 symbol, 1 lower case character, 1 upper case character, and 1 number",
      data: null,
    });
  }
  await redis.del(redisId);
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  var newUser;
  try {
    newUser = await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "An internal error occured, please try again in some time",
      data: null,
    });
  }
  newUser.password = undefined;
  res.status(200).json({
    success: true,
    message: "Password updated succesfully",
    data: newUser,
  });
};

const userDataHandler = (req, res) => {
  res.status(200).json({
    success: true,
    message: "User found",
    data: req.user,
  });
};

module.exports = {
  registerHandler,
  verifyHandler,
  loginHandler,
  forgotPasswordHandler,
  verifyOtpHandler,
  resetPasswordHandler,
  userDataHandler,
};
