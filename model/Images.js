const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  name: String, // You can store the image name
  data: Buffer, // Use a Buffer to store the image binary data
  contentType: String, // Store the content type (e.g., image/jpeg, image/png)
});

module.exports = mongoose.model("Image", imageSchema);
