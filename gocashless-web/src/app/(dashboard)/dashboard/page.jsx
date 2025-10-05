"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Welcome to the Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-2">Key Metric 1</h2>
          <p className="text-3xl font-bold text-indigo-600">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-2">Key Metric 2</h2>
          <p className="text-3xl font-bold text-indigo-600">5,678</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-2">Key Metric 3</h2>
          <p className="text-3xl font-bold text-indigo-600">9,101</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
