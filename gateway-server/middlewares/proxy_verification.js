const { PrismaClient } = require("@prisma/client");
const getCountry = require("../utils/geolite");
const prisma = new PrismaClient();

const proxyVerification = async (req, res, next) => {
  const { project, endpoint } = req.params;
  const country = await getCountry(
    req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress
  );
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

  const blackListedCountries = endpointRecord.blackListedCountries || [];
  if (blackListedCountries.includes(country)) {
    console.log(`Forbidden Country: ${country}`);
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
    console.log(`Forbidden Origin: ${req.headers.origin}`);
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
    console.log(`Forbidden SHA Key: ${req.headers["x-sha-key"]}`);
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
