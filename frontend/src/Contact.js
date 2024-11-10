import React, { useState } from 'react';
import { FaUser, FaEnvelope } from 'react-icons/fa'; // Import the icons

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Your message has been sent!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        alert('Failed to send the message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-100 px-4 sm:px-8 lg:px-16" // Added padding for responsiveness
      style={{
        padding: '20px',
      }}
    >
      <div
        className="relative w-full max-w-7xl h-[600px] rounded-lg overflow-hidden shadow-lg p-6 pt-14 pb-4"
        style={{
          backgroundImage:
            "url('https://st2.depositphotos.com/25067502/49750/v/450/depositphotos_497506034-stock-illustration-library-book-shelves-flying-books.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className="relative z-10 w-full sm:max-w-lg p-6 pt-6 pb-4 bg-white bg-opacity-90 backdrop-blur-md mx-auto shadow-lg rounded-lg hover:scale-105 transition-transform"
        >
          <h2 className="text-3xl font-bold mb-4 text-center">Contact Us</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4 relative">
              <FaUser className="absolute left-3 top-10 text-gray-500" /> {/* Person icon */}
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4 relative">
              <FaEnvelope className="absolute left-3 top-10 text-gray-500" /> {/* Email icon */}
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
