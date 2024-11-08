const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    openLibraryBookId: { 
        type: String, // Use String instead of ObjectId for OpenBook library ID
        required: true 
    },
    username: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
