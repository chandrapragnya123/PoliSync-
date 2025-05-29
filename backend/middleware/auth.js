const jwt = require('jsonwebtoken');
const User = require('../models/User');

const USER_ROLES = {
  CITIZEN: 'citizen',
  POLICE: 'police'
};

const auth = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ _id: decoded._id });

      if (!user) {
        throw new Error();
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