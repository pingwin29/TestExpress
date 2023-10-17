const CustomApiErro = require("./custom-error-api");

class Unauthorized extends CustomApiErro {
  constructor(msg) {
    super(msg);
    this.statusCode = 401;
  }
}

module.exports = Unauthorized;
