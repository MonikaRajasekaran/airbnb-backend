const mongoose = require('mongoose');
const shortid = require("shortid");

const propertySchema = new mongoose.Schema({
  propertyId:{
     type: String,
 default: shortid.generate,
      required: true,
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Please add a price per night']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Please add number of bedrooms']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Please add number of bathrooms']
  },
  guests: {
    type: Number,
    required: [true, 'Please add number of guests']
  },
  amenities: {
    type: [String],
    required: true
  },
  propertyType: {
    type: String,
    required: [true, 'Please select property type'],
    enum: [
      'Apartment',
      'House',
      'Villa',
      'Cabin',
      'Cottage',
      'Loft',
      'Other'
    ]
  },
  photos: {
    type: [String],
    required: [true, 'Please add at least one photo']
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String,
    ref: 'User',
    required: true
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Reverse populate with virtuals
propertySchema.virtual('bookings', {
  ref: 'Booking',
  localField: 'bookingId',
  foreignField: 'property',
  justOne: false
});

propertySchema.virtual('reviews', {
  ref: 'Review',
  localField: 'bookingId',
  foreignField: 'property',
  justOne: false
});

module.exports = mongoose.model('Property', propertySchema);