const CustomApiError = require("../error/custom-error-api");
const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = errorHandlerMiddleware;
