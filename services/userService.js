const User = require('../models/User'); // ✅ Make sure this line is present


module.exports = {
  getAllUsers: async () => {
    return await User.find().select('-password');
  },

  getUserById: async (userId) => {
    return await User.findOne({ userId }).select('-password');
  },

  createUser: async (userData) => {
    const user = new User(userData);
    return await user.save();
  },

  updateUser: async (userId, updateData) => {
    return await User.findOneAndUpdate(
      { userId },
      updateData,
     { new: true }
    )
  },

  deleteUser: async (userId) => {
    return await User.findOneAndDelete({ userId });
  }
};
