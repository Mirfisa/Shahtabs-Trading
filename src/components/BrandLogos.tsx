import React from 'react';

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
  return (
    <div className="bg-white dark:bg-dark-bg py-8 my-8 shadow-md">
      <div className="px-4">
        <div className="flex flex-wrap justify-evenly items-center">
          {brands.map((brand, index) => (
            <div key={index}>
              <img
                src={`/brands/${brand}`}
                alt={brand.split('.')[0]}
                className="h-32 filter grayscale dark:filter-none dark:invert dark:contrast-200 hover:grayscale-0 transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandLogos;