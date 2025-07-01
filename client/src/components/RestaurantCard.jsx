
import { FaStar, FaMotorcycle, FaShoppingBag, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
  
  useEffect(() => {
    // Load favorite status from localStorage
    const favorites = JSON.parse(localStorage.getItem('favoriteRestaurants') || '[]');
    setIsFavorite(favorites.some(fav => fav.id === id));
  }, [id]);

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
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{name}</h3>
          <span className="text-sm text-green-600 font-medium whitespace-nowrap ml-2">
            {isOpen ? 'Open Now' : 'Closed'}
          </span>
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
    </div>
  );
};

export default RestaurantCard;
