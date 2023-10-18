const path = require("path");
const notFound = (req, res, next) => {
  // res.status(404).json(path.join(__dirname, "public", "404.html"));
  res.status(404).json({ err: "no routh" });
};

module.exports = notFound;
