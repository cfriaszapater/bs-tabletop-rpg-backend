const { EmptyBodyError } = require("./error/EmptyBodyError");

const { isEmptyObject } = require("../util/isEmptyObject");

function validateNotEmpty(body) {
  if (isEmptyObject(body)) {
    throw new EmptyBodyError();
  }
}

exports.validateNotEmpty = validateNotEmpty;
