const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddlewares');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  getMyBookings
} = require('../controllers/bookingController');

const Booking = require('../models/Booking');
const advancedResults = require('../middlewares/advancedResults');

// Re-route into other resource routers
// (This would be used if you had nested routes, like properties/:propertyId/bookings)

// Regular routes
router
  .route('/')
  .get(
    advancedResults(Booking, {
      path: 'property user',
      select: 'title name email'
    }),
    getMyBookings
  )
  .post(protect, authorize('user', 'admin','host'), createBooking);

router
  .route('/:bookingId')
  .get(getMyBookings)
  .put(protect, authorize('user', 'admin'), updateBooking)
  .delete(protect, authorize('user', 'admin'), deleteBooking);

// Get bookings for currently logged in user
router.get('/my-bookings', protect, getMyBookings);

module.exports = router;