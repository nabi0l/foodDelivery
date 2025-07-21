import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RestaurantManagement() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // Get the logged-in user's info
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.country) {
          setError("User country not found. Please log in again.");
          setLoading(false);
          return;
        }

        // Fetch restaurants for the admin's country
        const response = await axios.get(`/api/restaurants?country=${encodeURIComponent(user.country)}`);
        setRestaurants(response.data);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError("Failed to load restaurants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return <div className="p-4">Loading restaurants...</div>;
  }

  if (error) {
    return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
      <p className="font-bold">Error</p>
      <p>{error}</p>
    </div>;
  }

  return (
    <section>
      <h3 className="text-xl font-bold mb-6 text-red-600">Restaurant Management</h3>
      {restaurants.length === 0 ? (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">
          <p>No restaurants found in your country.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Cuisine</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => (
                <tr key={restaurant._id} className="border-b last:border-none hover:bg-gray-50">
                  <td className="py-3 px-4">{restaurant.name}</td>
                  <td className="py-3 px-4">{restaurant.cuisine}</td>
                  <td className="py-3 px-4">{restaurant.location}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      restaurant.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {restaurant.isOpen ? "Open" : "Closed"}
                    </span>
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    <button 
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow text-sm"
                      onClick={() => handleBlock(restaurant._id)}
                    >
                      {restaurant.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow text-sm">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );

  async function handleBlock(restaurantId) {
    if (window.confirm('Are you sure you want to block/unblock this restaurant?')) {
      try {
        await axios.patch(`/api/restaurants/${restaurantId}/toggle-block`);
        // Refresh the restaurants list
        const response = await axios.get('/api/restaurants');
        setRestaurants(response.data);
      } catch (err) {
        console.error('Error toggling restaurant block status:', err);
        alert('Failed to update restaurant status');
      }
    }
  }
}
