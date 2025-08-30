"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { QrCodeIcon } from "@/components/ui/Icons";


const DashboardPage = () => {
  // Example state for role-based view (replace with real auth logic)
  const [role, setRole] = useState("company"); // 'company' or 'admin'
  const [activeSection, setActiveSection] = useState("transactions");

  // Example data (replace with API calls)
  const transactions = [
    { id: 1, conductor: "John", amount: 100 },
    { id: 2, conductor: "Jane", amount: 150 },
  ];
  const conductors = [{ id: 1, name: "John Doe" }];
  const buses = [{ id: 1, plate: "ABC123" }];
  const users = [{ id: 1, name: "Admin User" }];

  return (
    <div className="min-h-screen flex font-sans bg-stone-100">
      {/* Sidebar Navigation */}
      <div className="hidden md:flex flex-col w-64 bg-white shadow-lg p-6 space-y-6">
        <div className="flex items-center space-x-2 mb-8">
          <QrCodeIcon className="h-8 w-8 text-gray-600" />
          <span className="text-2xl font-bold text-gray-600">GoCashless</span>
        </div>
        <nav className="space-y-2">
          <Button fullWidth variant={activeSection === "transactions" ? "primary" : "secondary"} onClick={() => setActiveSection("transactions")}>Transactions</Button>
          <Button fullWidth variant={activeSection === "conductors" ? "primary" : "secondary"} onClick={() => setActiveSection("conductors")}>Conductors</Button>
          <Button fullWidth variant={activeSection === "buses" ? "primary" : "secondary"} onClick={() => setActiveSection("buses")}>Buses</Button>
          <Button fullWidth variant={activeSection === "routes" ? "primary" : "secondary"} onClick={() => setActiveSection("routes")}>Routes</Button>
          <Button fullWidth variant={activeSection === "fares" ? "primary" : "secondary"} onClick={() => setActiveSection("fares")}>Fares</Button>
          {role === "admin" && (
            <Button fullWidth variant={activeSection === "users" ? "primary" : "secondary"} onClick={() => setActiveSection("users")}>Users</Button>
          )}
        </nav>
        <div className="mt-auto text-gray-400 text-sm">© 2025 GoCashless. All rights reserved.</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-700">Dashboard</h1>
        {activeSection === "transactions" && (
          <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-bold mb-2">Transactions</h2>
            {/* Replace with a table component */}
            <ul>
              {transactions.map((tx) => (
                <li key={tx.id} className="border-b py-2 flex justify-between">
                  <span>Conductor: {tx.conductor}</span>
                  <span>Amount: {tx.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeSection === "conductors" && (
          <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-bold mb-2">Conductors</h2>
            {/* List conductors and registration form */}
            <ul>
              {conductors.map((c) => (
                <li key={c.id} className="border-b py-2">{c.name}</li>
              ))}
            </ul>
            <form className="space-y-2">
              <Input name="conductorName" placeholder="Conductor Name" />
              <Button type="submit">Register Conductor</Button>
            </form>
          </div>
        )}
        {activeSection === "buses" && (
          <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-bold mb-2">Buses</h2>
            <ul>
              {buses.map((b) => (
                <li key={b.id} className="border-b py-2">{b.plate}</li>
              ))}
            </ul>
            <form className="space-y-2">
              <Input name="busPlate" placeholder="Bus Plate Number" />
              <Button type="submit">Register Bus</Button>
            </form>
          </div>
        )}
        {activeSection === "routes" && (
          <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-bold mb-2">Routes</h2>
            {/* Add route management UI here */}
            <p>Route management coming soon...</p>
          </div>
        )}
        {activeSection === "fares" && (
          <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-bold mb-2">Fares</h2>
            {/* Add fare management UI here */}
            <p>Fare management coming soon...</p>
          </div>
        )}
        {role === "admin" && activeSection === "users" && (
          <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-bold mb-2">Users</h2>
            <ul>
              {users.map((u) => (
                <li key={u.id} className="border-b py-2">{u.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
