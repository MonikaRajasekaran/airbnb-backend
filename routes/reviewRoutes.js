const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddlewares');
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

// Include advanced results middleware
const Review = require('../models/Review');
const advancedResults = require('../middlewares/advancedResults');

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'property user',
      select: 'title name'
    }),
    getReviews
  )
  .post(protect, authorize('user', 'admin'), addReview);

router
  .route('/:reviewId')
  .get(getReview)
  .put(protect, authorize('user', 'admin'), updateReview)
  .delete(protect, authorize('user', 'admin'), deleteReview);

// Get reviews for a specific property
router.get('/property/:propertyId', async (req, res) => {
  const reviews = await Review.find({ property: req.params.propertyId })
    .populate('user', 'name avatar')
    .populate('property', 'title');
  
  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

// Get reviews by the current user
router.get('/my-reviews', protect, async (req, res) => {
  const reviews = await Review.find({ user: req.user.id })
    .populate('property', 'title location');
  
  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

module.exports = router;