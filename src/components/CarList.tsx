import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Link } from 'react-router-dom';
import FilterSidebar from './FilterSidebar';

interface Car {
  'S.N.': string;
  'Car Name': string;
  'Model': string;
  'Chasis Number': string;
  'Colour': string;
  'Mileage': string;
  'Engine': string;
  'Grade': string;
  'Details': string;
  'Price': string;
  'Landing': string;
  'Location': string;
  'imgURL': string;
  'Picture': string;
  'Status': string;
  'Drive Image': string;
  name: string;
  grade: string;
  model_year: string;
  pictures: string;
}

const CarList: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    grade: '',
    minPrice: '',
    maxPrice: '',
    modelYear: '',
  });
  const [grades, setGrades] = useState<string[]>([]);
  const [modelYears, setModelYears] = useState<string[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('https://docs.google.com/spreadsheets/d/1uqwgVOtPtRQErRoRM8D5659b0_4mVZ8eI3hiwzGgYlU/export?format=csv');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const reader = response.body?.getReader();
        const result = await reader?.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result?.value);
        console.log("Raw CSV:", csv);

        Papa.parse(csv, {
          header: true,
          complete: (results) => {
            console.log("Parsed data length:", results.data.length);
            console.log("Parsed data:", results.data);
            const processedCars = results.data.map((car: any) => {
              const carName = car['Car Name'];
              const carGrade = car['Grade'] ? car['Grade'].trim() : '';
              const carModelYear = car['Model'];
              const carImgURL = car['imgURL'];
              const carPrice = car['Price'] ?? car['Landing'] ?? '';
              let carPictures = 'https://via.placeholder.com/300x200?text=No+Image'; // Generic placeholder

              if (carImgURL) {
                carPictures = carImgURL;
              }

              return { ...car, name: carName, grade: carGrade, model_year: carModelYear, pictures: carPictures, Price: carPrice };
            }).filter(Boolean);
            console.log("Processed cars:", processedCars);
            setCars(processedCars as Car[]);
            setGrades([...new Set(processedCars.map((car: any) => car.grade))].sort());
            setModelYears([...new Set(processedCars.map((car: any) => car.model_year))].sort());
            setLoading(false);
          },
          error: (error: any) => {
            throw new Error(error.message);
          }
        });
      } catch (error) {
        setError('Failed to fetch car data. Please try again later.');
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const [activeFilters, setActiveFilters] = useState({
    grade: '',
    minPrice: '',
    maxPrice: '',
    modelYear: '',
  });

  const handleFilterChange = (newFilters: any) => {
    console.log('newFilters:', newFilters);
    setFilters(newFilters);
  };

  const handleFilterSubmit = () => {
    setActiveFilters(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      grade: '',
      minPrice: '',
      maxPrice: '',
      modelYear: '',
    };
    setFilters(clearedFilters);
    setActiveFilters(clearedFilters);
  };

  const filteredCars = cars.filter((car) => {
    const { grade, minPrice, maxPrice, modelYear } = activeFilters;
    return (
      (grade ? car.grade === grade : true) &&
      (minPrice ? parseFloat(car.Price) >= parseFloat(minPrice) : true) &&
      (maxPrice ? parseFloat(car.Price) <= parseFloat(maxPrice) : true) &&
      (modelYear ? car.model_year === modelYear : true)
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCars.slice(indexOfFirstItem, indexOfLastItem);
  console.log("Current items:", currentItems);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold text-red-600">{error}</div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold text-gray-700">No cars available</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-6 md:py-12">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className={`lg:col-span-1 mt-4 lg:mt-16 ${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onFilterSubmit={handleFilterSubmit}
              onClearFilters={handleClearFilters}
              grades={grades}
              modelYears={modelYears}
            />
          </div>

          {/* Car Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl md:text-4xl font-bold text-center text-gray-800">Our Cars</h1>
              <button
                className="lg:hidden bg-orange-500 text-white px-4 py-2 rounded-md"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                Filters
              </button>
            </div>
            <div className="flex justify-end mb-4">
              <Link to="/data" state={{ cars: cars }}>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
                  View All Data
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {currentItems.map((car, index) => (
                <Link to={`/car/${car['S.N.']}`} key={index} state={{ car }}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:scale-105 hover:shadow-xl flex flex-col">
                    <img src={car.pictures} alt={car.name} className="w-full h-48 md:h-64 object-cover" />
                    <div className="p-4 md:p-6 flex flex-col justify-between h-auto md:h-64 overflow-hidden">
                      <div>
                        <h2 className="text-lg md:text-2xl font-bold text-gray-800">{car.name || 'N/A'}</h2>
                      </div>
                      <div>
                        <div className="text-lg md:text-xl font-bold text-gray-800 mt-2">৳{car.Price || 'N/A'}</div>
                        <div className="flex justify-between text-base md:text-lg text-gray-700 mt-1">
                          <span>{car.model_year || 'N/A'}</span>
                          <span>Grade {car.grade || 'N/A'}</span>
                        </div>
                        <button className="mt-4 w-full bg-[#fe9900] text-white py-2 rounded-md hover:bg-[#ec6f3d] transition duration-300">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 md:px-4 md:py-2 mx-1 bg-orange-500 text-white rounded-md disabled:bg-gray-300"
              >
                Previous
              </button>
              <span className="px-3 py-1 md:px-4 md:py-2 mx-1 text-gray-700">
                Page {currentPage} of {Math.ceil(filteredCars.length / itemsPerPage)}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={indexOfLastItem >= filteredCars.length}
                className="px-3 py-1 md:px-4 md:py-2 mx-1 bg-orange-500 text-white rounded-md disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarList;
