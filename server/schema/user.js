const mongoose = require("mongoose");

const User = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  phone: String,
  refreshToken: String,
  role: String,
  verified: Boolean,
});

module.exports = mongoose.model("User", User);
