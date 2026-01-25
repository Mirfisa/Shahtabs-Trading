import React from 'react';
import { useLocation } from 'react-router-dom';

const DataPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as { cars: any[] } | null;
  // Fetch data if state is missing
  const [data, setData] = React.useState<any[]>(state?.cars || []);
  const [loading, setLoading] = React.useState(!state?.cars);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!state?.cars) {
      const fetchData = async () => {
        try {
          // Import Papa dynamically to avoid adding it as a top-level import if not needed elsewhere
          // or assume it's available. Since it's used in CarList, it should be installed.
          const Papa = await import('papaparse');

          const response = await fetch('https://docs.google.com/spreadsheets/d/1uqwgVOtPtRQErRoRM8D5659b0_4mVZ8eI3hiwzGgYlU/export?format=csv');
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const csv = await response.text();

          Papa.parse(csv, {
            header: true,
            complete: (results: any) => {
              // Basic processing to replicate CarList logic if needed, or just show raw data
              // CarList does specific deduplication and field mapping. 
              // For "View All Data", showing raw or slightly processed is likely fine.
              // Let's at least filter out empty rows like CarList does.
              const processed = results.data.filter((car: any) => car['S.N.'] && car['S.N.'].trim() !== '');
              setData(processed);
              setLoading(false);
            },
            error: (err: any) => {
              throw new Error(err.message);
            }
          });
        } catch (err: any) {
          setError(err.message || 'Failed to load data');
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [state]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold text-gray-700">Loading Data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">Error loading data</h1>
        <p className="mt-4 text-gray-700">{error}</p>
      </div>
    );
  }

  const cars = data;

  if (!cars.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-700">No data found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-4">Processed Car Data</h1>
      <div className="overflow-auto h-[calc(100vh-200px)] border border-gray-200 rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-1 px-2 border-b sticky top-0 bg-gray-100 z-40">#</th>
              {cars.length > 0 &&
                Object.keys(cars[0]).map((key) => (
                  <th key={key} className="py-1 px-2 border-b sticky top-0 bg-gray-100 z-40">
                    {key}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-1 px-2 border-b">{index + 1}</td>
                {Object.values(car).map((value: any, i) => (
                  <td key={i} className="py-1 px-2 border-b">
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
