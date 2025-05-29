const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, badgeNumber } = req.body;
    const user = new User({ name, email, password, role, badgeNumber });
    await user.save();
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  // Implement login logic
};