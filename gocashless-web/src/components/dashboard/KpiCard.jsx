import React from 'react';

const KpiCard = ({ title, value, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-500">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      {children}
    </div>
  );
};

export default KpiCard;
