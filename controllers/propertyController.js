const Property = require('../models/Property');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    Get all properties
// @route   GET /api/v1/properties
// @access  Public
exports.getProperties = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single property
// @route   GET /api/v1/properties/:id
// @access  Public
exports.getProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findOne(req.params.userId)
    .populate('bookings')
    .populate('reviews');

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with userId of ${req.params.userId}`, 404)
    );
  }

  res.status(200).json({ success: true, data: property });
});

// @desc    Create new property
// @route   POST /api/v1/properties
// @access  Private
exports.createProperty = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.userId;

  const property = await Property.create(req.body);

  res.status(201).json({
    success: true,
    data: property
  });
});

// @desc    Update property
// @route   PUT /api/v1/properties/:id
// @access  Private
exports.updateProperty = asyncHandler(async (req, res, next) => {
  let property = await Property.findOne(req.params.userId);

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with userId of ${req.params.userId}`, 404)
    );
  }

  // Make sure user is property owner
  if (property.user.toString() !== req.user.userId && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this property`,
        401
      )
    );
  }

  property = await Property.findOneAndUpdate(req.params.userId, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: property });
});

// @desc    Delete property
// @route   DELETE /api/v1/properties/:id
// @access  Private
exports.deleteProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findOne(req.params.userId);

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with userId of ${req.params.userId}`, 404)
    );
  }

  // Make sure user is property owner
  if (property.user.toString() !== req.user.userId && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.userId} is not authorized to delete this property`,
        401
      )
    );
  }

  await property.remove();

  res.status(200).json({ success: true, data: {} });
});