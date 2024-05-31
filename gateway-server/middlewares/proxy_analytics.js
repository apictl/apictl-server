const proxyAnalytics = (req, res, next) => {
  const start = process.hrtime();
  const reqTime = Date.now();
  res.on("finish", () => {
    const end = process.hrtime();
    const ms = (end[0] - start[0]) * 1e3 + (end[1] - start[1]) * 1e-6;
    const data = {
      responseTime: ms,
      origin: req.get("origin"),
      project: req.params.project,
      endpoint: req.params.endpoint,
      time: reqTime,
      path: "/" + req.baseUrl.split("/").slice(3).join("/"),
      userAgent: req.headers["user-agent"] || "",
      ip:
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress,
    };
    console.log(data);
  });
  next();
};

module.exports = {
  proxyAnalytics,
};
