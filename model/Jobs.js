const { Schema, model, default: mongoose } = require("mongoose");

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
      ref: "User",
      required: [true, "please Provide Creater Id"],
    },
    userType: {
      type: String,
      enum: ["jwt", "session"],
    },
  },
  { timestamps: true }
);

module.exports = model("Jobs", JobSchema);
