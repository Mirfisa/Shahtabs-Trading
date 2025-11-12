import React, { useState } from 'react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-dark-bg shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <a href="/" className="text-2xl font-bold text-gray-800 dark:text-white">
              <img src="./favicon.png" alt="Shahab's Trading Logo" className="h-12 w-auto"/>
            </a>
          </div>
          <div className="hidden md:flex items-center justify-center flex-1">
            <nav>
              <a href="/" className="mx-4 text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white">
                Home
              </a>
              <a href="/" className="mx-4 text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white">
                About Us
              </a>
              <a href="/" className="mx-4 text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white">
                Pre-Order
              </a>
              <a href="/" className="mx-4 text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white">
                Cars
              </a>
              <a href="/" className="mx-4 text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white">
                Car Loan
              </a>
              <a href="/" className="mx-4 text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white">
                Contact
              </a>
            </nav>
          </div>
          <div className="hidden md:flex items-center">
            <a
              href="/"
              className="px-8 py-3 text-lg font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
            >
              Get Started
            </a>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden mt-4">
            <a href="/" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-bg">
              Home
            </a>
            <a href="/" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-bg">
              About Us
            </a>
            <a href="/" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-bg">
              Pre-Order
            </a>
            <a href="/" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-bg">
              Cars
            </a>
            <a href="/" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-bg">
              Car Loan
            </a>
            <a href="/" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-bg">
              Contact
            </a>
            <div className="mt-4">
              <a
                href="/"
                className="block px-8 py-3 text-lg font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 text-center"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
