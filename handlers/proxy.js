const {
  createProxyMiddleware,
  fixRequestBody,
} = require("http-proxy-middleware");
var { decrypt } = require("../utils/encryption");

require("dotenv").config();

const proxyHandler = async (req, res) => {
  const { project, endpoint } = req.params;
  const { endpointRecord } = req;

  if (endpointRecord.url.endsWith("/")) {
    endpointRecord.url = endpointRecord.url.slice(0, -1);
  }
  console.log(endpointRecord.url);
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
        proxyReq.path = proxyReq.path.replace(req.url, "");
        proxyReq.method = req.method;
        fixRequestBody(proxyReq, req);
      },
      proxyRes: (proxyRes, req, res) => {
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
