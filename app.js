var createError = require("http-errors");
var express = require("express");
var path = require("path");
var httpLogger = require("morgan");

var indexRouter = require("./routes/index");
var combatRouter = require("./routes/combats");
var characterRouter = require("./routes/characters");

var app = express();

app.use(cors);
// Log HTTP requests (with dev info while we are in development mode)
app.use(httpLogger("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/combats", combatRouter);
app.use("/characters", characterRouter);

// Catch 404 and forward to error handler
app.use(notFoundError);

app.use(errorHandler);

// Allow CORS from any origin
function cors(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
}

function notFoundError(req, res, next) {
  next(createError(404));
}

// Express requires error handling middleware to keep the 4-arg signature, even if 'next' arg is not used
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  res.status(err.status || 500).json(err);
}

module.exports = app;
