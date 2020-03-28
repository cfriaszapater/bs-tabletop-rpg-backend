const { handleError } = require("./controller/handleError");

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const httpLogger = require("morgan");

const indexRouter = require("./controller/index");
const combatRouter = require("./controller/combats");
const characterRouter = require("./controller/characters");

const app = express();

app.use(cors);
// Log HTTP requests (with dev info while we are in development mode)
app.use(httpLogger("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/combats", combatRouter);
app.use("/characters", characterRouter);

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

// Catch 404 and forward to error handler
function notFoundError(req, res, next) {
  next(createError(404));
}

// Express requires error handling middleware to keep the 4-arg signature, even if 'next' arg is not used
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const { status, responseBody } = handleError(err);

  res.status(status).json(responseBody);
}

module.exports = app;
