const { Schema, model } = require("mongoose");

const TestSchema = new Schema({
  email: { type: String, required: true },
  userType: { type: String, enum: ["google", "jwt"] },
});

TestSchema.index({ email: 1, userType: 1 }, { unique: true });

module.exports = model("Tests", TestSchema);
