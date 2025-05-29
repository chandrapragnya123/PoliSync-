const jwt = require('jsonwebtoken');
const User = require('../models/User');

const USER_ROLES = {
  CITIZEN: 'citizen',
  POLICE: 'police',
};

const auth = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.header('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid token' });
      }

      const token = authHeader.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Please authenticate' });
    }
  };
};

module.exports = { auth, USER_ROLES };
