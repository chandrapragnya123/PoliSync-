const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    //Destructure incoming user data from the request body:
    const { name, email, password, role, badgeNumber } = req.body;

    //Create a new User instance using your Mongoose model (User):
    const user = new User({ name, email, password, role, badgeNumber });

    //Save the user to the database:
    await user.save();

    //Generate a JWT token with the user's ID and role:
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET);

    //Respond with a success status and the token:
    res.status(201).json({ token });

  } catch (error) {
    //Error Handling:
    //If something fails (like validation or database errors), it sends a 400 response:
    res.status(400).json({ error: error.message });
  }
};

  // Implementing login logic , login Function:
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 2. Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Optional: expires in 1 day
    );

    // 4. Send token in response
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

//This code is a Node.js backend controller using Express, Mongoose, and JWT (JSON Web Tokens) to handle user registration and login. 