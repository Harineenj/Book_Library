import React, { useEffect, useState } from 'react';

const BooksRead = () => {
  const [booksRead, setBooksRead] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const fetchBooksRead = async () => {
      try {
        // Add the full URL if needed, such as http://localhost:5000/api/books/read-count
        const response = await fetch('http://localhost:5000/api/books/read-count');
        
        // Check if response type is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Expected JSON response but got a different content type');
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch books read data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setBooksRead(data);
      } catch (err) {
        console.error('Error fetching books read data:', err); // Improved error logging
        setError(err.message);
      } finally {
        setLoading(false); // Ensure loading is set to false after request completes
      }
    };

    fetchBooksRead();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 mr-10 ml-10 mt-16 bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-100">
      <h2 className="text-2xl font-bold mb-4 justify-center">Books Read by Users</h2>
      {loading && <p>Loading...</p>} {/* Display loading indicator */}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && booksRead.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {booksRead.map((book) => (
            <li key={book._id} className="bg-white p-4 shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-gray-50">
              <h3 className="font-bold text-lg mb-2">{book._id}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {book.author ? book.author : 'Unknown Author'}
              </p>
              <img
                src={book.cover ? book.cover : '/no-image.jpg'}
                alt={book._id}
                className="w-full h-48 object-cover rounded-md"
                style={{ maxHeight: '200px', objectFit: 'contain' }}
              />
              <p className="mt-2 text-gray-700">
                Read by {book.readerCount || 0} user{book.readerCount !== 1 ? 's' : ''}.
              </p>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No books have been read yet.</p> // Avoid showing this during loading
      )}
    </div>
  );
};

export default BooksRead;
