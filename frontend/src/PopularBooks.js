import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // Import FaSearch for the search icon

const PopularBooks = () => {
  const [popularBooks, setPopularBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchPopularBooks = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await fetch('https://openlibrary.org/search.json?q=popular');
        const data = await response.json();
        if (data.docs) {
          setPopularBooks(data.docs);
          setFilteredBooks(data.docs); // Set filtered books to all initially
          setError(null);
        } else {
          setPopularBooks([]);
          setError('No popular books found.');
        }
      } catch (err) {
        setError('An error occurred while fetching popular books.');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchPopularBooks();
  }, []);

  useEffect(() => {
    const results = popularBooks.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(results);
  }, [searchTerm, popularBooks]);

  return (
    <div className="mt-9 w-full px-20">
      <h2 className="text-2xl font-bold mb-6 mt-11 ">Popular Books</h2>
      {error && <p className="text-red-500">{error}</p>}
      
      {/* Search Bar */}
      <div className="flex items-center justify-center w-full mb-4">
        <div className="relative w-1/2 pt-10">
          <input
            type="text"
            placeholder="Search for a book..."
             className="w-full p-3 pl-12 pr-4 rounded-lg bg-white-100 text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition hover:translate-y-[-4px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
           
          />
          <FaSearch className="absolute left-3 top-14 text-gray-500" />
        </div>
      </div>

      {/* Display Loading Indicator */}
      {loading ? (
        <p className="text-gray-500">Loading books...</p>
      ) : (
        // Display Popular Books
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <li key={book.key}  className="bg-white p-4 shadow-lg rounded-lg cursor-pointer hover:shadow-2xl hover:translate-y-[-4px] transition-transform duration-200">
                <h3 className="font-bold text-lg mb-2">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{book.author_name ? book.author_name.join(', ') : 'Unknown Author'}</p>
                <img
                  src={book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : '/no-image.jpg'}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-md"
                  style={{ maxHeight: '200px', objectFit: 'contain' }}
                />
              </li>
            ))
          ) : (
            <p className="text-gray-500">No books found.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default PopularBooks;
