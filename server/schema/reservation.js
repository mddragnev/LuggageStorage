const mongoose = require("mongoose");

const Reservation = new mongoose.Schema({
  userInfo: {
    userId: mongoose.SchemaTypes.ObjectId,
    firstName: String,
    lastName: String,
  },
  shopId: mongoose.SchemaTypes.ObjectId,
  reservationDetails: {
    totalPrice: Number,
    fromDate: Date,
    toDate: Date,
    luggageSize: Number,
    status: String,
  },
});

module.exports = mongoose.model("Reservation", Reservation);
