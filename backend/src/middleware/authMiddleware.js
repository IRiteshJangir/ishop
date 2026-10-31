const { verifyToken } = require('../config/jwt');
const { getDbStatus } = require('../config/db');
const User = require('../models/User');
const store = require('../config/store');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = verifyToken(token);

      if (getDbStatus()) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        const found = store.users.find(u => u._id === decoded.id || u.email === decoded.id);
        if (found) {
          const { password, rawPassword, ...safeUser } = found;
          req.user = safeUser;
        }
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Not authorized as an admin' });
};

module.exports = { protect, admin };
