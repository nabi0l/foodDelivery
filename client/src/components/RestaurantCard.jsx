
import { FaStar, FaMotorcycle, FaShoppingBag, FaHeart, FaRegHeart, FaChevronDown, FaChevronUp, FaUtensils } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RestaurantCard = ({ restaurant }) => {
  // Default values in case props are not provided
  const {
    id,
    name = 'Restaurant Name',
    rating = 4.0,
    cuisine = 'Cuisine Type',
    deliveryTime = '30-40 min',
    deliveryFee = '$2.99',
    minOrder = '$10',
    image = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    isOpen = true,
    tags = []
  } = restaurant || {};

  // Format rating to show one decimal place if needed
  const [isFavorite, setIsFavorite] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Load favorite status from localStorage
    const favorites = JSON.parse(localStorage.getItem('favoriteRestaurants') || '[]');
    setIsFavorite(favorites.some(fav => fav.id === id));
  }, [id]);

  const toggleExpand = async () => {
    if (!isExpanded && menuItems.length === 0) {
      setLoadingMenu(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5000/api/menuItem/restaurant/${id}`);
        setMenuItems(response.data);
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError('Failed to load menu items. Please try again.');
      } finally {
        setLoadingMenu(false);
      }
    }
    setIsExpanded(!isExpanded);
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    const favorites = JSON.parse(localStorage.getItem('favoriteRestaurants') || '[]');
    const newFavorites = isFavorite
      ? favorites.filter(fav => fav.id !== id)
      : [...favorites, { id, name, rating, cuisine, image, deliveryTime, deliveryFee, minOrder }];
    
    localStorage.setItem('favoriteRestaurants', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const numericRating = typeof rating === 'string' ? parseFloat(rating) : Number(rating) || 0;
  const formattedRating = Number.isInteger(numericRating) ? numericRating : numericRating.toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300">
      {/* Restaurant Image */}
      <div className="relative h-48 bg-gray-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';
          }}
        />
        
        {/* Status Badge */}
        {!isOpen && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">
              Closed Now
            </span>
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 flex items-center shadow">
          <FaStar className="text-yellow-400 mr-1" />
          <span className="font-medium text-sm">{formattedRating}</span>
          
          <button 
            onClick={toggleFavorite}
            className="ml-2 text-red-500 hover:text-red-600 transition-colors focus:outline-none"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
      </div>
      
      {/* Restaurant Info */}
      <div className="p-4 cursor-pointer" onClick={toggleExpand}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{name}</h3>
          <div className="flex items-center">
            <span className="text-sm text-green-600 font-medium whitespace-nowrap mr-2">
              {isOpen ? 'Open Now' : 'Closed'}
            </span>
            {isExpanded ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{cuisine}</p>
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index} 
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Delivery Info */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center mr-4">
            <FaMotorcycle className="mr-1" />
            <span>{deliveryTime}</span>
          </div>
          <span>•</span>
          <div className="mx-4">
            <span>Delivery: {deliveryFee}</span>
          </div>
          <span>•</span>
          <div className="ml-4">
            <span>Min: {minOrder}</span>
          </div>
        </div>
        
        {/* Order Button */}
        <Link
          to={`/restaurants/${id || '1'}`}
          className={`w-full flex items-center justify-center py-2 px-4 rounded-lg font-medium transition-colors ${
            isOpen
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          onClick={(e) => !isOpen && e.preventDefault()}
        >
          <FaShoppingBag className="mr-2" />
          {isOpen ? 'Order Now' : 'Currently Unavailable'}
        </Link>
      </div>

      {/* Menu Items Section */}
      {isExpanded && (
        <div className="border-t border-gray-100 px-4 py-3">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            <FaUtensils className="mr-2" /> Menu
          </h4>
          
          {loadingMenu ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-800 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-sm text-center py-2">{error}</div>
          ) : menuItems.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {menuItems.map((item, index) => (
                <div key={index} className="flex justify-between items-start pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{item.name}</h5>
                    <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                    <div className="mt-1">
                      <span className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</span>
                      {item.tags && item.tags.length > 0 && (
                        <span className="ml-2 text-xs text-gray-500">
                          {item.tags.slice(0, 2).join(' • ')}
                        </span>
                      )}
                    </div>
                  </div>
                  {item.image && (
                    <div className="ml-3 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 rounded object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/64';
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-sm text-center py-2">No menu items available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantCard;
