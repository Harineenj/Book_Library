import React, { useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CommentsSection = () => {
    const { bookId } = useParams();
    useEffect(() => {
        console.log("Book ID from URL:", bookId);  // Log once the component mounts
    }, [bookId]);
    const [newComment, setNewComment] = useState({
        username: '',
        content: '',
        rating: 1,
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Handle input changes for new comment
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewComment({
            ...newComment,
            [name]: value,
        });
    };

    // Handle comment submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!newComment.username || !newComment.content || !newComment.rating) {
            setError('All fields are required');
            return;
        }

        try {
             await axios.post(`http://localhost:5000/api/books/${bookId}/comment`, newComment);
            setNewComment({
                username: '',
                content: '',
                rating: 1,
            });
            setSuccessMessage('Comment added successfully');
        } catch (err) {
            setError('Failed to add comment. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-[url('https://thumbs.dreamstime.com/z/abstract-tree-sculpture-vibrant-leaves-stacked-books-symbolic-knowledge-high-quality-photo-329782866.jpg?ct=jpeg')]">
        <div className="max-w-12xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
            <h2 className="text-2xl font-semibold text-center text-gray-800">Add Your Comment</h2>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            {successMessage && <p className="text-green-500 text-center mt-4">{successMessage}</p>}

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <div>
                    <label htmlFor="username" className="block text-gray-700 font-medium">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={newComment.username}
                        onChange={handleInputChange}
                        className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-gray-700 font-medium">Content</label>
                    <textarea
                        name="content"
                        value={newComment.content}
                        onChange={handleInputChange}
                        className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="rating" className="block text-gray-700 font-medium">Rating</label>
                    <input
                        type="number"
                        name="rating"
                        value={newComment.rating}
                        onChange={handleInputChange}
                        min="1"
                        max="5"
                        className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md mt-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Submit Comment
                </button>
            </form>
            </div>
        </div>
    );
};

export default CommentsSection;
