import React from 'react';

const Hero = () => {
  return (
    <div className="bg-white dark:bg-gray-800">
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white md:text-6xl">
          GET YOUR DREAM CAR FROM JAPAN!
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Pre-order | Ready Stock | Wholesale | Retail
        </p>
        <div className="mt-8">
          <a
            href="/"
            className="px-8 py-3 text-lg font-medium text-white bg-[#F0BC99] rounded-md hover:bg-[#E6A16F] dark:bg-[#1E3A8A] dark:hover:bg-[#1C2B4D]"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
