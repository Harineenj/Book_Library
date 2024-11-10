// models/bookModel.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    openlibrarybookid:{type: String,required:true},
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cover: { type: String, required: true },
    year:{type:Number,required:true},
    genre:{type:[String],required:true},
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
