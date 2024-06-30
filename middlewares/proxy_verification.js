const { PrismaClient } = require("@prisma/client");
const getCountry = require("../utils/geolite");
const verifyUserAgent = require("../utils/user_agent");
const { getEndpointRecord } = require("../utils/endpoint_caching");
const prisma = new PrismaClient();

const proxyVerification = async (req, res, next) => {
  const { endpoint } = req.params;
  const project = req.project;

  if (req.headers["Postman-Token"] !== undefined) {
    confirm.log("Forbidden Client - Postman");
    res.locals.message = "Forbidden Client - Postman";
    return res.status(403).json({
      success: false,
      message: "Forbidden",
      data: null,
    });
  }

  const userAgent = req.headers["user-agent"];
  if (!verifyUserAgent(userAgent)) {
    res.locals.message = `Forbidden User Agent - ${userAgent}`;
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

  const endpointRecord = await getEndpointRecord(endpoint);

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
    res.locals.message = `Forbidden Country: ${country}`;
    return res.status(403).json({
      success: false,
      message: "Forbidden",
      data: null,
    });
  }

  var isAllowedOrigin = false;
  const allowedOrigins = endpointRecord.allowedOrigins || [];
  const origin = (req.headers.origin || "")
    .replace("http://", "")
    .replace("https://", "");
  if (allowedOrigins.includes(origin)) {
    isAllowedOrigin = true;
  }

  var isAllowedShaKey = false;
  const allowedShaKeys = endpointRecord.allowedShaKeys || [];
  const shaKey = req.headers["x-sha-key"];
  if (
    shaKey != undefined &&
    shaKey != "" &&
    allowedShaKeys.findIndex(
      (key) => shaKey.toLowerCase() === key.toLowerCase()
    ) !== -1
  ) {
    isAllowedShaKey = true;
  }

  if (!isAllowedOrigin && !isAllowedShaKey) {
    res.locals.message = `Forbidden Req - Origin: ${origin}, SHA256 Hash: ${req.headers["x-sha-key"]}`;
    return res.status(403).json({
      success: false,
      message: "Forbidden",
      data: null,
    });
  }

  var path = req.baseUrl;
  path = path.replace(`/${project}/${endpoint}`, "");

  const { blackListedPaths, whiteListedPaths } = endpointRecord;
  var forbidden = false;
  if (blackListedPaths.length == 0 && whiteListedPaths == 0) {
    forbidden = false;
  } else if (
    !whiteListedPaths.includes(path) ||
    blackListedPaths.includes(path)
  ) {
    forbidden = true;
  }

  if (forbidden) {
    res.locals.message = `Forbidden Path - ${path}`;
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
