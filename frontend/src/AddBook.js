import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';

const AddBook = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookResults, setBookResults] = useState([]);
  const [randomBooks, setRandomBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRandomBooks = async () => {
      try {
        const response = await fetch(`https://openlibrary.org/subjects/best_sellers.json?limit=20`);
        const data = await response.json();
        if (data.works) setRandomBooks(data.works);
      } catch (err) {
        console.error('Error fetching random books:', err);
      }
    };
    fetchRandomBooks();
  }, []);

  const fetchBooks = useCallback(async () => {
    if (searchQuery.trim() === '') {
      setBookResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=20`);
      const data = await response.json();

      if (data.docs) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filteredBooks = data.docs.filter(book => {
          const yearMatches = book.first_publish_year && book.first_publish_year.toString().includes(searchQuery);
          const genreMatches = book.subject ? book.subject.some(subject => subject.toLowerCase().includes(lowerCaseQuery)) : false;

          return (
            (book.author_name && book.author_name.some(name => name.toLowerCase().includes(lowerCaseQuery))) ||
            yearMatches ||
            genreMatches
          );
        });
        setBookResults(filteredBooks);
      } else {
        setBookResults([]);
      }
    } catch (err) {
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const debouncedFetchBooks = debounce(fetchBooks, 300);
    debouncedFetchBooks();

    return () => {
      debouncedFetchBooks.cancel();
    };
  }, [fetchBooks]);

  const handleBookClick = async (book) => {
    if (!userId) {
      alert('Please log in to save books.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/books',
        {
          title: book.title,
          author: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
          description: book.description || 'No description available',
          userId: userId,
          cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : '/no-image.jpg',
          year: book.first_publish_year || 'Unknown Year',
          genre: book.subjects ? book.subjects.join(', ') : 'Unknown Genre',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        alert(`Saved "${book.title}" to your collection!`);
      } else {
        alert('Failed to save book. Please try again.');
      }
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Failed to save book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReadMore = (bookKey) => {
    window.open(`https://openlibrary.org${bookKey}`, '_blank');
  };

  const handleAddCommentClick = (bookId) => {
    navigate(`/works/${bookId}/comment`);
  };

  const handleViewCommentsClick = (bookId) => {
    navigate(`/works/${bookId}/comments`);
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col justify-between" style={{ backgroundImage: `url('https://i.imgur.com/your-image-id.jpg')` }}>
      <div className="flex-grow flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl font-bold text-white mb-6">Add a Book to Your Collection</h1>

        <Link to="/view-collections" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
          View Collections
        </Link>

        <div className="flex items-center justify-center w-full px-4">
          <div className="relative w-1/2">
            <input
              type="text"
              className="w-full p-2 pl-10 rounded-lg border -2 border-gray-200 focus:outline-none focus:bg-white focus:border-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a book by title, author, genre, or year..."
            />
            <FaSearch className="absolute top-0 left-0 ml-2 mt-2 text-gray-600" />
          </div>
        </div>

        {loading && <p className="text-lg text-gray-600">Loading...</p>}

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {searchQuery ? (
            bookResults.length > 0 ? (
              bookResults.map((book) => (
                <li key={book.key} className="bg-white p-4 shadow-lg rounded-lg cursor-pointer">
                  <h3 className="font-bold text-lg mb-2">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{book.author_name ? book.author_name.join(', ') : 'Unknown Author'}</p>
                  <p className="text-sm text-gray-600 mb-2">Published Year: {book.first_publish_year || 'Unknown'}</p>
                  <p className="text-sm text-gray-600 mb-2">Genre: {book.subjects ? book.subjects.join(', ') : 'Unknown Genre'}</p>
                  <img
                    src={book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : '/no-image.jpg'}
                    alt={book.title}
                    className="w-full h-48 object-cover rounded-md"
                    style={{ maxHeight: '200px', objectFit: 'contain' }}
                  />
                  <button
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleBookClick(book)}
                  >
                    Save Book
                  </button>
                  <button
                    className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleReadMore(book.key)}
                  >
                    Read Me
                  </button>
                  <button
                    className="mt-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleAddCommentClick(book.key)}
                  >
                    Comment
                  </button>
                  {/* New View Comments button */}
                  <button
                    className="mt-2 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleViewCommentsClick(book.key)}
                  >
                    View Comments
                  </button>
                </li>
              ))
            ) : (
              <p className="text-gray-600">No books found for "{searchQuery}".</p>
            )
          ) : (
            randomBooks.map((book) => (
              <li key={book.key} className="bg-white p-4 shadow-lg rounded-lg cursor-pointer">
                <h3 className="font-bold text-lg mb-2">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{book.authors ? book.authors.map(author => author.name).join(', ') : 'Unknown Author'}</p>
                <p className="text-sm text-gray-600 mb-2">Genre: {book.subject || 'Unknown Genre'}</p>
                <img
                  src={book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` : '/no-image.jpg'}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-md"
                  style={{ maxHeight: '200px', objectFit: 'contain' }}
                />
                <button
                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleBookClick(book)}
                >
                  Save Book
                </button>
                <button
                  className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleReadMore(book.key)}
                >
                  Read Me
                </button>
                <button
                  className="mt-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() =>  handleAddCommentClick(book.key)}
                >
                  Comment
                </button>
                {/* New View Comments button */}
                <button
                  className="mt-2 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleViewCommentsClick(book.key)}
                >
                  View Comments
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default AddBook;
