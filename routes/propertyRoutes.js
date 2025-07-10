const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddlewares');
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');

// Include other resource routers
const bookingRouter = require('./bookingRoutes');
const reviewRouter = require('./reviewRoutes');

const Property = require('../models/Property');
const advancedResults = require('../middlewares/advancedResults');

// Re-route into other resource routers
router.use('/:propertyId/bookings', bookingRouter);
router.use('/:propertyId/reviews', reviewRouter);

router
  .route('/')
  .get(
    advancedResults(Property, {
      path: 'user',
      select: 'name email'
    }),
    getProperties
  )
  .post(protect, authorize('USER', 'ADMIN'), createProperty);

router
  .route('/:propertyId')
  .get(getProperty)
  .put(protect, authorize('USER', 'ADMIN'), updateProperty)
  .delete(protect, authorize('USER', 'ADMIN', ), deleteProperty);

module.exports = router;