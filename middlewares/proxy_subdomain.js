const proxySubdomain = (req, res, next) => {
  const subdomains = req.subdomains;
  if (subdomains.length != 1) {
    return res.status(404).json({
      success: false,
      message: "This URL was not found",
      data: null,
    });
  }
  if (subdomains[0].length != 8) {
    return res.status(404).json({
      success: false,
      message: "This URL was not found",
      data: null,
    });
  }
  req.project = subdomains[0];
  next();
};

module.exports = { proxySubdomain };
