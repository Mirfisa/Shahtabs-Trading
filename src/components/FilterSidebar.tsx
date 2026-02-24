import React from 'react';

interface FilterSidebarProps {
  filters: {
    model: string;
    year: string;
    engine: string;
    grade: string;
  };
  onFilterChange: (filters: any) => void;
  onFilterSubmit: () => void;
  onClearFilters: () => void;
  grades: string[];
  models: string[];
  years: string[];
  engines: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onFilterSubmit,
  onClearFilters,
  grades,
  models,
  years,
  engines,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Filters</h2>

      {/* Model Filter */}
      <div className="mb-6">
        <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
        <select
          name="model"
          id="model"
          value={filters.model}
          onChange={handleInputChange}
          className="mt-1 block w-full px-2 py-1 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        >
          <option value="">All Models</option>
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      {/* Year Filter */}
      <div className="mb-6">
        <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
        <select
          name="year"
          id="year"
          value={filters.year}
          onChange={handleInputChange}
          className="mt-1 block w-full px-2 py-1 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Grade Filter */}
      <div className="mb-6">
        <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Grade</label>
        <select
          name="grade"
          id="grade"
          value={filters.grade}
          onChange={handleInputChange}
          className="mt-1 block w-full px-2 py-1 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        >
          <option value="">All Grades</option>
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
      </div>

      {/* Engine CC Filter */}
      <div className="mb-6">
        <label htmlFor="engine" className="block text-sm font-medium text-gray-700">Engine CC</label>
        <select
          name="engine"
          id="engine"
          value={filters.engine}
          onChange={handleInputChange}
          className="mt-1 block w-full px-2 py-1 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        >
          <option value="">All Engine CC</option>
          {engines.map((engine) => (
            <option key={engine} value={engine}>
              {engine}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col space-y-2">
        <button
          onClick={onFilterSubmit}
          className="w-full bg-orange-500 text-white py-1.5 rounded-md hover:bg-orange-600 transition duration-300 text-sm"
        >
          Filter
        </button>
        <button
          onClick={onClearFilters}
          className="w-full bg-gray-300 text-gray-700 py-1.5 rounded-md hover:bg-gray-400 transition duration-300 text-sm"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
