var createError = require("http-errors");
var express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { Stream } = require("stream");
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const projectRouter = require("./routes/project");
const projectConfigRouter = require("./routes/project_config");

var app = express();

require("dotenv").config();

app.use(
  "/proxy",
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

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/project", projectRouter);
app.use("/project/:id", projectConfigRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", {
    title: "Error",
  });
});

module.exports = app;
