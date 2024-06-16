const UAParser = require("ua-parser-js");

const verifyUserAgent = (userAgent) => {
  if (userAgent === undefined || userAgent.trim() == "") {
    return false;
  }
  if (userAgent.toLowerCase().includes("postman")) {
    return false;
  }
  const parser = new UAParser(userAgent);
  const userAgentDetails = parser.getResult();
  if (userAgentDetails.browser.name === undefined) {
    return false;
  }
  return true;
};

module.exports = verifyUserAgent;
