
"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { Plus, Edit, Trash } from "lucide-react";
import { busStopService } from "@/lib/api/busStopService";
import Modal from "@/components/Modal";
import DashboardLayout from "@/components/layout/DashboardLayout";

const BusStopCard = ({ busStop, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-bold">{busStop.name}</h3>
        <p className="text-gray-600">Order: {busStop.orderInRoute}</p>
        <p className="text-gray-500 text-sm">Lat: {busStop.latitude}, Long: {busStop.longitude}</p>
      </div>
      <div className="flex items-center">
        <button onClick={() => onEdit(busStop)} className="text-green-500 hover:text-green-700 mr-4">
          <Edit size={20} />
        </button>
        <button onClick={() => onDelete(busStop.id)} className="text-red-500 hover:text-red-700">
          <Trash size={20} />
        </button>
      </div>
    </div>
  );
};

const BusStopsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeId = searchParams.get('routeId');
  const [busStops, setBusStops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'add', data: null, availableOrders: [] });

  const fetchBusStops = async () => {
    if (!routeId) return;
    try {
      setIsLoading(true);
      const data = await busStopService.getBusStopsByRoute(routeId);
      setBusStops(data.sort((a, b) => a.orderInRoute - b.orderInRoute));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBusStops();
  }, [routeId]);

  const getAvailableOrderNumbers = (editingStop) => {
    const maxOrder = busStops.length + (editingStop ? 0 : 1);
    const allPossibleOrders = Array.from({ length: maxOrder }, (_, i) => i + 1);
    const usedOrders = busStops.map(bs => bs.orderInRoute);

    if (editingStop) {
      return allPossibleOrders.filter(order => !usedOrders.includes(order) || order === editingStop.orderInRoute);
    }
    return allPossibleOrders.filter(order => !usedOrders.includes(order));
  };

  const handleOpenModal = (busStop = null) => {
    const isEditMode = !!busStop;
    const available = getAvailableOrderNumbers(busStop);
    setModalState({
      isOpen: true,
      mode: isEditMode ? 'edit' : 'add',
      data: busStop || { name: "", orderInRoute: available[0] || 1, latitude: "", longitude: "" },
      availableOrders: available,
    });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, mode: 'add', data: null, availableOrders: [] });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setModalState(prev => ({ ...prev, data: { ...prev.data, [name]: value } }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const dataToSave = {
      ...modalState.data,
      routeId: routeId,
      latitude: parseFloat(modalState.data.latitude) || null,
      longitude: parseFloat(modalState.data.longitude) || null,
      orderInRoute: parseInt(modalState.data.orderInRoute) || null,
    };

    // Ensure orderInRoute is not null
    if (dataToSave.orderInRoute === null) {
        setError("Order in Route cannot be empty.");
        return;
    }

    try {
      if (modalState.mode === 'edit') {
        await busStopService.updateBusStop(modalState.data.id, dataToSave);
      } else {
        await busStopService.createBusStop(dataToSave);
      }
      fetchBusStops();
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this bus stop?")) {
      try {
        await busStopService.deleteBusStop(id);
        fetchBusStops();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleNavigateToFares = () => {
    router.push(`/dashboard/routes/fares?routeId=${routeId}`);
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
        <h1 className="text-2xl font-bold">Bus Stops for Route</h1>
        <div className="flex items-center">
          <button onClick={handleNavigateToFares} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center mr-4">
            Manage Fares
          </button>
          <button onClick={() => handleOpenModal()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
            <Plus size={20} className="mr-2" />
            Add New Bus Stop
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {busStops.map((busStop) => (
          <BusStopCard key={busStop.id} busStop={busStop} onEdit={() => handleOpenModal(busStop)} onDelete={handleDelete} />
        ))}
      </div>

      <Modal isOpen={modalState.isOpen} onClose={handleCloseModal}>
        <h2 className="text-xl font-bold mb-4">{modalState.mode === 'edit' ? "Edit Bus Stop" : "Add New Bus Stop"}</h2>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Bus Stop Name</label>
            <input type="text" name="name" value={modalState.data?.name || ''} onChange={handleFormChange} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label htmlFor="orderInRoute" className="block text-gray-700 font-bold mb-2">Order in Route</label>
            <select
              name="orderInRoute"
              value={modalState.data?.orderInRoute || ''}
              onChange={handleFormChange}
              className="w-full p-2 border rounded bg-white"
              required
            >
              {modalState.availableOrders.map(order => (
                <option key={order} value={order}>{order}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Only available order numbers are shown.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="latitude" className="block text-gray-700 font-bold mb-2">Latitude</label>
              <input type="text" name="latitude" value={modalState.data?.latitude || ''} onChange={handleFormChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label htmlFor="longitude" className="block text-gray-700 font-bold mb-2">Longitude</label>
              <input type="text" name="longitude" value={modalState.data?.longitude || ''} onChange={handleFormChange} className="w-full p-2 border rounded" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Save
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default BusStopsPage;
