import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner, FaExclamationCircle, FaArrowLeft, FaShoppingCart, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import useCart from '../hooks/useCart';

const RestaurantMenu = () => {
  const { addToCart } = useCart();
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState(null);

  useEffect(() => {
    if (!restaurantId) {
      setError('No restaurant selected.');
      setLoading(false);
      return;
    }
    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true);
        setError('');

        const restaurantRes = await axios.get(`http://localhost:5000/api/restaurant/${restaurantId}`);
        if (restaurantRes.data) {
          setRestaurant(restaurantRes.data);
        } else {
          setError('Restaurant not found.');
        }

        const menuRes = await axios.get(`http://localhost:5000/api/menu-items/restaurant/${restaurantId}`);
        if (menuRes.data) {
          setMenuItems(menuRes.data);
          // Initialize quantities for each menu item to 1
          const initialQuantities = {};
          menuRes.data.forEach(item => {
            initialQuantities[item._id] = 1;
          });
          setQuantities(initialQuantities);
        }

      } catch (err) {
        console.error('Error fetching restaurant details:', err);
        const errorMessage = err.response?.data?.message || 'Failed to load restaurant details.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  const handleQuantityChange = (itemId, value) => {
    const quantity = parseInt(value, 10);
    setQuantities(prev => ({
      ...prev,
      [itemId]: quantity >= 1 ? quantity : 1, // Ensure quantity is at least 1
    }));
  };

  const handleAddToCart = async (menuItem) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      toast.error('Please log in to add items to your cart.');
      return;
    }

    const quantity = quantities[menuItem._id] || 1;

    try {
      // Add item to local cart first
      addToCart(
        {
          id: menuItem._id,
          menuItemId: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          quantity,
          restaurantId: menuItem.restaurantId
        },
        menuItem.restaurantId
      );
      
      // Then sync with server
      const response = await axios.post('http://localhost:5000/api/cart',
        {
          userId,
          restaurantId: menuItem.restaurantId,
          items: [{ 
            menuItemId: menuItem._id, 
            name: menuItem.name, 
            price: menuItem.price, 
            quantity 
          }]
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success(`${menuItem.name} added to cart!`);
      } else {
        toast.error(response.data.message || 'Failed to add item to cart.');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add item to cart.';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <FaExclamationCircle className="text-5xl text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-red-700">{error}</h2>
        <Link to="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <FaArrowLeft className="mr-2" /> Back to Restaurants
      </Link>

      {restaurant && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-gray-600 mb-2">{restaurant.cuisine}</p>
          <div className="flex items-center">
            <FaStar className="text-yellow-500 mr-1" />
            <span>{restaurant.rating.toFixed(1)}</span>
            <span className="text-gray-500 ml-2">({restaurant.reviews} reviews)</span>
          </div>
          <p className="mt-4 text-gray-700">{restaurant.description}</p>
        </div>
      )}

      <h2 className="text-3xl font-bold mb-6">Menu</h2>
      {!quantities ? (
        <div className="flex justify-center py-8">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="p-6 flex-grow">
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{item.description}</p>
              <p className="text-lg font-bold text-gray-800">${item.price.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center">
                <label htmlFor={`quantity-${item._id}`} className="sr-only">Quantity</label>
                <input
                  type="number"
                  id={`quantity-${item._id}`}
                  name={`quantity-${item._id}`}
                  min="1"
                  value={quantities[item._id] ?? 1}
                  onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                  className="w-16 p-2 border border-gray-300 rounded-md text-center"
                />
              </div>
              <button
                onClick={() => handleAddToCart(item)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition flex items-center"
              >
                <FaShoppingCart className="mr-2" /> Add
              </button>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
