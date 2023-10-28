const { Schema, model, default: mongoose } = require("mongoose");
const Users = require("./User");
const GoogleUsers = require("./GoogleUser");

const JobSchema = new Schema(
  {
    company: {
      type: String,
      required: [true, "please provide company name"],
      maxLength: 50,
    },
    position: {
      type: String,
      required: [true, "please provide position"],
      maxLength: 100,
    },
    status: {
      type: String,
      enum: ["pending", "interview", "declined"],
      default: "pending",
    },
    createBy: {
      type: mongoose.Types.ObjectId,
      type: String,
      required: [true, "please Provide Creater Id"],
      refPath: "userType",
    },
    userType: {
      type: String,
      enum: ["Users", "GoogleUsers"],
    },
  },
  { timestamps: true }
);

module.exports = model("Jobs", JobSchema);
