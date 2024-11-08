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
    <div className="min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Delete Book Collection</h1>
      <ul className="w-full max-w-md">
        {books.map((book) => (
          <li key={book._id} className="border p-4 mb-2 rounded">
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p className="text-gray-600">Author: {book.author}</p>
            <img
              src={book.cover || '/no-image.jpg'} // Use a default image if no cover exists
              alt={book.title}
              className="w-32 h-48 object-cover"
            />
            <p className="mt-2">{book.description}</p>
            <button
              onClick={() => deleteBook(book._id)}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
