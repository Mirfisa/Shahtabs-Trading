import React from 'react';

interface FilterSidebarProps {
  filters: {
    grade: string;
    minPrice: string;
    maxPrice: string;
    modelYear: string;
  };
  onFilterChange: (filters: any) => void;
  onFilterSubmit: () => void;
  onClearFilters: () => void;
  grades: string[];
  modelYears: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onFilterSubmit,
  onClearFilters,
  grades,
  modelYears,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Filters</h2>

      {/* Grade Filter */}
      <div className="mb-6">
        <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Grade</label>
        <select
          name="grade"
          id="grade"
          value={filters.grade}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">All Grades</option>
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Price Range</label>
        <div className="flex space-x-2">
          <input
            type="number"
            name="minPrice"
            id="minPrice"
            value={filters.minPrice}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Min Price"
            min="0"
          />
          <input
            type="number"
            name="maxPrice"
            id="maxPrice"
            value={filters.maxPrice}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Max Price"
            max="999999999"
          />
        </div>
      </div>

      {/* Model Year Filter */}
      <div className="mb-6">
        <label htmlFor="modelYear" className="block text-sm font-medium text-gray-700">Model Year</label>
        <select
          name="modelYear"
          id="modelYear"
          value={filters.modelYear}
          onChange={handleInputChange}
          className="mt-1 block w-full px-3 py-2 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">All Years</option>
          {modelYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col space-y-2">
        <button
          onClick={onFilterSubmit}
          className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-300"
        >
          Filter
        </button>
        <button
          onClick={onClearFilters}
          className="w-full bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition duration-300"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
