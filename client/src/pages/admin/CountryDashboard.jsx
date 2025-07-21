import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CountryDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user && user.country) {
      fetch(`/api/restaurants?country=${encodeURIComponent(user.country)}`)
        .then((res) => res.json())
        .then((data) => {
          setRestaurants(data);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleRestaurantClick = (restaurantId) => {
    if (restaurantId) {
      navigate(`/restaurant/dashboard/${restaurantId}`);
    } else {
      setError("Restaurant ID is missing! Navigation aborted.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in.</div>;

  return (
    <div>
      <h2>Restaurants in {user.country}</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {restaurants.length === 0 ? (
        <p>No restaurants found in this country.</p>
      ) : (
        <ul>
          {restaurants.map((restaurant) => {
            console.log('Restaurant:', restaurant); // Debug: log each restaurant
            return (
              <li
                key={restaurant._id || restaurant.id || Math.random()}
                onClick={() => handleRestaurantClick(restaurant._id || restaurant.id)}
                style={{ cursor: restaurant._id ? "pointer" : "not-allowed", margin: "10px 0", color: restaurant._id ? undefined : 'gray' }}
              >
                {restaurant.name} {!(restaurant._id || restaurant.id) && '(Invalid ID)'}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CountryDashboard;