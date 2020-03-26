const { isEmptyObject } = require("../util/isEmptyObject");

var createError = require("http-errors");

function validateNotEmpty(body) {
  if (isEmptyObject(body)) {
    throw createError(400, "Body must not be empty");
  }
}

exports.validateNotEmpty = validateNotEmpty;
