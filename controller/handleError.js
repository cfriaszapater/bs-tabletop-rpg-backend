const { BadRequestError } = require("../domain/error/BadRequestError");
const log = require("bunyan").createLogger({ name: "bs-tabletop-rpg-backend" });

function handleError(err) {
  log.error(err);

  const status = errorStatus(err);
  const responseBody = errorResponseBody(err, status);
  return { status, responseBody };
}

function errorStatus(err) {
  if (err instanceof BadRequestError) {
    return 400;
  }
  if (err.status) {
    return err.status;
  }
  return 500;
}

function errorResponseBody(err, status) {
  // Pull specific Error properties that are not included by JSON.stringify as they are not enumerable
  // (see https://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify)
  const httpErr = {
    title: err.message,
    status: "" + status,
    // XXX remove stack from reported error when in production
    stack: err.stack,
    ...err
  };
  return { errors: [httpErr] };
}

exports.handleError = handleError;
