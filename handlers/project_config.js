const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const {
  validateUrl,
  validateLocalhost,
  validateDomain,
  validateShaKey,
} = require("../utils/validators");
const { encrypt } = require("../utils/encryption");
const { generateEndpointToken } = require("../utils/token_gen");

dotenv.config();

const prisma = new PrismaClient();

const getProjectInfoHandler = async (req, res) => {
  const project = req.project;
  res.json({
    success: true,
    message: "Found project",
    data: {
      project,
    },
  });
};

const newApiEndpointHandler = async (req, res) => {
  const project = req.project;
  const {
    title,
    apiUrl,
    injections,
    blackListedCountries,
    allowedOrigins,
    allowedShaKeys,
    limit,
  } = req.body;
  if (!title || !apiUrl || !injections || injections == []) {
    return res.status(400).json({
      success: false,
      message: "Title, API URL, Injections are required",
      data: null,
    });
  }
  if (limit > 1000 || limit < 0) {
    return res.status(400).json({
      success: false,
      message: "Limit must be between 0 and 1000",
      data: null,
    });
  }
  if (!validateUrl(apiUrl) || validateLocalhost(apiUrl)) {
    return res.status(400).json({
      success: false,
      message: "API URL needs to be a valid URL, and it cannot be localhost.",
      data: null,
    });
  }
  var allOriginsValid = true;
  allowedOrigins.forEach((origin) => {
    if (!validateDomain(origin) && !validateLocalhost(origin, false)) {
      allOriginsValid = false;
    }
  });
  if (!allOriginsValid) {
    return res.status(400).json({
      success: false,
      message: "Origin must be a valid domain",
      data: null,
    });
  }
  var allHashesValid = true;
  allowedShaKeys.forEach((shaKey) => {
    if (!validateShaKey(shaKey)) {
      allHashesValid = false;
    }
  });
  if (!allHashesValid) {
    return res.status(400).json({
      success: false,
      message: "SHA Key must be a valid SHA256 hash",
      data: null,
    });
  }
  var invalidInjection = false;
  injections.forEach((injection) => {
    if (!injection.key || !injection.value || !injection.type) {
      invalidInjection = true;
    }
  });
  if (invalidInjection) {
    return res.status(400).json({
      success: false,
      message: "Each inject needs a key, value, and type",
      data: null,
    });
  }
  const existingEndpoints = await prisma.endpoint.findUnique({
    where: {
      url_projectId: {
        url: apiUrl,
        projectId: project.id,
      },
    },
  });
  if (existingEndpoints) {
    return res.status(400).json({
      success: false,
      message: "URL already exists for this project",
      data: null,
    });
  }
  const injectionData = [];
  injections.forEach((injection) => {
    injectionData.push({
      key: injection.key,
      value: encrypt(injection.value, process.env.KEY_ENCRYPTION_SECRET),
      type: injection.type,
    });
  });
  const public_token = generateEndpointToken(req.user.email);
  try {
    await prisma.endpoint.create({
      data: {
        title,
        allowedOrigins,
        allowedShaKeys,
        blackListedCountries,
        public_token,
        limit,
        url: apiUrl,
        projectId: project.id,
        injections: {
          createMany: { data: injectionData },
        },
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "An error occured while trying to add API Endpoint",
      data: null,
    });
  }
  const newProject = await prisma.project.findUnique({
    where: {
      id: project.id,
    },
    include: {
      endpoint: true,
    },
  });
  res.json({
    success: true,
    message: "API Endpoint added succesfully",
    data: {
      project: newProject,
    },
  });
};

module.exports = {
  getProjectInfo: getProjectInfoHandler,
  newApiEndpoint: newApiEndpointHandler,
};
