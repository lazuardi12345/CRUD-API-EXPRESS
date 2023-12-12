var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var multer = require("multer");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var mastersRouter = require("./routes/masters");
var peminjamansRouter = require("./routes/peminjamans");
var historiesRouter = require("./routes/histories");
var imageRoutes = require("./uploads/server");
var authRoutes = require("./routes/auth");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/masters", mastersRouter);
app.use("/peminjamans", peminjamansRouter);
app.use("/histories", historiesRouter);
app.use("/server", imageRoutes);
app.use("/auth", authRoutes);
// catch 404 and forward to error handler
// Middleware untuk menangani kesalahan
app.use((req, res, next) => {
  res.status(404).send("404 - Not Found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
