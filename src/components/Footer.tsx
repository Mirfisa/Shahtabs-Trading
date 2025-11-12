import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-dark-bg">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-center md:text-left text-gray-600 dark:text-gray-300">
              &copy; 2025 Your Company. All rights reserved.
            </p>
          </div>
          <div className="flex items-center">
            <a href="/" className="mx-4 text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white">
              Privacy Policy
            </a>
            <a href="/" className="mx-4 text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
