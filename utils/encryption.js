var { ncrypt } = require("ncrypt-js");
const dotenv = require("dotenv");

dotenv.config();

var { encrypt, decrypt } = new ncrypt(process.env.KEY_ENCRYPTION_SECRET);

module.exports = {
  encrypt,
  decrypt,
};
