
"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash } from "lucide-react";
import { busStopService } from "@/lib/api/busStopService";
import { routeService } from "@/lib/api/routeService";
import Modal from "@/components/Modal";
import DashboardLayout from "@/components/layout/DashboardLayout";

const BusStopsPage = () => {
  const [busStops, setBusStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBusStop, setSelectedBusStop] = useState(null);
  const [formData, setFormData] = useState({ name: "", latitude: "", longitude: "", routeId: "", orderInRoute: "" });

  const fetchBusStopsAndRoutes = async () => {
    try {
      setIsLoading(true);
      const [stopsData, routesData] = await Promise.all([
        busStopService.getAllBusStops(),
        routeService.getRoutes(),
      ]);
      setBusStops(stopsData);
      setRoutes(routesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBusStopsAndRoutes();
  }, []);

  const handleOpenModal = (busStop = null) => {
    setSelectedBusStop(busStop);
    setFormData({
      name: busStop ? busStop.name : "",
      latitude: busStop ? busStop.latitude : "",
      longitude: busStop ? busStop.longitude : "",
      routeId: busStop ? busStop.routeId : "",
      orderInRoute: busStop ? busStop.orderInRoute : "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBusStop(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      latitude: parseFloat(formData.latitude) || null,
      longitude: parseFloat(formData.longitude) || null,
      orderInRoute: parseInt(formData.orderInRoute) || null,
    };

    try {
      if (selectedBusStop) {
        await busStopService.updateBusStop(selectedBusStop.id, dataToSave);
      } else {
        await busStopService.createBusStop(dataToSave);
      }
      fetchBusStopsAndRoutes();
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this bus stop?")) {
      try {
        await busStopService.deleteBusStop(id);
        setBusStops(busStops.filter(bs => bs.id !== id));
      } catch (err) {
        setError(err.message);
      }
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
        <h1 className="text-2xl font-bold">All Bus Stops</h1>
        <button onClick={() => handleOpenModal()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
          <Plus size={20} className="mr-2" />
          Add New Bus Stop
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Route</th>
              <th className="py-3 px-4 text-left">Latitude</th>
              <th className="py-3 px-4 text-left">Longitude</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {busStops.map((busStop) => (
              <tr key={busStop.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{busStop.name}</td>
                <td className="py-3 px-4">{busStop.routeName || 'N/A'}</td>
                <td className="py-3 px-4">{busStop.latitude}</td>
                <td className="py-3 px-4">{busStop.longitude}</td>
                <td className="py-3 px-4 text-center">
                  <button onClick={() => handleOpenModal(busStop)} className="text-green-500 hover:text-green-700 mr-4">
                    <Edit size={20} />
                  </button>
                  <button onClick={() => handleDelete(busStop.id)} className="text-red-500 hover:text-red-700">
                    <Trash size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-xl font-bold mb-4">{selectedBusStop ? "Edit Bus Stop" : "Add New Bus Stop"}</h2>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Bus Stop Name</label>
            <input type="text" id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label htmlFor="routeId" className="block text-gray-700 font-bold mb-2">Route</label>
            <select id="routeId" value={formData.routeId} onChange={(e) => setFormData({ ...formData, routeId: e.target.value })} className="w-full p-2 border rounded">
              <option value="">Select a Route (Optional)</option>
              {routes.map(route => (
                <option key={route.id} value={route.id}>{route.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="orderInRoute" className="block text-gray-700 font-bold mb-2">Order in Route</label>
            <input type="number" id="orderInRoute" value={formData.orderInRoute} onChange={(e) => setFormData({ ...formData, orderInRoute: e.target.value })} className="w-full p-2 border rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="latitude" className="block text-gray-700 font-bold mb-2">Latitude</label>
              <input type="text" id="latitude" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label htmlFor="longitude" className="block text-gray-700 font-bold mb-2">Longitude</label>
              <input type="text" id="longitude" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} className="w-full p-2 border rounded" />
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
