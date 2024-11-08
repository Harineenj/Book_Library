// authRoutes.js
const express = require('express');
const { signup, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel'); 
const jwt = require('jsonwebtoken');


const router = express.Router();
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('./mailer'); 

router.post('/signup', signup); // Route for user signup
router.post('/login', login);    // Route for user login

router.get('/profile', protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}));

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate JWT as a reset token, valid for 1 hour
        const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Create a reset link containing the token
        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

        // Send the reset email with the link
        await sendPasswordResetEmail(email, resetLink);
        console.log(`Password reset link: http://localhost:3000/reset-password/${resetToken}`);


        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error in forgot-password route:', error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});    

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Verify the reset token
        console.log('Token:', token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the user by email from the decoded token payload
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the password and save it (make sure to hash it)
        user.password = password; // Hashing recommended before saving
        await user.save();

        res.status(200).json({ message: 'Password successfully updated' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Reset token has expired' });
        }
        console.error('Error in reset-password route:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});


    

module.exports = router; // Export the router
