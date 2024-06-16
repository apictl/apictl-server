const UAParser = require("ua-parser-js");

const verifyUserAgent = (userAgent) => {
  if (userAgent === undefined || userAgent.trim() == "") {
    return false;
  }
  const forbiddenWords = ["postman", "curl", "wget"];
  if (
    forbiddenWords.filter((word) => userAgent.toLowerCase().includes(word))
      .length > 0
  ) {
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
