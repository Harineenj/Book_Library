import React from 'react';

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-yellow-300 via-orange-200 to-yellow-100 p-4 font-sans">
      <h1 className="text-5xl font-bold text-gray-800 text-center mb-8 mt-12">About Us</h1>
      
      <p className="text-lg text-gray-800 max-w-2xl text-center mb-6 leading-relaxed">
        Welcome to <span className="font-semibold text-yellow-800">Book Library</span>, your ultimate destination for discovering and exploring a diverse collection of books. Our mission is to foster a love for reading by providing a platform where readers can find their next great read, share their thoughts, and connect with fellow book enthusiasts.
      </p>
      <p className="text-lg text-gray-800 max-w-2xl text-center mb-8 leading-relaxed">
        At Book Library, we believe that books have the power to transform lives. Whether you're a casual reader or a passionate bibliophile, we aim to create an inclusive community where everyone can share their reading experiences and recommendations.
      </p>

      <h2 className="text-3xl font-semibold text-gray-900 text-center mb-6">Our Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl text-center">
          <h3 className="text-xl font-bold mb-2 text-yellow-700">Harinee</h3>
          <p className="text-gray-600 mb-2">Backend Developer</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl text-center">
          <h3 className="text-xl font-bold mb-2 text-yellow-700">Harshitha</h3>
          <p className="text-gray-600 mb-2">Database Query Managing Person</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl text-center">
          <h3 className="text-xl font-bold mb-2 text-yellow-700">Hariprasanth</h3>
          <p className="text-gray-600 mb-2">Frontend Developer</p>
        </div>
      </div>

      {/* Highlighted Contact Details Section */}
      <section className="mt-12 text-center w-full max-w-lg bg-white p-6 rounded-lg shadow-md  transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">Contact Us</h2>
        <p className="text-lg text-gray-800 mb-4">We'd love to hear from you!</p>
        
        <div className="flex flex-col gap-2 text-gray-700 ">
          <p>Email: <a href="mailto:info@booklibrary.com" className="text-yellow-800 hover:underline">harineenj.22cse@kongu.edu</a></p>
          <p>Phone: <span className="text-yellow-800">9992324441</span></p>
          <p>WhatsApp: <a href="https://wa.me/1234567890" className="text-yellow-800 hover:underline">8974325718</a></p>
        </div>
      </section>
    </div>
  );
};

export default About;