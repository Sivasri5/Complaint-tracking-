// Home.jsx
import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-teal-400 mb-2">
        Welcome to the Complaint Portal
      </h1>
      <div className="w-24 h-1 bg-purple-500 mx-auto mb-6 rounded-full"></div>
      <p className="mt-6 text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl leading-relaxed">
        Submit your complaints and track them easily. We're here to help you resolve your issues efficiently and effectively.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <button className="bg-teal-500 text-gray-900 px-6 py-3 rounded-lg font-semibold 
          hover:bg-teal-400 transition-all duration-300 shadow-lg shadow-teal-500/30">
          Submit Complaint
        </button>
        <button className="border-2 border-purple-500 text-purple-400 px-6 py-3 rounded-lg font-semibold 
          hover:bg-purple-500 hover:text-gray-900 transition-all duration-300 shadow-lg shadow-purple-500/20">
          Track Complaint
        </button>
      </div>
    </div>
  );
};

export default Home;