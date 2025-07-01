import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMotorcycle } from 'react-icons/fa';
import axios from 'axios';

const PopularRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularRestaurants = async () => {
      try {
        // Make sure to use the correct API URL based on your backend configuration
        const response = await axios.get('http://localhost:5000/api/restaurant/popular');
        setRestaurants(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching popular restaurants:', err);
        setError('Failed to load popular restaurants. Please try again later.');
        setLoading(false);
      }
    };

    fetchPopularRestaurants();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Popular Restaurants</h2>
          <div className="flex justify-center">
            <div className="animate-pulse text-gray-600">Loading popular restaurants...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Popular Restaurants</h2>
          <div className="text-red-600 text-center">{error}</div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Popular Restaurants</h2>
          <Link
            to="/restaurants"
            className="text-red-800 hover:underline font-medium"
          >
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-full h-48 bg-gray-100 overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{restaurant.name}</h3>
                  <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    <FaStar className="mr-1" />
                    {restaurant.rating?.toFixed(1) || 'N/A'}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3 capitalize">{restaurant.cuisine?.toLowerCase() || 'Various cuisines'}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaMotorcycle className="mr-1" />
                    {restaurant.deliveryTime ? `${restaurant.deliveryTime} min` : 'Varies'}
                  </div>
                  <Link
                    to={`/restaurants/${restaurant.id}`}
                    className="text-red-800 hover:underline font-medium"
                  >
                    Order Now
                  </Link>
                </div>
              </div>
            </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-600">
              No popular restaurants available at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularRestaurants;
