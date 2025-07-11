const Property = require('../models/Property');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Get all properties (handled by advancedResults middleware)
 * @returns {Object} The advancedResults object
 */
const getProperties = async () => {
  // Note: Actual querying is handled by advancedResults middleware
  throw new Error('This method should not be called directly');
};

/**
 * Get a single property by ID
 * @param {string} id - Property ID
 * @returns {Promise<Object>} Property document with populated bookings and reviews
 * @throws {ErrorResponse} If property not found
 */
const getPropertyById = async (id) => {
  const property = await Property.findById(id)
    .populate('bookings')
    .populate('reviews');

  if (!property) {
    throw new ErrorResponse(`Property not found with id of ${id}`, 404);
  }

  return property;
};

/**
 * Create a new property
 * @param {Object} propertyData - Property data including user ID
 * @returns {Promise<Object>} Created property document
 */
const createProperty = async (propertyData) => {
  return await Property.create(propertyData);
};

/**
 * Update a property
 * @param {string} id - Property ID to update
 * @param {Object} updateData - Data to update
 * @param {string} userId - Requesting user ID
 * @param {string} userRole - Requesting user role
 * @returns {Promise<Object>} Updated property document
 * @throws {ErrorResponse} If property not found or unauthorized
 */
const updateProperty = async (id, updateData, userId, userRole) => {
  let property = await Property.findById(id);

  if (!property) {
    throw new ErrorResponse(`Property not found with id of ${id}`, 404);
  }

  // Authorization check
  if (property.user.toString() !== userId && userRole !== 'admin') {
    throw new ErrorResponse(
      `User ${userId} is not authorized to update this property`,
      401
    );
  }

  property = await Property.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });

  return property;
};

/**
 * Delete a property
 * @param {string} id - Property ID to delete
 * @param {string} userId - Requesting user ID
 * @param {string} userRole - Requesting user role
 * @returns {Promise<Object>} Empty object
 * @throws {ErrorResponse} If property not found or unauthorized
 */
const deleteProperty = async (id, userId, userRole) => {
  const property = await Property.findById(id);

  if (!property) {
    throw new ErrorResponse(`Property not found with id of ${id}`, 404);
  }

  // Authorization check
  if (property.user.toString() !== userId && userRole !== 'admin') {
    throw new ErrorResponse(
      `User ${userId} is not authorized to delete this property`,
      401
    );
  }

  await property.remove();
  return {};
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
};