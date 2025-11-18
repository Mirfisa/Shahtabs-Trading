import React from 'react';
import { useLocation } from 'react-router-dom';

const CarDetails: React.FC = () => {
  const location = useLocation();
  const { car } = location.state;

  return (
    <div className="bg-gray-100 py-6 md:py-12">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img src={car.pictures} alt={car.name} className="w-full h-64 md:h-96 object-cover" />
          <div className="p-4 md:p-6">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800">{car.name}</h1>
            <div className="text-xl md:text-2xl font-bold text-gray-800 mt-2">৳{car.Price}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-base md:text-lg text-gray-700">
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
