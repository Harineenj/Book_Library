// utils/mailer.js
const nodemailer = require('nodemailer');

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use another service if you prefer
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password
  }
});

// Function to send a password reset email
const sendPasswordResetEmail = (to, resetLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Please click the following link to reset your password: ${resetLink}`,
    html: `<p>You requested a password reset.</p><p>Please click the link below to reset your password:</p><a href="${resetLink}">Reset Password</a>`
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetEmail };
