import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardService } from '@/lib/api/dashboardService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const TransactionsByStatusChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    dashboardService.getTransactionsByStatus().then(setData);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-500 mb-4">Transactions By Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            nameKey="status"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionsByStatusChart;
