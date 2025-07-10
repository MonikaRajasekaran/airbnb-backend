const mongoose = require('mongoose');
const shortid = require("shortid");

const ReviewSchema = new mongoose.Schema({
     reviewId:{
         type: String,
     default: shortid.generate,
          required: true,
      },
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review'],
    maxlength: 100
  },
  text: {
    type: String,
    required: [true, 'Please add some text']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  propertyId: {
    type: String,
    ref: 'Property',
    required: true
  },
  userId: {
    type: String,
    ref: 'User',
    required: true
  }
});

// Prevent user from submitting more than one review per property
ReviewSchema.index({ property: 1, user: 1 }, { unique: true });

// Static method to get average rating and save
ReviewSchema.statics.getAverageRating = async function(propertyId) {
  const obj = await this.aggregate([
    {
      $match: { property: propertyId }
    },
    {
      $group: {
        _id: '$property',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    await this.model('Property').findByIdAndUpdate(propertyId, {
      averageRating: obj[0] ? obj[0].averageRating : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.property);
});

// Call getAverageRating before remove
ReviewSchema.post('remove', function() {
  this.constructor.getAverageRating(this.property);
});

module.exports = mongoose.model('Review', ReviewSchema);