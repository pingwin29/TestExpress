const mongoose = require("mongoose");

const GoogleUserSchema = new mongoose.Schema({
  googleId: { type: String },
  name: { type: String },
  profileData: { type: Buffer, default: "" },
});

module.exports = mongoose.model("GoogleUsers", GoogleUserSchema);
