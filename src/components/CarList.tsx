import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Link } from 'react-router-dom';
import FilterSidebar from './FilterSidebar';
import CarCardImage from './CarCardImage';

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
        const csv = await response.text();
        console.log("Raw CSV length:", csv.length);

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
              const driveImage = car['Drive Image'] || '';
              const carPrice = car['Price'] ?? car['Landing'] ?? '';
              let carPictures = 'https://via.placeholder.com/300x200?text=No+Image'; // Generic placeholder

              // Priority 1: Use first image from Drive Image (pipe-separated URLs)
              if (driveImage && driveImage.includes('thumbnail')) {
                const urls = driveImage.split('|').map((url: string) => url.trim());
                const validUrls = urls.filter((url: string) => url.startsWith('http'));
                if (validUrls.length > 0) {
                  carPictures = validUrls[0];
                }
              }
              // Priority 2: Use imgURL if no Drive Image
              else if (carImgURL) {
                if (carImgURL.startsWith('/')) {
                  carPictures = `${carImgURL}`;
                } else {
                  carPictures = carImgURL;
                }
              }
              return { ...car, name: carName, grade: carGrade, model_year: carModelYear, pictures: carPictures, Price: carPrice };
            });

            // Deduplication logic
            const uniqueCarsMap = new Map();
            processedCars.forEach((car: any) => {
              // Filter out items with missing S.N.
              if (car['S.N.'] && car['S.N.'].trim() !== '' && !uniqueCarsMap.has(car['S.N.'])) {
                uniqueCarsMap.set(car['S.N.'], car);
              }
            });
            const uniqueCars = Array.from(uniqueCarsMap.values());

            console.log("Processed cars (unique):", uniqueCars);
            setCars(uniqueCars as Car[]);
            setGrades([...new Set(uniqueCars.map((car: any) => car.grade))].sort());
            setModelYears([...new Set(uniqueCars.map((car: any) => car.model_year))].sort());
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
              <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800">Our Cars</h1>
              <button
                className="lg:hidden bg-orange-500 text-white px-4 py-2 rounded-md"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {currentItems.map((car, index) => (
                <Link to={`/car/${car['S.N.']}`} key={index} state={{ car }}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full">
                    <CarCardImage
                      driveImages={car['Drive Image'] || ''}
                      fallbackImage={car.pictures}
                      altText={car.name}
                    />
                    <div className="p-2 md:p-3 flex flex-col flex-grow">
                      <div>
                        <h2 className="text-sm md:text-base font-bold text-gray-800 line-clamp-2">{car.name || 'N/A'}</h2>
                      </div>
                      <div className="mt-auto">
                        <div className="text-sm md:text-base font-bold text-gray-800 mt-2">৳{car.Price || 'N/A'}</div>
                        <div className="flex justify-between text-xs md:text-sm text-gray-700 mt-1">
                          <span>{car.model_year || 'N/A'}</span>
                          <span>Grade {car.grade || 'N/A'}</span>
                        </div>
                        <button className="mt-2 w-full bg-[#fe9900] text-white py-1 rounded-md hover:bg-[#ec6f3d] transition duration-300 text-xs md:text-sm">
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
                className="px-2 py-1 md:px-3 md:py-1.5 mx-1 bg-orange-500 text-white rounded-md disabled:bg-gray-300 text-sm"
              >
                Previous
              </button>
              <span className="px-2 py-1 md:px-3 md:py-1.5 mx-1 text-gray-700 text-sm">
                Page {currentPage} of {Math.ceil(filteredCars.length / itemsPerPage)}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={indexOfLastItem >= filteredCars.length}
                className="px-2 py-1 md:px-3 md:py-1.5 mx-1 bg-orange-500 text-white rounded-md disabled:bg-gray-300 text-sm"
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
