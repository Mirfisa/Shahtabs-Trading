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
    <div className="bg-gray-100 dark:bg-gray-800 py-8">
      <div className="px-4">
        <div className="flex flex-wrap justify-center items-center">
          {brands.map((brand, index) => (
            <div key={index} className="p-4">
              <img
                src={`/brands/${brand}`}
                alt={brand.split('.')[0]}
                className="h-20 filter grayscale hover:grayscale-0 transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandLogos;