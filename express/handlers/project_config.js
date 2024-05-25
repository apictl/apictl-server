const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");

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
  const { title, apiUrl, apiKey, type } = req.body;
  if (!title || !apiUrl || !apiKey || !type) {
    return res.status(400).json({
      success: false,
      message: "Title, API URL, API Key, and Key type are required",
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
    });
  }
  try {
    await prisma.endpoint.create({
      data: {
        title,
        apiKey,
        type,
        url: apiUrl,
        projectId: project.id,
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
