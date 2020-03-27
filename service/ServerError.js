// XXX rename to UnexpectedError or so
class ServerError extends Error {
  constructor(message) {
    super(message);
    this.name = "ServerError";
  }
}
exports.ServerError = ServerError;
