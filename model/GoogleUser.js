const mongoose = require("mongoose");

const GoogleUserSchema = new mongoose.Schema({
  googleId: { type: String },
  name: { type: String },
});

module.exports = mongoose.model("GoogleUsers", GoogleUserSchema);
