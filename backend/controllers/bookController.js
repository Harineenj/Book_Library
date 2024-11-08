// controllers/bookController.js
const Book = require('../models/bookModel');
const asyncHandler = require('express-async-handler');

const saveBook = async (req, res) => {
  const { title, author, description, userId, cover } = req.body; // Extract cover image URL
  console.log('Received cover URL:', cover);

  const newBook = new Book({
    title,
    author,
    description,
    userId,
    cover, // Save the cover image URL
  });

  try {
    await newBook.save();
    res.status(201).json({ message: 'Book saved successfully', book: newBook });
  } catch (error) {
    res.status(500).json({ message: 'Error saving book', error });
  }
};

// Get all saved books for a user
exports.getUserBooks = asyncHandler(async (req, res) => {
  const userId = req.user.id; // Extract the user ID from the request
  try {
    const books = await Book.find({ userId }); // Find books for the user
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error });
  }
});