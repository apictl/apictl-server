const { PrismaClient } = require("@prisma/client");
const getCountry = require("../utils/geolite");
const verifyUserAgent = require("../utils/user_agent");
const prisma = new PrismaClient();

const proxyVerification = async (req, res, next) => {
  const { project, endpoint } = req.params;

  if (req.headers["Postman-Token"] !== undefined) {
    confirm.log("Forbidden Client - Postman");
    return res.status(403).json({
      success: false,
      message: "Forbidden",
      data: null,
    });
  }

  const userAgent = req.headers["user-agent"];
  if (!verifyUserAgent(userAgent)) {
    console.log(`Forbidden User Agent - ${userAgent}`);
    return res.status(403).json({
      success: false,
      message: "Forbidden",
      data: null,
    });
  }

  const projectRecord = await prisma.project.findUnique({
    where: {
      public_token: project,
    },
  });

  const endpointRecord = await prisma.endpoint.findUnique({
    where: {
      public_token: endpoint,
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

  const country = await getCountry(
    req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress
  );

  const blackListedCountries = endpointRecord.blackListedCountries || [];
  if (blackListedCountries.includes(country)) {
    console.log(`Forbidden Country: ${country}`);
    return res.status(403).json({
      success: false,
      message: "Forbidden",
      data: null,
    });
  }

  var isAllowedOrigin = true;
  const allowedOrigins = endpointRecord.allowedOrigins || [];
  const origin = req.headers.origin
    .replace("http://", "")
    .replace("https://", "");
  if (allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
    isAllowedOrigin = false;
  }

  var isAllowedShaKey = true;
  const allowedShaKeys = endpointRecord.allowedShaKeys || [];
  if (
    req.headers["x-sha-key"] === undefined ||
    (allowedShaKeys.length > 0 &&
      !allowedShaKeys.includes(req.headers["x-sha-key"]))
  ) {
    isAllowedShaKey = false;
  }

  if (!isAllowedOrigin && !isAllowedShaKey) {
    console.log(`Forbidden Req - Origin: ${origin}, SHA256 Hash: ${req.headers["x-sha-key"]}`);
    return res.status(403).json({
      success: false,
      message: "Forbidden",
      data: null,
    });
  }

  req.projectRecord = projectRecord;
  req.endpointRecord = endpointRecord;
  next();
};

module.exports = {
  proxyVerification,
};
