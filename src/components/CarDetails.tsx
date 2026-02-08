import React from 'react';
import { useLocation } from 'react-router-dom';
import ImageGallery from './ImageGallery';

const CarDetails: React.FC = () => {
  const location = useLocation();
  const { car } = location.state;

  // Parse images from the 'Drive Image' column (comma or pipe separated URLs)
  // Falls back to the main 'pictures' thumbnail if no gallery images
  const parseImages = (): string[] => {
    const driveImageField = car['Drive Image'] || '';

    // Check if it's a comma-separated or pipe-separated list of URLs
    let urls: string[] = [];

    if (driveImageField.includes('|')) {
      urls = driveImageField.split('|').map((url: string) => url.trim());
    } else if (driveImageField.includes(',') && driveImageField.includes('http')) {
      urls = driveImageField.split(',').map((url: string) => url.trim());
    }

    // Filter to only valid URLs
    urls = urls.filter((url: string) => url.startsWith('http'));

    // If we have valid URLs from Drive Image, use those
    if (urls.length > 0) {
      return urls;
    }

    // Otherwise fall back to the main picture
    if (car.pictures && car.pictures.startsWith('http')) {
      return [car.pictures];
    }

    return [];
  };

  const images = parseImages();

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ImageGallery images={images} altText={car.name} />
          <div className="p-6">
            <h1 className="text-4xl font-bold text-gray-800">{car.name}</h1>
            <div className="text-2xl font-bold text-gray-800 mt-2">৳{car.Price}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-lg text-gray-700">
              <div><span className="font-bold">Model:</span> {car.model_year}</div>
              <div><span className="font-bold">Grade:</span> {car.grade}</div>
              <div><span className="font-bold">Chassis Number:</span> {car['Chasis Number']}</div>
              <div><span className="font-bold">Color:</span> {car['Colour']}</div>
              <div><span className="font-bold">Mileage:</span> {car['Mileage']}</div>
              <div><span className="font-bold">Engine:</span> {car['Engine']}</div>
              <div><span className="font-bold">Details:</span> {car['Details']}</div>
              <div><span className="font-bold">Landing:</span> {car['Landing']}</div>
              <div><span className="font-bold">Location:</span> {car['Location']}</div>
              <div><span className="font-bold">Status:</span> {car['Status']}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
