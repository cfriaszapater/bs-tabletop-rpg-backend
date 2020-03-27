// XXX rename to something relevant to the domain, eg: ActionNotAllowed / BadRequest / DomainError ...
class ClientError extends Error {
  constructor(message) {
    super(message);
    this.name = "ClientError";
  }
}
exports.ClientError = ClientError;
