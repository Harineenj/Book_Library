const User = require('../models/userModel'); // Ensure this path is correct
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// User Signup
exports.signup = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  console.log(username,email,password,confirmPassword);

  // Check that all fields are provided
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields (username, email, password, confirm password) are required' });
  }

  // Check that passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create a new user and save
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// User Login
exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // Find the user by username or email
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Log the found user and password information
    console.log('User found:', user);
    console.log('Input Password:', password);
    console.log('Stored Hashed Password:', user.password);

    // Compare the password using the comparePassword method
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Adjust expiration as needed
    });
      console.log(token);
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Get User Profile
exports.getUserProfile = asyncHandler(async (req, res) => {
  try {
    // Validate user ID (optional)
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      throw new Error(`User with ID ${req.user.id} not found`);
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      message: `Welcome, ${user.username}!`,
    });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message });
  }
});
