import React, { useState, useEffect, createContext,  Suspense } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { debounce } from 'lodash';

// Lazy loading components
const About = React.lazy(() => import('./About'));
const Contact = React.lazy(() => import('./Contact'));
const AuthForm = React.lazy(() => import('./AuthForm'));
const ProfilePage = React.lazy(() => import('./Profile'));
const AddBook = React.lazy(() => import('./AddBook'));
const ViewCollection = React.lazy(() => import('./ViewCollection'));
const DeleteBook = React.lazy(() => import('./DeleteBook'));
const BestSellingBooks = React.lazy(() => import('./BestSellingBooks'));
const PopularBooks = React.lazy(() => import('./PopularBooks'));
const BooksRead = React.lazy(() => import('./BooksRead'));
const CommentsSection = React.lazy(() => import('./CommentsSection'));
const CommentsPage = React.lazy(() => import('./CommentsPage'));
const ResetPasswordPage = React.lazy(() => import('./PasswordReset'));

// Create User Context
const UserContext = createContext();

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookResults, setBookResults] = useState([]);
  const [randomBooks, setRandomBooks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  // Cache random books in localStorage to reduce API calls
  useEffect(() => {
    const cachedRandomBooks = JSON.parse(localStorage.getItem('randomBooks'));
    if (cachedRandomBooks) {
      setRandomBooks(cachedRandomBooks);
    } else {
      const fetchRandomBooks = async () => {
        try {
          const response = await fetch(`https://openlibrary.org/subjects/best_sellers.json?limit=20`);
          const data = await response.json();
          if (data.works) {
            setRandomBooks(data.works);
            localStorage.setItem('randomBooks', JSON.stringify(data.works));
          }
        } catch (err) {
          console.error('Error fetching random books:', err);
        }
      };
      fetchRandomBooks();
    }
  }, []);

  // Debounced search to avoid excessive requests
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${searchQuery}&limit=20`);
        const data = await response.json();
        if (data.docs) {
          setBookResults(data.docs);
          setError(null);
        } else {
          setBookResults([]);
          setError('No books found.');
        }
      } catch (err) {
        setError('An error occurred while fetching books.');
      }
    };

    if (searchQuery.trim() !== '') {
      const debouncedFetch = debounce(fetchBooks, 500);
      debouncedFetch();
      return () => debouncedFetch.cancel();
    } else {
      setBookResults([]);
      setError(null);
    }
  }, [searchQuery]);

  // Alert if the user is not logged in
  const handleBookClick = (book) => {
    if (!userId) {
      alert('Please log in to save books and explore more features in your profile.');
    } else {
      alert(`Saved "${book.title}" to your collection!`);
    }
  };

  const handleReadMore = (bookKey) => {
    if (!userId) {
      alert('Please log in to save books and explore more features in your profile.');
    } else {
      window.open(`https://openlibrary.org${bookKey}`, '_blank');
    }
  };

  const handleLogin = (userId) => {
    setUserId(userId);
  };

  const getBookImage = (book) => {
    const coverId = book.cover_i ? book.cover_i : book.cover_id;
    return coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : '/no-image.jpg'; // Fallback image if no cover is found
  };

  return (
    <UserContext.Provider value={{ userId, handleLogin }}>
      <Router>
        <div className="min-h-screen bg-cover bg-center flex flex-col justify-between" style={{ backgroundImage: `url('https://i.imgur.com/your-image-id.jpg')` }}>
          {/* Navbar */}
          <nav className="flex justify-between items-center bg-black p-4">
            <div className="text-white text-2xl">Book Library</div>
            <div className="flex space-x-4">
              <Link to="/" className="text-white">Home</Link>
              <Link to="/about" className="text-white">About Us</Link>
              <Link to="/contact" className="text-white">Contact</Link>
              <Link to="/best-selling" className="text-white">Best Selling Books</Link>
              <Link to="/popular" className="text-white">Popular Books</Link>
              <Link to="/books-read" className="text-white">Books Read</Link>
              <Link to="/auth" className="text-white">
                <img src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=2048x2048&w=is&k=20&c=6hQNACQQjktni8CxSS_QSPqJv2tycskYmpFGzxv3FNs=" alt="Profile" className="w-8 h-8 rounded-full" />
              </Link>
            </div>
          </nav>

          {/* Routes */}
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route
                path="/"
                element={
                  <div className="flex-grow flex flex-col justify-center items-center text-center">
                    <h1 className="text-4xl font-bold text-white mb-6">"A room without books is like a body without a soul."</h1>

                    {/* Search Bar */}
                    <div className="flex items-center justify-center w-full px-4">
                      <div className="relative w-1/2">
                        <input
                          type="text"
                          className="w-full p-2 pl-10 rounded-lg border-none"
                          placeholder="Search for a book..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-500" />
                      </div>
                    </div>

                    {/* Display Book Results */}
                    <div className="mt-6 w-full px-6">
                      {error && <p className="text-red-500">{error}</p>}
                      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {(bookResults.length > 0 ? bookResults : randomBooks).map((book) => (
                          <li key={book.key} className="bg-white p-4 shadow-lg rounded-lg cursor-pointer">
                            <h3 className="font-bold text-lg mb-2">{book.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{book.author_name ? book.author_name.join(', ') : 'Unknown Author'}</p>
                            <img
                             src={getBookImage(book)}
                             alt={book.title}
                             className="w-full h-48 object-cover rounded-md"
                             style={{ maxHeight: '200px', objectFit: 'contain' }}
                            />
                            <button
                              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                              onClick={() => handleBookClick(book)}
                              //disabled={!userId}
                            >
                              Save Book
                            </button>
                            <button
                              className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                              onClick={() => handleReadMore(book.key)}
                              //disabled={!userId}
                            >
                              Read Me
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<AuthForm onLogin={handleLogin} />} />
              <Route path="/profile" element={<ProfilePage userId={userId} />} />
              <Route path="/add-book" element={<AddBook />} />
              <Route path="/delete-book" element={<DeleteBook />} />
              <Route path="/view-collections" element={<ViewCollection />} />
              <Route path="/best-selling" element={<BestSellingBooks />} />
              <Route path="/popular" element={<PopularBooks />} />
              <Route path="/books-read" element={<BooksRead />} />
              <Route path="/works/:bookId/comment" element={<CommentsSection />} />
              <Route path="/works/:openLibraryBookId/comments" element={<CommentsPage />} />
              <Route path="/password-reset" element={<ResetPasswordPage />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
