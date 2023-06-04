const mongoose = require("mongoose");

const Store = new mongoose.Schema({
  userId: mongoose.SchemaTypes.ObjectId,
  address: Object,
  workingHours: Object,
  verified: Boolean,
});

module.exports = mongoose.model("Store", Store);
