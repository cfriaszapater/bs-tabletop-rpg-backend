// A programming, internal error
class UnexpectedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnexpectedError";
  }
}
exports.UnexpectedError = UnexpectedError;
