const verifyUserAgent = (userAgent) => {
  if (userAgent === undefined || userAgent.trim() == "") {
    return false;
  }
  if (userAgent.toLowerCase().includes("postman")) {
    return false;
  }
  return true;
};
