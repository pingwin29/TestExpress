const mongoose = require("mongoose");
const connectDB = async (string) => {
  try {
    await mongoose.connect(string, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    console.log({ error });
  }
};
module.exports = connectDB;
