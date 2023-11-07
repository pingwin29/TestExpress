const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: [true, "Name is required"],
  },
  email: {
    type: "string",
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail, // Use the isEmail method from validator.js
      message: "Invalid email format",
    },
  },
  password: {
    type: "string",
    required: [true, "Password is required"],
  },
  isVerified: { type: Boolean, default: false },
  veriCode: { type: String, required: [true, "please Provide verification Code"] },
  profileData: { type: Buffer, default: "" },
});

UserSchema.pre("save", async function (next) {
  try {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(this.password, salt);
    // const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id, name: this.name }, process.env.JWTTOKEN);
};

module.exports = mongoose.model("Users", UserSchema);
