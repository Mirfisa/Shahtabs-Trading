import React from 'react';
import './BrandLogos.css'; // Import the new CSS file

const brands = [
  'Honda.png',
  'Lexus.png',
  'Mazda.png',
  'Mitsubishi.png',
  'Nissan.png',
  'Subaru.png',
  'Suzuki.png',
  'Toyota.png'
];

const BrandLogos: React.FC = () => {
  const duplicatedBrands = [...brands, ...brands]; // Duplicate the brands

  return (
    <div className="bg-white py-8 my-8 shadow-md">
      <div className="scrolling-wrapper">
        <div className="scrolling-inner">
          {duplicatedBrands.map((brand, index) => (
            <div key={index} className="flex-shrink-0">
              <img
                src={`${process.env.PUBLIC_URL}/brands/${brand}`}
                alt={brand.split('.')[0]}
                className="h-16 md:h-32 transition duration-300 hover:scale-105 mx-4 md:mx-8" // Added responsive spacing
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandLogos;