const { isEmptyObject } = require("../util/isEmptyObject");
const { ClientError } = require("../domain/ClientError");

function validateNotEmpty(body) {
  if (isEmptyObject(body)) {
    throw new EmptyBodyError();
  }
}

class EmptyBodyError extends ClientError {
  constructor() {
    super("Body must not be empty");
    this.code = "EMPTYBODY";
    this.name = "EmptyBodyError";
  }
}

exports.validateNotEmpty = validateNotEmpty;
