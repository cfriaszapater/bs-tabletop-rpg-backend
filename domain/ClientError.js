class ClientError extends Error {
  constructor(message) {
    super(message);
    this.name = "ClientError";
  }
}
exports.ClientError = ClientError;
