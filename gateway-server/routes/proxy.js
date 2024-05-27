var express = require("express");
var router = express.Router();
const { PrismaClient } = require('@prisma/client')
const { createProxyMiddleware } = require("http-proxy-middleware");

require("dotenv").config();
const prisma = new PrismaClient()

router.use(
  "/",
  createProxyMiddleware({
    target: process.env.PROXY_URL,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader(
          "Authorization",
          `Bearer ${process.env.TEST_API_KEY}`
        );
      },
      proxyRes: (proxyRes, req, res) => {
        res.statusCode = proxyRes.statusCode;
      },
    },
  })
);

module.exports = router;
