// routes/contact.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST route to handle form submissions
router.post('/', async (req, res) => {
  try {
    const newContact = new Contact({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
    });
    await newContact.save();
    res.status(200).json({ message: 'Message received and stored successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while saving the message.' });
  }
});

module.exports = router;
