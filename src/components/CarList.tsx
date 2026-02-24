import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Link } from 'react-router-dom';
import FilterSidebar from './FilterSidebar';
import CarCardImage from './CarCardImage';
import { processDriveUrl, parseImageField } from '../utils/imageParser';

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
  'Thumbnail Pic': string;
  name: string;
  grade: string;
  model: string;
  year: string;
  engine: string;
  pictures: string;
}

const CarList: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = sessionStorage.getItem('carListCurrentPage');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [itemsPerPage] = useState(9);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState(() => {
    const saved = sessionStorage.getItem('carListFilters');
    return saved ? JSON.parse(saved) : {
      model: '',
      year: '',
      engine: '',
      grade: '',
    };
  });
  const [grades, setGrades] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [engines, setEngines] = useState<string[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        // New spreadsheet URL as per request
        const response = await fetch('https://docs.google.com/spreadsheets/d/1ewIpPg69jB4lXGKfdPuS2e0jPsVVEVyrsUARTlcYPmI/export?format=csv');
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
              const carModel = car['Model'] ? String(car['Model']).trim() : '';
              const carYear = car['Year'] ? String(car['Year']).trim() : '';
              const carEngine = car['Engine CC'] ? String(car['Engine CC']).trim() : '';
              const carImgURL = car['imgURL'];
              const thumbnailPic = car['Thumbnail Pic'];
              let driveImage = car['Drive Image'] || '';
              const carPrice = car['Price'] ?? car['Landing'] ?? '';
              let carPictures = 'https://via.placeholder.com/300x200?text=No+Image'; // Generic placeholder

              const allImages = car['All Images'] ? car['All Images'].trim() : '';

              // Priority 1: Use Thumbnail Pic from sheet
              if (thumbnailPic && thumbnailPic.trim() !== '') {
                carPictures = processDriveUrl(thumbnailPic.trim());
              }
              // Priority 2: Use All Images
              else if (allImages) {
                const validUrls = parseImageField(allImages);

                if (validUrls.length > 0) {
                  driveImage = validUrls.join('|');
                  carPictures = validUrls[0];
                }
              }
              // Priority 3: Use existing Drive Image (pipe-separated URLs) (Fallthrough)
              else if (driveImage) { // Check if driveImage exists content
                const validUrls = parseImageField(driveImage);
                if (validUrls.length > 0) {
                  carPictures = validUrls[0];
                }
              }
              // Priority 4: Use imgURL if no Drive Image
              else if (carImgURL) {
                if (carImgURL.startsWith('/')) {
                  carPictures = `${import.meta.env.BASE_URL}${carImgURL.startsWith('/') ? carImgURL.slice(1) : carImgURL}`;
                } else {
                  carPictures = carImgURL;
                }
              }
              return { ...car, name: carName, grade: carGrade, model: carModel, year: carYear, engine: carEngine, pictures: carPictures, Price: carPrice, 'Drive Image': driveImage, 'Thumbnail Pic': thumbnailPic };
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

            // Sort logic: Available/Unsold cars first
            uniqueCars.sort((a: any, b: any) => {
              const statusA = (a.Status || '').toLowerCase();
              const statusB = (b.Status || '').toLowerCase();

              const isAvailableA = statusA !== 'sold' && statusA !== '';
              const isAvailableB = statusB !== 'sold' && statusB !== '';

              if (isAvailableA && !isAvailableB) return -1;
              if (!isAvailableA && isAvailableB) return 1;
              return 0;
            });

            console.log("Processed cars (unique):", uniqueCars);
            setCars(uniqueCars as Car[]);
            setGrades([...new Set(uniqueCars.map((car: any) => car.grade).filter(Boolean))].sort());
            setModels([...new Set(uniqueCars.map((car: any) => car.model).filter(Boolean))].sort());
            setYears([...new Set(uniqueCars.map((car: any) => car.year).filter(Boolean))].sort());
            setEngines([...new Set(uniqueCars.map((car: any) => car.engine).filter(Boolean))].sort());
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

  const [activeFilters, setActiveFilters] = useState(() => {
    const saved = sessionStorage.getItem('carListActiveFilters');
    return saved ? JSON.parse(saved) : {
      model: '',
      year: '',
      engine: '',
      grade: '',
    };
  });

  useEffect(() => {
    sessionStorage.setItem('carListCurrentPage', currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    sessionStorage.setItem('carListFilters', JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    sessionStorage.setItem('carListActiveFilters', JSON.stringify(activeFilters));
  }, [activeFilters]);

  const handleFilterChange = (newFilters: any) => {
    console.log('newFilters:', newFilters);
    setFilters(newFilters);
  };

  const handleFilterSubmit = () => {
    setActiveFilters(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      model: '',
      year: '',
      engine: '',
      grade: '',
    };
    setFilters(clearedFilters);
    setActiveFilters(clearedFilters);
  };

  const filteredCars = cars.filter((car) => {
    const { model, year, engine, grade } = activeFilters;
    return (
      (model ? car.model === model : true) &&
      (year ? car.year === year : true) &&
      (engine ? car.engine === engine : true) &&
      (grade ? car.grade === grade : true)
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
              models={models}
              years={years}
              engines={engines}
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
                <Link
                  to={`/car/${car['S.N.']}`}
                  key={index}
                  state={{ car, allCars: filteredCars, carIndex: filteredCars.findIndex(c => c['S.N.'] === car['S.N.']) }}
                >
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
                        {/* Price removed as per request */}
                        {/* <div className="text-sm md:text-base font-bold text-gray-800 mt-2">৳{car.Price || 'N/A'}</div> */}
                        <div className="flex justify-between items-center text-xs md:text-sm text-gray-700 mt-1 space-x-2">
                          <span>{car.year || 'N/A'} {car.model || 'N/A'}</span>
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] md:text-xs uppercase flex-shrink-0 ${(car.Status || '').toLowerCase() === 'sold'
                            ? 'bg-red-500 text-white'
                            : 'bg-green-500 text-white'
                            }`}>
                            {car.Status || 'Available'}
                          </span>
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
