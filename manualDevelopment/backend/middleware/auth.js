const { verifyToken } = require('../utils/jwtUtils');

/**
 * Middleware to verify JWT token and authenticate user
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyToken(token);
    
    // Attach user info to request object
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};

/**
 * Middleware to check if user has admin role
 */
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

/**
 * Middleware to check if user has admin or teacher role
 */
const isAdminOrTeacher = (req, res, next) => {
  if (req.user.role !== 'Admin' && req.user.role !== 'Teacher') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin or Teacher privileges required.'
    });
  }
  next();
};

module.exports = {
  authenticate,
  isAdmin,
  isAdminOrTeacher
};
