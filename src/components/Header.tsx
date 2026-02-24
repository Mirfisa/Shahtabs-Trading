import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/" className="text-2xl font-bold text-gray-800">
              <img src={`${import.meta.env.BASE_URL}favicon.png`} alt="Shahab's Trading Logo" className="h-10 w-auto" />
            </Link>
          </div>
          <div className="hidden md:flex items-center justify-center flex-1">
            <nav>
              <Link to="/" className="mx-2 text-sm text-gray-600 hover:text-gray-700 font-semibold transition duration-700 hover:scale-115 hover:shadow-lg hover:font-bold">
                Home
              </Link>
              <Link to="/about" className="mx-2 text-sm text-gray-600 hover:text-gray-700 font-semibold transition duration-700 hover:scale-115 hover:shadow-lg hover:font-bold">
                About Us
              </Link>

              <Link to="/cars" className="mx-2 text-sm text-gray-600 hover:text-gray-700 font-semibold transition duration-700 hover:scale-115 hover:shadow-lg hover:font-bold">
                Stock List
              </Link>


            </nav>
          </div>
          <div className="hidden md:flex items-center space-x-4">

            <Link
              to="/contact"
              className="px-4 py-2 text-sm font-medium text-white bg-[#fe9900] rounded-md hover:bg-[#ec6f3d]"
            >
              Contact us
            </Link>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-700 focus:outline-none">
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
            <Link to="/" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
              Home
            </Link>
            <Link to="/about" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
              About Us
            </Link>

            <Link to="/cars" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
              StockList
            </Link>



            <div className="mt-4">
              <Link
                to="/contact"
                className="block px-4 py-1.5 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-[#d68100] text-center"
              >
                CONTACT US
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
