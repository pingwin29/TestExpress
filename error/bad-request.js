const CustomApiErro = require("./custom-error-api");
const { statusCode } = require("http-status-codes");

class BadRequest extends CustomApiErro {
  constructor(msg) {
    super(msg);
    this.statusCode = 401;
  }
}

module.exports = BadRequest;
