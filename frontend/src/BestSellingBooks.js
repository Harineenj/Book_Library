import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // Import FaSearch for the search icon

const BestSellingBooks = () => {
  const [bestSellingBooks, setBestSellingBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchBestSellingBooks = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await fetch('https://openlibrary.org/subjects/best_sellers.json');
        const data = await response.json();
        console.log(data); // Log the full response for debugging
        if (data.works) {
          setBestSellingBooks(data.works);
          setFilteredBooks(data.works); // No limit, all books are set
          setError(null);
        } else {
          setBestSellingBooks([]);
          setError('No best-selling books found.');
        }
      } catch (err) {
        console.error(err); // Log error
        setError('An error occurred while fetching best-selling books.');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchBestSellingBooks();
  }, []);

  useEffect(() => {
    // Filter based on the search term
    const results = bestSellingBooks.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredBooks(results.length > 0 ? results : bestSellingBooks); // Show all books if no results
  }, [searchTerm, bestSellingBooks]);

  return (
    <div className="mt-9 w-full px-20">
      <h2 className="text-2xl font-bold mb-4 mt-10">Best Selling Books</h2>
      {error && <p className="text-red-500">{error}</p>}
      
      {/* Search Bar */}
      <div className="flex items-center justify-center w-full mb-4">
        <div className="relative w-1/2 pt-8 p">
          <input
            type="text "
            className="w-full p-3 pl-12 pr-4 rounded-lg bg-white-100 text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition hover:translate-y-[-4px]"
            placeholder="Search for a book..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-4 top-12 text-gray-500" />
        </div>
      </div>

      {/* Display Loading Indicator */}
      {loading ? (
        <p className="text-gray-500">Loading best-selling books...</p>
      ) : (
        // Display Best Selling Books
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => {
              console.log(`Book Title: ${book.title}, Cover ID: ${book.cover_id}`); // Log title and cover ID for debugging
              return (
                <li key={book.key}  className="bg-white p-4 shadow-lg rounded-lg cursor-pointer hover:shadow-2xl hover:translate-y-[-4px] transition-transform duration-200">
                  <h3 className="font-bold text-lg mb-2">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{book.author_name ? book.author_name.join(', ') : 'Unknown Author'}</p>
                  <img
                    src={book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` : '/no-image.jpg'}
                    alt={book.title}
                    className="w-full h-48 object-cover rounded-md"
                    style={{ maxHeight: '200px', objectFit: 'contain' }} // Use contain for better aspect ratio
                  />
                </li>
              );
            })
          ) : (
            <p className="text-gray-500">No books found.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default BestSellingBooks;
