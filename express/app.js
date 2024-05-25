var createError = require("http-errors");
var express = require("express");
var proxy = require("express-http-proxy");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { Stream } = require("stream");
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const projectRouter = require("./routes/project");

var app = express();

require("dotenv").config();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(
  "/proxy",
  proxy(process.env.PROXY_URL, {
    parseReqBody: true,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      const token = "";
      proxyReqOpts.headers = {
        ...proxyReqOpts.headers,
        authorization: `Bearer ${token}`,
      };

      // Stream the request body
      const bodyStream = new Stream.PassThrough();
      srcReq.pipe(bodyStream);
      proxyReqOpts.body = bodyStream;

      console.log(proxyReqOpts);
      return proxyReqOpts;
    },
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/project", projectRouter);

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
