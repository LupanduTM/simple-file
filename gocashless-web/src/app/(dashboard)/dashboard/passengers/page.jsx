
"use client";
import { useState, useEffect } from "react";
import { Search, Key, Trash } from "lucide-react";
import { passengerService } from "@/lib/api/passengerService";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Modal from "@/components/Modal";

const PassengerCard = ({ passenger, onResetPassword, onDelete }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 flex flex-col justify-between`}>
      <div>
        <h3 className="text-lg font-bold">{passenger.firstName} {passenger.lastName}</h3>
        <p className="text-gray-600">{passenger.email}</p>
        <p className="text-gray-600">{passenger.phoneNumber}</p>
      </div>
      <div className="flex justify-end items-center mt-4">
        <button onClick={() => onResetPassword(passenger)} className="text-yellow-500 hover:text-green-700 mr-2">
          <Key size={20} />
        </button>
        <button onClick={() => onDelete(passenger.id)} className="text-red-500 hover:text-red-700">
          <Trash size={20} />
        </button>
      </div>
    </div>
  );
};

const PassengersPage = () => {
  const [passengers, setPassengers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState(null);

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

  const openResetModal = (passenger) => {
    setSelectedPassenger(passenger);
    setIsResetModalOpen(true);
  };

  const handleResetPasswordConfirm = async () => {
    try {
      await passengerService.resetPassword(selectedPassenger.id);
      setIsResetModalOpen(false);
      setSelectedPassenger(null);
      alert("Password has been reset. An email has been sent to the passenger with the new credentials.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this passenger?")) {
      try {
        await passengerService.deletePassenger(id);
        setPassengers(passengers.filter(p => p.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

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
          <PassengerCard key={passenger.id} passenger={passenger} onResetPassword={openResetModal} onDelete={handleDelete} />
        ))}
      </div>

      <Modal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <p>Are you sure you want to reset the password for <strong>{selectedPassenger?.firstName} {selectedPassenger?.lastName}</strong>?</p>
        <p className="text-sm text-gray-600 mt-2">A new, randomly generated password will be sent to the passenger's email address.</p>
        <div className="flex justify-end mt-6">
          <button onClick={() => setIsResetModalOpen(false)} className="mr-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
            Cancel
          </button>
          <button onClick={handleResetPasswordConfirm} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Confirm & Reset
          </button>
        </div>
      </Modal>

    </DashboardLayout>
  );
};

export default PassengersPage;
