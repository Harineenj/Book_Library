// models/bookModel.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cover: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);