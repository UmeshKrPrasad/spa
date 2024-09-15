// backend/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  image: String,
});

module.exports = mongoose.model("User", UserSchema);
