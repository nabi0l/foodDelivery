import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiClock, FiStar, FiArrowLeft } from 'react-icons/fi';

const RestaurantMenu = () => {
    const { restaurantId } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRestaurantAndMenu = async () => {
            try {
                setLoading(true);
                // Fetch restaurant details and menu items in parallel
                const [restaurantRes, menuRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/restaurant/${restaurantId}`),
                    axios.get(`http://localhost:5000/api/menuItem/restaurant/${restaurantId}`)
                ]);
                
                setRestaurant(restaurantRes.data);
                setMenuItems(menuRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load restaurant menu. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantAndMenu();
    }, [restaurantId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-4xl mx-auto py-8">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-24 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-4xl mx-auto py-8">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with back button */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-gray-100 mr-4"
                    >
                        <FiArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">
                        {restaurant?.name || 'Restaurant Menu'}
                    </h1>
                </div>
            </header>

            {/* Restaurant Info */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{restaurant?.name}</h2>
                    <div className="flex items-center text-gray-600 mb-2">
                        <FiStar className="text-yellow-400 mr-1" />
                        <span className="font-medium">{restaurant?.rating || 'N/A'}</span>
                        <span className="mx-2">•</span>
                        <span>{restaurant?.cuisine || 'Various Cuisine'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <FiClock className="mr-1" />
                        <span>{restaurant?.deliveryTime || '20-30'} min</span>
                        <span className="mx-2">•</span>
                        <span>Free Delivery</span>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Menu</h3>
                    
                    {menuItems.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No menu items available at the moment.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {menuItems.map((item) => (
                                <div key={item._id} className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                        <p className="text-lg font-semibold text-gray-900 mt-2">${item.price?.toFixed(2)}</p>
                                    </div>
                                    {item.image && (
                                        <div className="ml-4">
                                            <img 
                                                src={item.image} 
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestaurantMenu;