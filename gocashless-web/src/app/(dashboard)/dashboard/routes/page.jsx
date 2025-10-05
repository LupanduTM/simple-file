
"use client";
import { useState, useEffect } from "react";
import { Plus, Bus, Edit, Trash, Search } from "lucide-react";
import { routeService } from "@/lib/api/routeService";
import Modal from "@/components/Modal";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRouter } from 'next/navigation';

const RouteCard = ({ route, onEdit, onDelete, onNavigate }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 flex flex-col justify-between ${!route.isActive ? 'opacity-50' : ''}`}>
      <div>
        <h3 className="text-lg font-bold">{route.name}</h3>
        <p className="text-gray-600">{route.description}</p>
        <p className={`text-sm font-bold ${route.isActive ? 'text-green-500' : 'text-red-500'}`}>
          {route.isActive ? 'Active' : 'Inactive'}
        </p>
      </div>
      <div className="flex justify-end items-center mt-4">
        <button onClick={() => onNavigate(route.id)} className="text-blue-500 hover:text-blue-700 mr-4">
          <Bus size={20} />
        </button>
        <button onClick={() => onEdit(route)} className="text-green-500 hover:text-green-700 mr-4">
          <Edit size={20} />
        </button>
        <button onClick={() => onDelete(route.id)} className="text-red-500 hover:text-red-700">
          <Trash size={20} />
        </button>
      </div>
    </div>
  );
};

const RoutesPage = () => {
  const router = useRouter();
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeName, setRouteName] = useState("");
  const [routeDescription, setRouteDescription] = useState("");
  const [isRouteActive, setIsRouteActive] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRoutes = async () => {
    try {
      setIsLoading(true);
      const data = await routeService.getRoutes();
      setRoutes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleAddRoute = async (e) => {
    e.preventDefault();
    try {
      const newRoute = await routeService.createRoute({ name: routeName, description: routeDescription, isActive: isRouteActive });
      setRoutes([...routes, newRoute]);
      setRouteName("");
      setRouteDescription("");
      setIsRouteActive(true);
      setIsAddModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (route) => {
    setSelectedRoute(route);
    setRouteName(route.name);
    setRouteDescription(route.description);
    setIsRouteActive(route.isActive);
    setIsEditModalOpen(true);
  };

  const handleUpdateRoute = async (e) => {
    e.preventDefault();
    try {
      const updatedRoute = await routeService.updateRoute(selectedRoute.id, { name: routeName, description: routeDescription, isActive: isRouteActive });
      setRoutes(routes.map(route => route.id === selectedRoute.id ? updatedRoute : route));
      setRouteName("");
      setRouteDescription("");
      setIsRouteActive(true);
      setSelectedRoute(null);
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      try {
        await routeService.deleteRoute(id);
        setRoutes(routes.filter(route => route.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleNavigateToBusStops = (routeId) => {
    router.push(`/dashboard/routes/bus-stops?routeId=${routeId}`);
  };

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (route.description && route.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
        <h1 className="text-2xl font-bold">Routes</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Search routes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-4 py-2 w-64 rounded-lg border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
            <Plus size={20} className="mr-2" />
            Add New Route
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutes.map((route) => (
          <RouteCard key={route.id} route={route} onEdit={handleEdit} onDelete={handleDelete} onNavigate={handleNavigateToBusStops} />
        ))}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Add New Route</h2>
        <form onSubmit={handleAddRoute}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Route Name</label>
            <input
              type="text"
              id="name"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description</label>
            <textarea
              id="description"
              value={routeDescription}
              onChange={(e) => setRouteDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={isRouteActive}
              onChange={(e) => setIsRouteActive(e.target.checked)}
              className="h-4 w-4 text-accent rounded border-gray-300 focus:ring-accent"
            />
            <label htmlFor="isActive" className="ml-2 text-gray-700 font-bold">Is Active</label>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Create
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Edit Route</h2>
        <form onSubmit={handleUpdateRoute}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Route Name</label>
            <input
              type="text"
              id="name"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description</label>
            <textarea
              id="description"
              value={routeDescription}
              onChange={(e) => setRouteDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isActiveEdit"
              checked={isRouteActive}
              onChange={(e) => setIsRouteActive(e.target.checked)}
              className="h-4 w-4 text-accent rounded border-gray-300 focus:ring-accent"
            />
            <label htmlFor="isActiveEdit" className="ml-2 text-gray-700 font-bold">Is Active</label>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Update
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default RoutesPage;
