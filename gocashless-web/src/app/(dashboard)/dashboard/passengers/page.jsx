
"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { passengerService } from "@/lib/api/passengerService";
import DashboardLayout from "@/components/layout/DashboardLayout";

const PassengerCard = ({ passenger }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 flex flex-col justify-between`}>
      <div>
        <h3 className="text-lg font-bold">{passenger.firstName} {passenger.lastName}</h3>
        <p className="text-gray-600">{passenger.email}</p>
        <p className="text-gray-600">{passenger.phoneNumber}</p>
      </div>
    </div>
  );
};

const PassengersPage = () => {
  const [passengers, setPassengers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPassengers = async () => {
    try {
      setIsLoading(true);
      const data = await passengerService.getPassengers();
      setPassengers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPassengers();
  }, []);

  const filteredPassengers = passengers.filter(p =>
    p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <DashboardLayout><div>Loading...</div></DashboardLayout>;
  }

  if (error) {
    return <DashboardLayout><div>Error: {error}</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Passengers</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Search passengers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-4 py-2 w-64 rounded-lg border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPassengers.map((passenger) => (
          <PassengerCard key={passenger.id} passenger={passenger} />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default PassengersPage;
