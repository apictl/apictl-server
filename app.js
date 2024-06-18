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

var app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/project", projectRouter);
app.use("/project/:token", projectConfigRouter);
app.use("/:project/:endpoint/*", proxyRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).json({
    success: false,
    message: "This route could not be found",
    data: null,
  });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500).json({
    success: false,
    message: "An unexpected error occured",
    data: null,
  });
});

module.exports = app;
