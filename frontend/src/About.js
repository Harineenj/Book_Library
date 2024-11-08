import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();
  return (

    <div className="min-h-screen flex flex-col items-center bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <div 
        className="w-full h-[20vh] bg-cover bg-center flex items-center justify-center relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600195077908-d9d5e47f3e77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fGJvb2t8ZW58MHx8fHwxNjg0MDk4Mzcw&ixlib=rb-4.0.3&q=80&w=1080')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40" />
        <h1 className="relative text-4xl font-extrabold text-white drop-shadow-lg">
          About Us
        </h1>
      </div>

      {/* Introduction Section */}
      <section className="w-11/12 lg:w-7/12 mt-10 text-center bg-white rounded-lg shadow-xl p-10">
        <h2 className="text-4xl font-semibold text-gray-800 mb-4">
          Welcome to Our Book Haven
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          Discover a world of literature where every book opens a new door to adventure, knowledge, and inspiration.
        </p>
      </section>

      {/* Motive Section */}
      <section className="w-11/12 lg:w-7/12 bg-white rounded-lg shadow-xl p-10 mt-8 mb-8">
        <h3 className="text-3xl font-semibold text-blue-600 mb-4">
          Our Purpose
        </h3>
        <p className="text-md text-gray-700 leading-relaxed mb-4">
          We strive to connect readers with the authors they love, fostering a community that celebrates the joy of reading.
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          With a diverse collection of books across genres, we cater to every reader's taste, ensuring that you find your next favorite read.
        </p>
      </section>

      {/* Inspirational Quote */}
      <section className="w-11/12 lg:w-7/12 bg-gradient-to-r from-blue-100 to-purple-200 rounded-lg shadow-md p-6 text-center my-6">
        <blockquote className="text-xl italic font-medium text-gray-600">
          "Books are a uniquely portable magic." - Stephen King
        </blockquote>
      </section>

      {/* Call to Action Section */}
      <section className="w-11/12 lg:w-7/12 bg-blue-800 text-white rounded-lg shadow-xl p-10 text-center mb-12">
        <h2 className="text-4xl font-semibold mb-4">
          Become Part of Our Community!
        </h2>
        <p className="text-md mb-6 leading-relaxed">
          Join us today to explore the wonders of literature, share your thoughts, and enjoy exclusive member benefits!
        </p>
        <button 
          onClick={() => navigate('/auth')}
          className="bg-white text-blue-800 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-200 transition transform hover:scale-105 duration-300"
        >
          Sign Up Now
        </button>
      </section>
    </div>
  );
};

export default AboutUs;