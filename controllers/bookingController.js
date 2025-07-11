const Booking = require('../models/Booking');
const Property = require('../models/Property');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @route   GET /api/v1/properties/:propertyId/bookings
// @access  Private
exports.getMyBookings = asyncHandler(async (req, res, next) => {
  // Step 1: Get bookings for the current user
  const bookings = await Booking.find({ userId: req.user.userId });

  // Step 2: For each booking, fetch its property by `propertyId`
  const bookingsWithProperty = await Promise.all(
    bookings.map(async (booking) => {
      const property = await Property.findOne({ propertyId: booking.propertyId }).select(
        'title location pricePerNight photos'
      );

      return {
        ...booking.toObject(),
        property
      };
    })
  );

  // Step 3: Send combined response
  res.status(200).json({
    success: true,
    count: bookingsWithProperty.length,
    data: bookingsWithProperty
  });
});

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).populate({
    path: 'property',
    select: 'title pricePerNight'
  });

  if (!booking) {
    return next(
      new ErrorResponse(`No booking found with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is booking owner or admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this booking`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Create new booking
// @route   POST /api/v1/properties/:propertyId/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res, next) => {
  req.body.userId = req.user.userId;

  const property = await Property.findOne({propertyId:req.body.propertyId});

  if (!property) {
    return next(
      new ErrorResponse(
        `No property with the id of ${req.body.propertyId}`,
        404
      )
    );
  }

  // Calculate days of stay
  const checkInDate = new Date(req.body.checkInDate);
  const checkOutDate = new Date(req.body.checkOutDate);
  const daysOfStay = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

  req.body.daysOfStay = daysOfStay;
  req.body.amountPaid = daysOfStay * property.pricePerNight;

  const booking = await Booking.create(req.body);

  res.status(201).json({
    success: true,
    data: booking
  });
});

// @desc    Update booking
// @route   PUT /api/v1/bookings/:id
// @access  Private
exports.updateBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findOne({bookingId:req.params.bookingId});

  if (!booking) {
    return next(
      new ErrorResponse(`No booking with the id of ${req.params.bookingId}`, 404)
    );
  }

  // Make sure user is booking owner or admin
  if (booking.userId.toString() !== req.user.userId && req.user.role !== 'ADMIN') {
    return next(
      new ErrorResponse(
        `User ${req.user.userId} is not authorized to update this booking`,
        401
      )
    );
  }

  booking = await Booking.findOneAndUpdate({bookingId:req.params.bookingId}, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Delete booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private
exports.deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findOne(req.params.id);

  if (!booking) {
    return next(
      new ErrorResponse(`No booking with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is booking owner or admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this booking`,
        401
      )
    );
  }

  await booking.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});