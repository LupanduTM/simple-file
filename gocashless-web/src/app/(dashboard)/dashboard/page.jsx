"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import KpiCard from "@/components/dashboard/KpiCard";
import TransactionsOverTimeChart from "@/components/dashboard/TransactionsOverTimeChart";
import TransactionsByStatusChart from "@/components/dashboard/TransactionsByStatusChart";
import TransactionsByTypeChart from "@/components/dashboard/TransactionsByTypeChart";
import TopRoutes from "@/components/dashboard/TopRoutes";
import { dashboardService } from "@/lib/api/dashboardService";

const DashboardPage = () => {
  const [kpis, setKpis] = useState({ totalRevenue: 0, totalTransactions: 0 });

  useEffect(() => {
    dashboardService.getKpis().then(setKpis);
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KpiCard title="Total Revenue" value={`ZMW ${kpis.totalRevenue?.toLocaleString()}`} />
        <KpiCard title="Total Transactions" value={kpis.totalTransactions?.toLocaleString()} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionsOverTimeChart />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TransactionsByStatusChart />
            <TransactionsByTypeChart />
        </div>
        <TopRoutes />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
