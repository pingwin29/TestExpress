const CustomApiError = require("../error/custom-error-api");
const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else if (err.code) {
    res.status(401).json({ error: "Email is already Exist" });
  } else {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = errorHandlerMiddleware;
