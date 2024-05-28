const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const { validateUrl } = require("../utils/validators");
const { encrypt } = require("../utils/encryption");
const { random_string } = require("../utils/random_gen");

dotenv.config();

const prisma = new PrismaClient();

const getProjectInfo = async (req, res) => {
  const project = req.project;
  res.json({
    success: true,
    message: "Found project",
    data: {
      project,
    },
  });
};

const newApiEndpoint = async (req, res) => {
  const project = req.project;
  const {
    title,
    apiUrl,
    injections,
    blackListedCountries,
    allowedOrigins,
    allowedShaKeys,
  } = req.body;
  if (!title || !apiUrl || !injections || injections == []) {
    return res.status(400).json({
      success: false,
      message: "Title, API URL, Injections are required",
      data: null,
    });
  }
  if (!validateUrl(apiUrl)) {
    return res.status(400).json({
      success: false,
      message: "API URL needs to be a valid URL",
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
  const public_token = random_string(10);
  try {
    await prisma.endpoint.create({
      data: {
        title,
        allowedOrigins,
        allowedShaKeys,
        blackListedCountries,
        public_token,
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
  getProjectInfo,
  newApiEndpoint,
};
