import React, { useState, useEffect } from 'react';
import { dashboardService } from '@/lib/api/dashboardService';
import { conductorService } from '@/lib/api/conductorService';

const TopConductors = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const topConductors = await dashboardService.getTopConductors();
      const conductorsWithNames = await Promise.all(
        topConductors.map(async (conductor) => {
          const conductorDetails = await conductorService.getConductorById(conductor.conductorId);
          return { ...conductor, name: `${conductorDetails.firstName} ${conductorDetails.lastName}` };
        })
      );
      setData(conductorsWithNames);
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-500 mb-4">Top Conductors by Revenue</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Conductor Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((conductor) => (
            <tr key={conductor.conductorId}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{conductor.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{conductor.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopConductors;
