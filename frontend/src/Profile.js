import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchProfile = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/profile', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else if (response.status === 401) {
                setError('Session expired. Redirecting to login...');
                localStorage.removeItem('token');
                navigate('/auth');
            } else {
                setError('Failed to fetch profile data');
            }
        } catch (error) {
            setError('Error fetching profile: ' + error.message);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth');
    };

    if (loading) return <p className="text-gray-700 text-center">Loading profile...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    const handleAddBook = () => {
        navigate('/add-book');
    };

    const handleDeleteBook = () => {
        navigate('/delete-book');
    };

    const handleViewCollection = () => {
        navigate('/view-collections');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-10 px-5"
             style={{
                 backgroundImage: "url('https://img.freepik.com/free-vector/blank-opened-white-book-with-flowers-flat-style_1166-81.jpg')",
                 backgroundSize: 'cover', // Scale the background to cover the screen
                 backgroundPosition: 'center', // Center the image
                 backgroundRepeat: 'no-repeat', // Prevent it from repeating
                 backgroundAttachment: 'fixed', // Ensure it stays fixed when scrolling
                 filter: 'brightness(0.9)', // Slightly dim the background for readability
             }}
        >
            {/* Profile Card */}
            <div className="bg-white/80 p-8 rounded-lg shadow-lg backdrop-blur-md w-full max-w-lg text-center mb-10">
                <img
                    src={`${process.env.PUBLIC_URL}/profile.png`}
                    alt="Profile"
                    className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4"
                />
                <h2 className="text-3xl font-semibold text-gray-800">{user.username}</h2>
                <p className="text-gray-600 mt-2">{user.email}</p>
                <p className="text-gray-600 mt-2">Books Read: {user.booksRead || 0}</p>
                <p className="text-gray-600 mt-2">Total Books: {user.totalBooks || 0}</p>
                <button
                    className="mt-6 px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-500 transition duration-300"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-4 w-full max-w-md">
                <button
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition duration-300"
                    onClick={handleAddBook}
                >
                    Add Book
                </button>
                <button
                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-500 transition duration-300"
                    onClick={handleDeleteBook}
                >
                    Delete Book
                </button>
                <button
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-500 transition duration-300"
                    onClick={handleViewCollection}
                >
                    View Collection
                </button>
            </div>
        </div>
    );
};

export default Profile;
