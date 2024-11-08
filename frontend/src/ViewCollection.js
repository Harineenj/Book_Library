import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewCollection = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/books', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooks(response.data);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Function to search for book key from OpenLibrary
  const fetchBookKey = async (title, author) => {
    try {
      const response = await axios.get(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`);
      const bookData = response.data.docs[0]; // Take the first result as the match
      return bookData?.key || null;
    } catch (error) {
      console.error('Error fetching book key from OpenLibrary:', error);
      return null;
    }
  };

  // Modified handleReadMore to get book key and redirect
  const handleReadMore = async (title, author) => {
    const bookKey = await fetchBookKey(title, author);
    if (bookKey) {
      window.open(`https://openlibrary.org${bookKey}`, '_blank');
    } else {
      alert('Book information not found on OpenLibrary');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center font-inter px-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">My Book Collection</h1>
      <ul className="w-full max-w-6xl flex flex-wrap justify-center gap-6">
        {books.map((book) => (
          <li key={book._id} className="border p-6 rounded-lg shadow-md w-1/4 max-w-xs flex flex-col items-center bg-white">
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">{book.title}</h2>
            <p className="text-gray-600 text-sm mb-4">Author: {book.author}</p>
            <img
              src={book.cover || '/no-image.jpg'}
              alt={book.title}
              className="w-32 h-48 object-cover mb-4 rounded-lg shadow-sm"
            />
            <p className="text-sm text-center text-gray-700 mb-4">{book.description}</p>
            <button
              onClick={() => handleReadMore(book.title, book.author)}
              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition"
            >
              Read More
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewCollection;
