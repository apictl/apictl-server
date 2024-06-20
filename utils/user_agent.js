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
  return true;
};

module.exports = verifyUserAgent;
