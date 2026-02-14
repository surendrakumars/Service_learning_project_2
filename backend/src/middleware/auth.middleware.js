const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({ success: false, error: 'Server misconfiguration' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (!decoded?.id || !decoded?.role) {
      return res.status(401).json({ success: false, error: 'Not authorized, invalid token payload' });
    }
    const user = await User.findById(decoded.id).select('_id role');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Not authorized, user not found' });
    }

    req.user = {
      id: String(decoded.id),
      role: user.role,
    };

    if (!req.user.id || !req.user.role) {
      return res.status(401).json({ success: false, error: 'Not authorized, invalid token payload' });
    }

    return next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
