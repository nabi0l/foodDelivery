import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaArrowLeft, FaUtensils } from 'react-icons/fa';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = () => {
      const favs = JSON.parse(localStorage.getItem('favoriteRestaurants') || '[]');
      setFavorites(favs);
      setIsLoading(false);
    };

    // Load favorites on mount
    loadFavorites();

    // Listen for storage events to update when favorites change in other tabs
    const handleStorageChange = () => {
      loadFavorites();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const removeFromFavorites = (restaurantId) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== restaurantId);
    localStorage.setItem('favoriteRestaurants', JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
    
    // Dispatch storage event to update other tabs
    window.dispatchEvent(new Event('storage'));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          to="/" 
          className="flex items-center text-gray-600 hover:text-red-600 transition-colors mb-4"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FaHeart className="text-red-500 mr-3" />
          My Favorites
        </h1>
        <p className="text-gray-600 mt-2">
          {favorites.length} {favorites.length === 1 ? 'restaurant' : 'restaurants'} saved
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <FaUtensils className="mx-auto text-5xl text-gray-300 mb-4" />
          <h2 className="text-xl font-medium text-gray-700">No favorites yet</h2>
          <p className="text-gray-500 mt-2">Save your favorite restaurants to see them here</p>
          <Link 
            to="/" 
            className="mt-6 inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Browse Restaurants
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="relative h-40 bg-gray-100">
                <img
                  src={restaurant.image || '/images/restaurant-placeholder.jpg'}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/restaurant-placeholder.jpg';
                  }}
                />
                <button
                  onClick={() => removeFromFavorites(restaurant.id)}
                  className="absolute top-3 left-3 bg-white p-2 rounded-full shadow-md text-red-500 hover:text-red-600 transition-colors"
                  aria-label="Remove from favorites"
                >
                  <FaHeart />
                </button>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                    {restaurant.name}
                  </h3>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{restaurant.cuisine}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <span>Delivery: {restaurant.deliveryFee}</span>
                  </div>
                  <span className="mx-2">•</span>
                  <div>
                    <span>Min: {restaurant.minOrder}</span>
                  </div>
                </div>
                
                <Link
                  to={`/restaurants/${restaurant.id}`}
                  className="w-full flex items-center justify-center py-2 px-4 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  View Menu
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
