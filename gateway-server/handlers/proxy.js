const { createProxyMiddleware } = require("http-proxy-middleware");
var { decrypt } = require("../utils/encryption");

require("dotenv").config();

const proxyHandler = async (req, res) => {
  const { project, endpoint } = req.params;
  const { endpointRecord, projectRecord } = req;

  if (endpointRecord.url.endsWith("/")) {
    endpointRecord.url = endpointRecord.url.slice(0, -1);
  }

  const proxy = createProxyMiddleware({
    target:
      endpointRecord.url +
      req.originalUrl.replace(`/${project}/${endpoint}`, ""),
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req, res) => {
        endpointRecord.injections.forEach((injection) => {
          if (injection.type.toLowerCase() == "header") {
            proxyReq.setHeader(
              injection.key,
              decrypt(injection.value, process.env.KEY_ENCRYPTION_SECRET)
            );
          }
        });
      },
      proxyRes: (proxyRes, req, res) => {
        console.log(proxyRes.statusCode);
        res.statusCode = proxyRes.statusCode;
      },
    },
  });

  res.setHeader("Proxy-Status", 200);
  proxy(req, res);
};

module.exports = {
  proxyHandler,
};
