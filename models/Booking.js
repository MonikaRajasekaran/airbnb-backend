const mongoose = require('mongoose');
const shortid = require("shortid");

const BookingSchema = new mongoose.Schema({
     bookingId:{
     type: String,
 default: shortid.generate,
      required: true,
  },
  propertyId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
  daysOfStay: {
    type: Number,
    required: true
  },
  paymentInfo: {
    id: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    }
  },
  paidAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);