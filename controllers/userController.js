const userService = require('../services/userService');
const ErrorResponse = require('../utils/errorResponse');

module.exports = {
  getAllUsers: async (req, res, next) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (err) {
      next(err);
    }
  },

  getUser: async (req, res, next) => {
    try {
      const user = await userService.getUserById(req.params.userId);
      if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.userId}`, 404));
      }
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (err) {
      next(err);
    }
  },

  createUser: async (req, res, next) => {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (err) {
      next(err);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const user = await userService.updateUser(req.params.userId, req.body);
      if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.userId}`, 404));
      }
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (err) {
      next(err);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const user = await userService.deleteUser(req.params.userId);
      if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.userId}`, 404));
      }
      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (err) {
      next(err);
    }
  }
};