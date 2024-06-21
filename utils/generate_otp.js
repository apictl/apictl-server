const { randomInt } = require("crypto");

const generateOtp = async () => {
  return randomInt(100000, 999999);
};

module.exports = { generateOtp };
