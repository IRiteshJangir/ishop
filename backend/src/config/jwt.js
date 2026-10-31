const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ishop_super_secret_jwt_key_2026_secured!';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
  JWT_SECRET,
};
