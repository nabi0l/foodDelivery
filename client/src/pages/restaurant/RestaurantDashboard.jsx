import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RestaurantDashboard = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    if (!restaurantId || restaurantId === "home") {
      setRestaurant(null);
      return;
    }
    fetch(`/api/restaurants/${restaurantId}`)
      .then((res) => res.json())
      .then((data) => setRestaurant(data));
  }, [restaurantId]);

  if (!restaurantId || restaurantId === "home") {
    return <div>Welcome to the Restaurant Dashboard Home!</div>;
  }

  if (!restaurant) return <div>Loading...</div>;

  return (
    <div>
      <h2>{restaurant.name} Dashboard</h2>
      <p>Country: {restaurant.country}</p>
      {/* ...other info... */}
    </div>
  );
};

export default RestaurantDashboard;