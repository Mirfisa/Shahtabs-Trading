import React from 'react';
import { useLocation } from 'react-router-dom';

const DataPage: React.FC = () => {
  const location = useLocation();
  const { cars } = location.state as { cars: any[] };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Processed Car Data</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              {cars.length > 0 &&
                Object.keys(cars[0]).map((key) => (
                  <th key={key} className="py-2 px-4 border-b">
                    {key}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {Object.values(car).map((value: any, i) => (
                  <td key={i} className="py-2 px-4 border-b">
                    {typeof value === 'object' ? JSON.stringify(value) : value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataPage;
