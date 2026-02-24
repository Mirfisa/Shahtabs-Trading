import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ImageGallery from './ImageGallery';
import { parseImageField } from '../utils/imageParser';

const CarDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { car, allCars, carIndex } = location.state || {};

  const hasList = Array.isArray(allCars) && allCars.length > 0;
  const prevCar = hasList && carIndex > 0 ? allCars[carIndex - 1] : null;
  const nextCar = hasList && carIndex < allCars.length - 1 ? allCars[carIndex + 1] : null;

  const handleBack = () => navigate(-1);

  const handleNavigateCar = (targetCar: any, newIndex: number) => {
    navigate(`/car/${targetCar['S.N.']}`, {
      state: { car: targetCar, allCars, carIndex: newIndex }
    });
  };

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

    // Prepend the main picture (thumbnail) if it exists, ensuring it's shown first
    if (car.pictures && car.pictures.startsWith('http')) {
      const filteredUrls = uniqueUrls.filter(url => url !== car.pictures);
      return [car.pictures, ...filteredUrls];
    }

    return uniqueUrls;
  };

  const images = parseImages();

  const handleContactUs = () => {
    const rawPhoneNumber = "+88 01947494174";

    const formatPhoneNumber = (num: string) => {
      return num.replace(/[\s\-+]/g, '');
    };

    const formattedNumber = formatPhoneNumber(rawPhoneNumber);
    const carName = car?.name || 'this car';
    const chassisNumber = car?.['Chasis Number'] || 'N/A';

    const message = `Hello I'd like to know more about ${carName}, Chassis number: ${chassisNumber}.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-gray-100 py-6 md:py-12">
      <div className="container mx-auto px-4">

        {/* Back Button - Top */}
        <div className="mb-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition"
          >
            ← Back
          </button>
        </div>

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
                  <span className="font-bold w-1/3">Year:</span>
                  <span className="w-2/3">{car['Year'] || car.year || 'N/A'}</span>
                </div>
                <div className="flex border-b border-gray-300 pb-2">
                  <span className="font-bold w-1/3">Model:</span>
                  <span className="w-2/3">{car['Model'] || car.model || 'N/A'}</span>
                </div>
                <div className="flex border-b border-gray-300 pb-2">
                  <span className="font-bold w-1/3">Grade:</span>
                  <span className="w-2/3">{car.grade || car['Grade'] || 'N/A'}</span>
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
                  <span className="font-bold w-1/3">Engine CC:</span>
                  <span className="w-2/3">{car['Engine CC'] || car.engine || 'N/A'}</span>
                </div>



                <div className="mt-4">
                  <span className="font-bold block mb-1">Details:</span>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {car.Details || 'No additional details available.'}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleContactUs}
                  className="w-full bg-[#fe9900] text-white font-bold py-3 rounded-md hover:bg-[#ec6f3d] transition duration-300 uppercase"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Prev/Next Buttons - Bottom */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => prevCar && handleNavigateCar(prevCar, carIndex - 1)}
            disabled={!prevCar}
            className="px-5 py-2 text-sm rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            ← Prev Car
          </button>
          <button
            onClick={() => nextCar && handleNavigateCar(nextCar, carIndex + 1)}
            disabled={!nextCar}
            className="px-5 py-2 text-sm rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            Next Car →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
