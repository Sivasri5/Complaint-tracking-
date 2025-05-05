import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 shadow-lg border-b border-teal-500/20">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-teal-400 hover:text-teal-300 transition-colors duration-200">
            Complaint Portal
          </h1>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden text-teal-400 hover:text-teal-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8 text-gray-300 text-lg">
            <Link to="/" className="hover:text-teal-400 transition-colors duration-200 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/complaints" className="hover:text-teal-400 transition-colors duration-200 relative group">
              All Complaints
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/contact" className="hover:text-teal-400 transition-colors duration-200 relative group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-4 pb-4 border-t border-gray-700 pt-4">
            <Link to="/" className="block text-gray-300 hover:text-teal-400 transition-colors duration-200 py-2">Home</Link>
            <Link to="/complaints" className="block text-gray-300 hover:text-teal-400 transition-colors duration-200 py-2">All Complaints</Link>
            <Link to="/contact" className="block text-gray-300 hover:text-teal-400 transition-colors duration-200 py-2">Contact</Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;