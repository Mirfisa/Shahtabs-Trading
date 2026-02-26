import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-center md:text-left text-gray-500 text-sm">
          &copy; 2026 Shahtabs Trading. All rights reserved.
          <br />
          Developed by <a href="https://vlct.net/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800 transition-colors">Velocity</a>
        </p>
        <a
          href="https://www.facebook.com/shahtabstrading"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white hover:bg-blue-800 rounded-full transition-colors font-semibold text-sm shadow-sm"
        >
          <span>Connect with us on</span>
          <img src={`${import.meta.env.BASE_URL}icons/fb.png`} alt="Facebook" className="w-6 h-6 object-contain" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
