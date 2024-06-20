var { sha256 } = require("js-sha256");

const generateProjectToken = (email) => {
  const time = Date.now();
  const str = email + time + "Project";
  return sha256(str).substring(0, 8);
};
const generateEndpointToken = (email) => {
  const time = Date.now();
  const str = email + time + "Enndpoint";
  return sha256(str).substring(0, 8);
};

module.exports = {
  generateProjectToken,
  generateEndpointToken,
};
