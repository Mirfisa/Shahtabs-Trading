import React from 'react';
import { useLocation } from 'react-router-dom';
import ImageGallery from './ImageGallery';
import { parseImageField } from '../utils/imageParser';

const CarDetails: React.FC = () => {
  const location = useLocation();
  const { car } = location.state;

  const parseImages = (): string[] => {
    const allImagesField = car['All Images'] || '';
    const driveImageField = car['Drive Image'] || '';

    // Process 'All Images'
    const allImageUrls = parseImageField(allImagesField);

    // Process 'Drive Image'
    const driveImageUrls = parseImageField(driveImageField);

    // Combine and deduplicate
    const combinedUrls = [...allImageUrls, ...driveImageUrls];
    const uniqueUrls = [...new Set(combinedUrls)];

    if (uniqueUrls.length > 0) {
      return uniqueUrls;
    }

    // Otherwise fall back to the main picture
    if (car.pictures && car.pictures.startsWith('http')) {
      return [car.pictures];
    }

    return [];
  };

  const images = parseImages();

  return (
    <div className="bg-gray-100 py-6 md:py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col lg:flex-row">
          {/* Left Side - Image Gallery (70%) */}
          <div className="w-full lg:w-[70%] bg-black">
            <ImageGallery images={images} altText={car.name} />
          </div>

          {/* Right Side - Details (30%) */}
          <div className="w-full lg:w-[30%] p-6 flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{car.name}</h1>
            {/* <div className="text-2xl font-bold text-gray-800 mt-2">৳{car.Price}</div> */}

            <div className="flex-grow">
              <div className="grid grid-cols-1 gap-y-4 text-sm md:text-base text-gray-800">
                <div className="flex border-b border-gray-300 pb-2">
                  <span className="font-bold w-1/3">Status:</span>
                  <span className={`w-2/3 px-2 py-1 rounded font-bold inline-block text-center ${(car.Status || '').toLowerCase() === 'sold'
                    ? 'bg-red-500 text-white'
                    : 'bg-green-500 text-white'
                    }`}>
                    {car.Status || 'N/A'}
                  </span>
                </div>
                <div className="flex border-b border-gray-300 pb-2">
                  <span className="font-bold w-1/3">Model:</span>
                  <span className="w-2/3">{car.model_year || 'N/A'}</span>
                </div>
                <div className="flex border-b border-gray-300 pb-2">
                  <span className="font-bold w-1/3">Grade:</span>
                  <span className="w-2/3">{car.grade || 'N/A'}</span>
                </div>
                <div className="flex border-b border-gray-300 pb-2">
                  <span className="font-bold w-1/3">Chassis:</span>
                  <span className="w-2/3">{car['Chasis Number'] || 'N/A'}</span>
                </div>
                <div className="flex border-b border-gray-300 pb-2">
                  <span className="font-bold w-1/3">Color:</span>
                  <span className="w-2/3">{car.Colour || 'N/A'}</span>
                </div>
                <div className="flex border-b border-gray-300 pb-2">
                  <span className="font-bold w-1/3">Mileage:</span>
                  <span className="w-2/3">{car.Mileage || 'N/A'}</span>
                </div>
                <div className="flex border-b border-gray-300 pb-2">
                  <span className="font-bold w-1/3">Engine:</span>
                  <span className="w-2/3">{car.Engine || 'N/A'}</span>
                </div>
                <div className="flex border-b border-gray-300 pb-2">
                  <span className="font-bold w-1/3">Fuel:</span>
                  <span className="w-2/3">{car.Fuel || 'N/A'}</span>
                </div>
                <div className="flex border-b border-gray-300 pb-2">
                  <span className="font-bold w-1/3">Landing:</span>
                  <span className="w-2/3">{car.Landing || 'N/A'}</span>
                </div>
                <div className="flex border-b border-gray-300 pb-2">
                  <span className="font-bold w-1/3">Location:</span>
                  <span className="w-2/3">{car.Location || 'N/A'}</span>
                </div>

                <div className="mt-4">
                  <span className="font-bold block mb-1">Details:</span>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {car.Details || 'No additional details available.'}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <button className="w-full bg-[#fe9900] text-white font-bold py-3 rounded-md hover:bg-[#ec6f3d] transition duration-300 uppercase">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
