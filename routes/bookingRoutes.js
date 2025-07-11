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
  // .get(
  //   advancedResults(Booking, {
  //     path: 'property user',                                   
  //     select: 'title name email'
  //   }),
  //   getBookings
  // )
  .post(protect, authorize('USER', 'ADMIN','HOST'), createBooking);

router
  .route('/:bookingId')
  .get(protect, authorize('ADMIN','USER'),getMyBookings)
  .put(protect, authorize('USER', 'ADMIN','HOST'), updateBooking)
  .delete(protect, authorize('USER', 'ADMIN','HOST'), deleteBooking);

// Get bookings for currently logged in user

module.exports = router;