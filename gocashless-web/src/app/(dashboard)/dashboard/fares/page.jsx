
"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash, Search } from "lucide-react";
import { fareService } from "@/lib/api/fareService";
import { routeService } from "@/lib/api/routeService";
import { busStopService } from "@/lib/api/busStopService";
import Modal from "@/components/Modal";
import DashboardLayout from "@/components/layout/DashboardLayout";

const FaresPage = () => {
  const [fares, setFares] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [busStops, setBusStops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'add', data: null });
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);
  const [lookupData, setLookupData] = useState({ routeId: '', originStopId: '', destinationStopId: '' });
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [faresData, routesData, busStopsData] = await Promise.all([
        fareService.getAllFares(),
        routeService.getRoutes(),
        busStopService.getAllBusStops(),
      ]);
      setFares(faresData);
      setRoutes(routesData);
      setBusStops(busStopsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (fare = null) => {
    const isEditMode = !!fare;
    setModalState({
      isOpen: true,
      mode: isEditMode ? 'edit' : 'add',
      data: fare || { routeId: '', originStopId: '', destinationStopId: '', amount: '', currency: 'ZMW', validFrom: '', validTo: '' },
    });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, mode: 'add', data: null });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setModalState(prev => ({ ...prev, data: { ...prev.data, [name]: value } }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const dataToSave = { ...modalState.data };
    // Convert empty strings to null for optional date fields
    if (!dataToSave.validFrom) dataToSave.validFrom = null;
    if (!dataToSave.validTo) dataToSave.validTo = null;

    try {
      if (modalState.mode === 'edit') {
        await fareService.updateFare(modalState.data.id, dataToSave);
      } else {
        await fareService.createFare(dataToSave);
      }
      fetchData();
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this fare?")) {
      try {
        await fareService.deleteFare(id);
        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const getStopsForSelectedRoute = (routeId) => {
      if (!routeId) return [];
      return busStops.filter(stop => stop.routeId === routeId);
  }

  const handleLookupChange = (e) => {
    const { name, value } = e.target;
    setLookupData(prev => ({ ...prev, [name]: value }));
  };

  const handleLookupFare = async (e) => {
    e.preventDefault();
    setLookupError(null);
    setLookupResult(null);
    try {
      const result = await fareService.lookupFare(lookupData.routeId, lookupData.originStopId, lookupData.destinationStopId);
      setLookupResult(result);
    } catch (err) {
      setLookupError("Fare not found or an error occurred.");
    }
  };

  if (isLoading) {
    return <DashboardLayout><div>Loading...</div></DashboardLayout>;
  }

  if (error) {
    return <DashboardLayout><div>Error: {error}</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Fares</h1>
        <div className="flex items-center space-x-2">
          <button onClick={() => setIsLookupModalOpen(true)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center">
            <Search size={20} className="mr-2" />
            Lookup Fare
          </button>
          <button onClick={() => handleOpenModal()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
            <Plus size={20} className="mr-2" />
            Add New Fare
          </button>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Route</th>
              <th className="py-3 px-4 text-left">Origin</th>
              <th className="py-3 px-4 text-left">Destination</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fares.map((fare) => (
              <tr key={fare.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{fare.routeName}</td>
                <td className="py-3 px-4">{fare.originStopName}</td>
                <td className="py-3 px-4">{fare.destinationStopName}</td>
                <td className="py-3 px-4">{fare.amount} {fare.currency}</td>
                <td className="py-3 px-4 text-center">
                  <button onClick={() => handleOpenModal(fare)} className="text-green-500 hover:text-green-700 mr-4">
                    <Edit size={20} />
                  </button>
                  <button onClick={() => handleDelete(fare.id)} className="text-red-500 hover:text-red-700">
                    <Trash size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalState.isOpen} onClose={handleCloseModal}>
        <h2 className="text-xl font-bold mb-4">{modalState.mode === 'edit' ? "Edit Fare" : "Add New Fare"}</h2>
        <form onSubmit={handleSave}>
            <div className="mb-4">
                <label htmlFor="routeId" className="block text-gray-700 font-bold mb-2">Route</label>
                <select name="routeId" value={modalState.data?.routeId || ''} onChange={handleFormChange} className="w-full p-2 border rounded" required>
                    <option value="">Select a Route</option>
                    {routes.map(route => <option key={route.id} value={route.id}>{route.name}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="originStopId" className="block text-gray-700 font-bold mb-2">Origin</label>
                    <select name="originStopId" value={modalState.data?.originStopId || ''} onChange={handleFormChange} className="w-full p-2 border rounded" required disabled={!modalState.data?.routeId}>
                        <option value="">Select an Origin</option>
                        {getStopsForSelectedRoute(modalState.data?.routeId).map(stop => <option key={stop.id} value={stop.id}>{stop.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="destinationStopId" className="block text-gray-700 font-bold mb-2">Destination</label>
                    <select name="destinationStopId" value={modalState.data?.destinationStopId || ''} onChange={handleFormChange} className="w-full p-2 border rounded" required disabled={!modalState.data?.routeId}>
                        <option value="">Select a Destination</option>
                        {getStopsForSelectedRoute(modalState.data?.routeId).map(stop => <option key={stop.id} value={stop.id}>{stop.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="amount" className="block text-gray-700 font-bold mb-2">Amount</label>
                    <input type="number" name="amount" value={modalState.data?.amount || ''} onChange={handleFormChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label htmlFor="currency" className="block text-gray-700 font-bold mb-2">Currency</label>
                    <input type="text" name="currency" value={modalState.data?.currency || ''} onChange={handleFormChange} className="w-full p-2 border rounded" required />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="validFrom" className="block text-gray-700 font-bold mb-2">Valid From (Optional)</label>
                    <input type="datetime-local" name="validFrom" value={modalState.data?.validFrom ? modalState.data.validFrom.substring(0, 16) : ''} onChange={handleFormChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label htmlFor="validTo" className="block text-gray-700 font-bold mb-2">Valid To (Optional)</label>
                    <input type="datetime-local" name="validTo" value={modalState.data?.validTo ? modalState.data.validTo.substring(0, 16) : ''} onChange={handleFormChange} className="w-full p-2 border rounded" />
                </div>
            </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Save
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isLookupModalOpen} onClose={() => setIsLookupModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Fare Lookup</h2>
        <form onSubmit={handleLookupFare}>
            <div className="mb-4">
                <label htmlFor="routeId" className="block text-gray-700 font-bold mb-2">Route</label>
                <select name="routeId" value={lookupData.routeId} onChange={handleLookupChange} className="w-full p-2 border rounded" required>
                    <option value="">Select a Route</option>
                    {routes.map(route => <option key={route.id} value={route.id}>{route.name}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="originStopId" className="block text-gray-700 font-bold mb-2">Origin</label>
                    <select name="originStopId" value={lookupData.originStopId} onChange={handleLookupChange} className="w-full p-2 border rounded" required disabled={!lookupData.routeId}>
                        <option value="">Select an Origin</option>
                        {getStopsForSelectedRoute(lookupData.routeId).map(stop => <option key={stop.id} value={stop.id}>{stop.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="destinationStopId" className="block text-gray-700 font-bold mb-2">Destination</label>
                    <select name="destinationStopId" value={lookupData.destinationStopId} onChange={handleLookupChange} className="w-full p-2 border rounded" required disabled={!lookupData.routeId}>
                        <option value="">Select a Destination</option>
                        {getStopsForSelectedRoute(lookupData.routeId).map(stop => <option key={stop.id} value={stop.id}>{stop.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="flex justify-end">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Find Fare
                </button>
            </div>
        </form>
        {lookupResult && (
            <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                <h3 className="font-bold">Fare Found</h3>
                <p>Amount: {lookupResult.amount} {lookupResult.currency}</p>
            </div>
        )}
        {lookupError && (
            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <h3 className="font-bold">Error</h3>
                <p>{lookupError}</p>
            </div>
        )}
      </Modal>

    </DashboardLayout>
  );
};

export default FaresPage;
