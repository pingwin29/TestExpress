const Unauthorized = require("../error/unauthorized");

const passportMiddleware = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    next(new Unauthorized("unauthorized user"));
  }
};

module.exports = passportMiddleware;
