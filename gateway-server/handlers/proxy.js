const { PrismaClient } = require("@prisma/client");
const { createProxyMiddleware } = require("http-proxy-middleware");
var { decrypt } = require("../utils/encryption");
const getCountry = require("../utils/geolite");
const prisma = new PrismaClient();

require("dotenv").config();

const proxyHandler = async (req, res) => {
  const { project, endpoint } = req.params;
  const country = await getCountry(
    req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress
  );
  const projectRecord = await prisma.project.findUnique({
    where: {
      id: project,
    },
  });

  const endpointRecord = await prisma.endpoint.findUnique({
    where: {
      id: endpoint,
    },
    include: {
      injections: true,
    },
  });

  if (
    !projectRecord ||
    !endpointRecord ||
    projectRecord.id !== endpointRecord.projectId
  ) {
    return res.status(404).json({
      success: false,
      message: "Not Found",
      data: null,
    });
  }

  const blackListedCountries = endpointRecord.blackListedCountries || [];
  if (blackListedCountries.includes(country)) {
    return res.status(403).json({
      success: false,
      message: `Forbidden Country: ${country}`,
      data: null,
    });
  }

  const allowedOrigins = endpointRecord.allowedOrigins || [];
  if (
    allowedOrigins.length > 0 &&
    !allowedOrigins.includes(req.headers.origin)
  ) {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
      data: null,
    });
  }

  const allowedShaKeys = endpointRecord.allowedShaKeys || [];
  if (
    allowedShaKeys.length > 0 &&
    !allowedShaKeys.includes(req.headers["x-sha-key"])
  ) {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
      data: null,
    });
  }

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
        console.log(endpointRecord);
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
        res.statusCode = proxyRes.statusCode;
      },
    },
  });

  proxy(req, res);
};

module.exports = {
  proxyHandler,
};
