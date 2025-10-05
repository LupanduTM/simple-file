
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { fareService } from "../../../../../lib/api/fareService";
import { busStopService } from "../../../../../lib/api/busStopService";
import { routeService } from "../../../../../lib/api/routeService";
import EditableFareCell from "../../../../../components/EditableFareCell";
import DashboardLayout from "@/components/layout/DashboardLayout";

const FaresPage = () => {
  const searchParams = useSearchParams();
  const routeIdFromQuery = searchParams.get('routeId');
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(routeIdFromQuery || "");
  const [busStops, setBusStops] = useState([]);
  const [fares, setFares] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for fare lookup
  const [lookupOrigin, setLookupOrigin] = useState("");
  const [lookupDestination, setLookupDestination] = useState("");
  const [lookedUpFare, setLookedUpFare] = useState(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const routesData = await routeService.getRoutes();
        setRoutes(routesData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchRoutes();
  }, []);

  useEffect(() => {
    if (!selectedRoute) {
      setBusStops([]);
      setFares([]);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [busStopsData, faresData] = await Promise.all([
          busStopService.getBusStopsByRoute(selectedRoute),
          fareService.getFaresByRoute(selectedRoute),
        ]);
        setBusStops(busStopsData);
        setFares(faresData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedRoute]);

  const getFare = (originId, destinationId) => {
    return fares.find(f => f.originStop.id === originId && f.destinationStop.id === destinationId);
  };

  const handleSaveFare = async (originId, destinationId, amount) => {
    const existingFare = getFare(originId, destinationId);
    try {
      if (existingFare) {
        const updatedFare = await fareService.updateFare(existingFare.id, { ...existingFare, amount });
        setFares(fares.map(f => f.id === existingFare.id ? updatedFare : f));
      } else {
        const newFare = await fareService.createFare({ routeId: selectedRoute, originStopId: originId, destinationStopId: destinationId, amount });
        setFares([...fares, newFare]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLookupFare = async () => {
    if (!selectedRoute || !lookupOrigin || !lookupDestination) {
      alert("Please select a route, origin, and destination.");
      return;
    }
    setIsLookingUp(true);
    setLookedUpFare(null);
    try {
      const fare = await fareService.lookupFare(selectedRoute, lookupOrigin, lookupDestination);
      setLookedUpFare(fare);
    } catch (err) {
      setLookedUpFare({ error: err.message });
    }
    setIsLookingUp(false);
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Manage Fares</h1>

      {/* Fare Lookup Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Fare Lookup</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="routeSelect" className="block text-sm font-medium text-gray-700 mb-1">Route</label>
            <select
              id="routeSelect"
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select a Route</option>
              {routes.map(route => (
                <option key={route.id} value={route.id}>{route.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="originSelect" className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
            <select
              id="originSelect"
              value={lookupOrigin}
              onChange={(e) => setLookupOrigin(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={!selectedRoute}
            >
              <option value="">Select Origin</option>
              {busStops.map(stop => (
                <option key={stop.id} value={stop.id}>{stop.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="destinationSelect" className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <select
              id="destinationSelect"
              value={lookupDestination}
              onChange={(e) => setLookupDestination(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={!selectedRoute}
            >
              <option value="">Select Destination</option>
              {busStops.map(stop => (
                <option key={stop.id} value={stop.id}>{stop.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleLookupFare}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={isLookingUp}
          >
            {isLookingUp ? 'Searching...' : 'Lookup Fare'}
          </button>
        </div>
        {lookedUpFare && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            {lookedUpFare.error ? (
              <p className="text-red-500">Error: {lookedUpFare.error}</p>
            ) : (
              <p className="text-lg">Fare: <span className="font-bold">{lookedUpFare.amount} {lookedUpFare.currency}</span></p>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : selectedRoute ? (
        <div className="overflow-x-auto">
          <h2 className="text-xl font-bold mb-4">Fare Matrix for Selected Route</h2>
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b">Origin / Destination</th>
                {busStops.map(stop => (
                  <th key={stop.id} className="py-2 px-4 border-b">{stop.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {busStops.map(originStop => (
                <tr key={originStop.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b font-bold">{originStop.name}</td>
                  {busStops.map(destinationStop => (
                    <td key={destinationStop.id} className="py-2 px-4 border-b text-center">
                      <EditableFareCell
                        value={getFare(originStop.id, destinationStop.id)?.amount || "-"}
                        onSave={(amount) => handleSaveFare(originStop.id, destinationStop.id, amount)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500">Please select a route to view the fare matrix.</div>
      )}
    </DashboardLayout>
  );
};

export default FaresPage;
