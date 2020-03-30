const { BadRequestError } = require("../../domain/error/BadRequestError");

class EmptyBodyError extends BadRequestError {
  constructor() {
    super("Body must not be empty");
    this.code = "EMPTYBODY";
    this.name = "EmptyBodyError";
  }
}

exports.EmptyBodyError = EmptyBodyError;
