const proxyAnalytics = (req, res, next) => {
  const start = process.hrtime();
  res.on("finish", () => {
    const end = process.hrtime();
    const ms = (end[0] - start[0]) * 1e3 + (end[1] - start[1]) * 1e-6;
    console.log(ms);
    console.log(req.get("origin"));
    console.log(req.params.project);
    console.log(req.params.endpoint);
    console.log(req);
    const data = {
      responseTime: ms,
      origin: req.get("origin"),
      project: req.params.project,
      endpoint: req.params.endpoint,
      time: Date.now(),
      path: "/" + req.baseUrl.split("/").slice(3).join("/"),
    };
    console.log(data);
  });
  next();
};

module.exports = {
  proxyAnalytics,
};
