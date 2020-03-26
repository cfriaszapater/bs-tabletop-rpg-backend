function isEmptyObject(body) {
  return body.constructor === Object && Object.keys(body).length === 0;
}

exports.isEmptyObject = isEmptyObject;
