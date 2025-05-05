// Layout.jsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-800 text-gray-100 font-sans">
      <Header />
      <main className="flex-1 w-full">
        <div className="mx-auto min-h-screen">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;