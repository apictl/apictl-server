const { pushToClickHouse } = require("../utils/clickhouse");

const proxyAnalytics = (req, res, next) => {
  const start = process.hrtime();
  const reqTime = Date.now();
  res.once("finish", () => {
    const end = process.hrtime();
    const ms = (end[0] - start[0]) * 1e3 + (end[1] - start[1]) * 1e-6;
    const data = {
      response_time: Math.round(ms * 1000) / 1000,
      origin: req.get("origin"),
      project: req.project,
      endpoint: req.params.endpoint,
      time: reqTime,
      path: "/" + req.baseUrl.split("/").slice(3).join("/"),
      user_agent: req.headers["user-agent"] || "",
      ip:
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress,
      status_code: res.statusCode,
      message: res.locals.message,
      sha256hash: req.headers["x-sha-key"],
    };
    pushToClickHouse(data);
  });
  next();
};

module.exports = {
  proxyAnalytics,
};
