import React, { useState, useEffect } from 'react';
import { dashboardService } from '@/lib/api/dashboardService';
import { routeService } from '@/lib/api/routeService';

const TopRoutes = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const topRoutes = await dashboardService.getTopRoutes();
      const routesWithNames = await Promise.all(
        topRoutes.map(async (route) => {
          const routeDetails = await routeService.getRouteById(route.routeId);
          return { ...route, name: routeDetails.name };
        })
      );
      setData(routesWithNames);
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-500 mb-4">Top Routes by Revenue</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Route Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((route) => (
            <tr key={route.routeId}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{route.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{route.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopRoutes;
