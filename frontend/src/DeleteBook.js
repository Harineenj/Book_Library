import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DeleteBook = () => {
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

  const deleteBook = async (bookId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/books/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBooks(books.filter(book => book._id !== bookId)); // Update the state to remove the deleted book
      alert('Book deleted successfully');
    } catch (err) {
      console.error('Error deleting book:', err);
      setError('Failed to delete the book');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center font-inter px-2">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Delete Book Collection</h1>
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">Manage and Delete Books</h2>
      
      {/* Grid Layout for Books */}
      <ul className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <li key={book._id} className="border p-6 rounded-lg shadow-xl w-full max-w-xs flex flex-col items-center bg-white transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-gray-50">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">{book.title}</h2>
            <p className="text-gray-600 text-sm mb-4">Author: {book.author}</p>
            <img
              src={book.cover || '/no-image.jpg'}
              alt={book.title}
              className="w-full h-48 object-cover mb-4 rounded-lg shadow-md"
            />
            <p className="text-sm text-center text-gray-700 mb-4">{book.description}</p>
            <button
              onClick={() => deleteBook(book._id)}
              className="mt-2 px-6 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeleteBook;
