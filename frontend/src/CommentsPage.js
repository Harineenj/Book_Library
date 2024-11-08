import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CommentsPage = () => {
  const { openLibraryBookId } = useParams(); // Get book ID from URL parameter
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch comments for the specific book
    axios.get(`http://localhost:5000/api/books/${openLibraryBookId}/comment`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
        setError('Failed to load comments.');
      });

  //   // Fetch the book name using the openLibraryBookId
  //   axios.get(`https://openlibrary.org/api/books?bibkeys=OLID:${openLibraryBookId}&format=json`)
  //     .then((response) => {
  //       const bookData = response.data[`OLID:${openLibraryBookId}`];
  //       setBookName(bookData ? bookData.title : 'Unknown Book');
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching book name:', error);
  //       setError('Failed to load book details.');
  //     });
     }, [openLibraryBookId]);

  // Function to render stars based on rating
  const renderStars = (rating) => {
    let stars = '';
    for (let i = 0; i < 5; i++) {
      stars += i < rating ? '★' : '☆'; // Filled stars for rating, empty stars for the rest
    }
    return stars;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Comments for Book: {openLibraryBookId}
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="p-6 bg-white shadow-md rounded-lg hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg text-gray-800">{comment.username}</span>
                <span className="text-sm text-yellow-500">{renderStars(comment.rating)}</span> {/* Display stars */}
              </div>
              <p className="text-gray-600 mt-2">{comment.content}</p>
              <p className="text-xs text-gray-500 mt-4">{new Date(comment.createdAt).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentsPage;
