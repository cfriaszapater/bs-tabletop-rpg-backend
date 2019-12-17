var createError = require("http-errors");

function validateNotEmpty(body) {
  if (body.constructor === Object && Object.keys(body).length === 0) {
    throw createError(400, "Body must not be empty");
  }
}

exports.validateNotEmpty = validateNotEmpty;
