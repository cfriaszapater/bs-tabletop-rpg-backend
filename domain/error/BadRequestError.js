// An error due to incorrect request
class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
  }
}
exports.BadRequestError = BadRequestError;
