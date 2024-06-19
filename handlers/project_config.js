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

const validateEndpointData = (
  title,
  apiUrl,
  injections,
  allowedOrigins,
  allowedShaKeys,
  limit,
  whiteListedPaths,
  blackListedPaths
) => {
  var result = undefined;
  if (!title || !apiUrl || !injections || injections == []) {
    result = {
      success: false,
      message: "Title, API URL, Injections are required",
      data: null,
    };
  }
  if (limit > 1000 || limit < 0) {
    result = {
      success: false,
      message: "Limit must be between 0 and 1000",
      data: null,
    };
  }
  if (!validateUrl(apiUrl) || validateLocalhost(apiUrl)) {
    result = {
      success: false,
      message: "API URL needs to be a valid URL, and it cannot be localhost.",
      data: null,
    };
  }
  var allOriginsValid = true;
  allowedOrigins.forEach((origin) => {
    if (
      !validateDomain(origin) &&
      !validateLocalhost(origin, (schemaRequired = false))
    ) {
      allOriginsValid = false;
    }
  });
  if (!allOriginsValid) {
    result = {
      success: false,
      message: "Origin must be a valid domain",
      data: null,
    };
  }
  var allHashesValid = true;
  allowedShaKeys.forEach((shaKey) => {
    if (!validateShaKey(shaKey)) {
      allHashesValid = false;
    }
  });
  if (!allHashesValid) {
    result = {
      success: false,
      message: "SHA Key must be a valid SHA256 hash",
      data: null,
    };
  }
  var invalidInjection = false;
  injections.forEach((injection) => {
    if (!injection.key || !injection.value || !injection.type) {
      invalidInjection = true;
    }
  });
  if (invalidInjection) {
    result = {
      success: false,
      message: "Each inject needs a key, value, and type",
      data: null,
    };
  }
  if (
    whiteListedPaths.filter((path) => blackListedPaths.includes(path)) != 0 &&
    blackListedPaths.filter((path) => whiteListedPaths.includes(path)) != 0
  ) {
    result = {
      success: false,
      message:
        "Blacklisted paths and whitelisted paths cannot have common elements",
      data: null,
    };
  }
  return {
    result,
    valid: result === undefined,
  };
};

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

const newEndpointHandler = async (req, res) => {
  const project = req.project;
  const {
    title,
    apiUrl,
    injections,
    blackListedCountries,
    allowedOrigins,
    allowedShaKeys,
    limit,
    whiteListedPaths,
    blackListedPaths,
  } = req.body;
  const { valid, result } = validateEndpointData(
    title,
    apiUrl,
    injections,
    allowedOrigins,
    allowedShaKeys,
    limit,
    whiteListedPaths,
    blackListedPaths
  );
  if (!valid) {
    return res.status(400).json(result);
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
  getProjectInfoHandler,
  newEndpointHandler,
};
