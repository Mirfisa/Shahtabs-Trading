import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Carousel from './components/Carousel';
import BrandLogos from './components/BrandLogos';
import Features from './components/Features';
import Footer from './components/Footer';
import TopBar from './components/TopBar'; // Import TopBar
import { Slide } from './types';

const slides: Slide[] = [
  {
    id: 1,
    image: "/cars/car1.jpg",
    alt: "Modern Cars"
  },
  {
    id: 2,
    image: "/cars/car2.jpg",
    alt: "Easy Financing"
  },
  {
    id: 3,
    image: "/cars/car3.jpg",
    alt: "Pre-Order Now"
  }
];

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex-grow bg-light-bg dark:bg-main-dark-bg">
        <TopBar /> {/* Render TopBar here */}
        <Header />
        <main>
          <Carousel slides={slides} />
          <BrandLogos />
          <Features />
        </main>
      </div>
      <Footer />
      <div className="fixed bottom-4 right-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 text-white bg-gray-800 rounded-full dark:bg-white dark:text-gray-800"
        >
          {darkMode ? 'Light' : 'Dark'}
        </button>
      </div>
    </div>
  );
}

export default App;