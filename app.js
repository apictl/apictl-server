var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const indexRouter = require("./routes/index");
const proxyRouter = require("./routes/proxy");
const authRouter = require("./routes/auth");
const projectRouter = require("./routes/project");
const projectConfigRouter = require("./routes/project_config");
const cors = require("cors");
const dotenv = require("dotenv");

var app = express();

dotenv.config();
app.set("subdomain offset", process.env.ENVIRONMENT == "development" ? 1 : 2);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  "/:endpoint/*",
  cors({
    origin: true,
    credentials: true,
  }),
  proxyRouter
);

app.use(
  cors({
    origin: "https://apictl.tech",
    credentials: true,
  })
);
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/project", projectRouter);
app.use("/project/:token", projectConfigRouter);

app.use(function (req, res, next) {
  res.status(404).json({
    success: false,
    message: "This route could not be found",
    data: null,
  });
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500).json({
    success: false,
    message: "An unexpected error occured",
    data: null,
  });
});

module.exports = app;
