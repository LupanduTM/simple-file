"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { transactionService } from "@/lib/api/transactionService";

const ConductorTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchTransactions = async () => {
        try {
          setIsLoading(true);
          const data = await transactionService.getTransactionsByConductorId(id);
          setTransactions(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchTransactions();
    }
  }, [id]);

  if (isLoading) {
    return <DashboardLayout><div>Loading...</div></DashboardLayout>;
  }

  if (error) {
    return <DashboardLayout><div>Error: {error}</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Transactions for Conductor</h1>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.routeName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.amount} {transaction.currency}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(transaction.transactionTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default ConductorTransactionsPage;
