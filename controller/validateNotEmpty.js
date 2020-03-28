const { isEmptyObject } = require("../util/isEmptyObject");
const { BadRequestError } = require("../domain/BadRequestError");

function validateNotEmpty(body) {
  if (isEmptyObject(body)) {
    throw new EmptyBodyError();
  }
}

class EmptyBodyError extends BadRequestError {
  constructor() {
    super("Body must not be empty");
    this.code = "EMPTYBODY";
    this.name = "EmptyBodyError";
  }
}

exports.validateNotEmpty = validateNotEmpty;
