const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/userModel');
const Book = require('../models/bookModel');
const asyncHandler = require('express-async-handler');
const Comment = require('../models/Comments'); // Import the Comment model


const router = express.Router();

// Route to save a book for a user
router.post('/', protect, asyncHandler(async (req, res) => {
    const { title, author, description, cover } = req.body;

    // Check that all required fields are provided
    if (!title || !author || !description || !cover) {
        return res.status(400).json({ message: 'All fields (title, author, description, cover) are required' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create and save a new book
        const newBook = new Book({
            title,
            author,
            description,
            cover,
            userId: user._id
        });
        await newBook.save();

        res.status(201).json({ message: 'Book saved successfully', book: newBook });
    } catch (err) {
        console.error('Error saving book:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}));

// Get all saved books for a user
router.get('/', protect, asyncHandler(async (req, res) => {
    const userId = req.user.id;
    try {
        const books = await Book.find({ userId });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
}));

// Route to delete a book by ID
router.delete('/:id', protect, asyncHandler(async (req, res) => {
    const bookId = req.params.id;
    try {
        const deletedBook = await Book.findByIdAndDelete(bookId);
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully', book: deletedBook });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Error deleting book', error });
    }
}));

// Route to get books and the count of users who have read each
router.get('/read-count', asyncHandler(async (req, res) => {
    try {
        const booksReadCount = await Book.aggregate([
            {
                $group: {
                    _id: "$title",
                    author: { $first: "$author" },
                    cover: { $first: "$cover" },
                    readerCount: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json(booksReadCount);
    } catch (error) {
        console.error('Error fetching books read count:', error);
        res.status(500).json({ message: 'Error fetching books read count' });
    }
}));

// Fetch comments for a specific book by openLibraryBookId
router.get('/:openLibraryBookId/comment', async (req, res) => {
    const { openLibraryBookId } = req.params;
    console.log(openLibraryBookId );
    console.log(`Fetching comments for book with ID: ${openLibraryBookId}`);  // Log here

    try {
        const comments = await Comment.find({ openLibraryBookId }).sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Error fetching comments' });
    }
});


// Add a new comment for a book by openLibraryBookId
router.post('/:openLibraryBookId/comment', async (req, res) => {
    const { openLibraryBookId } = req.params;
    const { username, content, rating } = req.body;

    console.log('Received comment data:', { openLibraryBookId, username, content, rating });

    if (!username || !content || !rating) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newComment = new Comment({
            openLibraryBookId,
            username,
            content,
            rating
        });
        await newComment.save();
        console.log('Comment saved:', newComment);
        res.status(201).json({ comment: newComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Error adding comment' });
    }
});



module.exports = router;
