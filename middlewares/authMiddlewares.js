const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not logged in! Please log in to get access.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Please log in again.'
    });
  }
};

// Authorize based on user role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Normalize user roles to always be an array
    const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];

    // Check if at least one required role matches the user's roles
    const hasAccess = roles.some(role => userRoles.includes(role));

    if (!hasAccess) {
      return res.status(403).json({
        status: 'fail',
        message: `User role ${userRoles} is not authorized to access this route`
      });
    }

    next();
  };
};
