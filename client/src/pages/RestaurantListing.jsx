import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FiFilter, FiClock, FiStar, FiDollarSign, FiChevronDown, FiChevronLeft, FiChevronRight, FiMapPin } from 'react-icons/fi';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import RestaurantCard from '../components/RestaurantCard';

const RestaurantListing = () => {
  const location = useLocation();
  
  // State for data fetching
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchAddress, setSearchAddress] = useState('');
  const [searchType, setSearchType] = useState('');
  
  // State for filters and pagination
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const [deliveryTime, setDeliveryTime] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [rating, setRating] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Sample data
  const [cuisines, setCuisines] = useState([]);
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [popularFilters, setPopularFilters] = useState([]);

  // Fetch restaurants data
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // Check if we have search results from navigation
        if (location.state?.searchResults) {
          const searchResults = location.state.searchResults;
          const formattedRestaurants = searchResults.map(restaurant => ({
            ...restaurant,
            id: restaurant._id,
            cuisine: restaurant.cuisine || 'Various',
            rating: restaurant.rating || 0,
            deliveryTime: restaurant.deliveryTime?.toString() || '20-30',
            deliveryFee: 'Free',
            minOrder: '$10',
            image: restaurant.image || `https://source.unsplash.com/random/300x200?restaurant,${restaurant._id}`,
            isOpen: restaurant.isOpen || false,
            tags: restaurant.isPopular ? ['Popular'] : [],
            priceRange: '$$',
            reviewCount: Math.floor(Math.random() * 100) + 10
          }));
          setRestaurants(formattedRestaurants);
          setSearchAddress(location.state.searchAddress || '');
          setSearchType(location.state.searchType || '');
        } else {
          // Fetch all restaurants
          const response = await axios.get('http://localhost:5000/api/restaurant/all');
          const formattedRestaurants = response.data.map(restaurant => ({
            ...restaurant,
            id: restaurant._id,
            cuisine: restaurant.cuisine || 'Various',
            rating: restaurant.rating || 0,
            deliveryTime: restaurant.deliveryTime?.toString() || '20-30',
            deliveryFee: 'Free',
            minOrder: '$10',
            image: restaurant.image || `https://source.unsplash.com/random/300x200?restaurant,${restaurant._id}`,
            isOpen: restaurant.isOpen || false,
            tags: restaurant.isPopular ? ['Popular'] : [],
            priceRange: '$$',
            reviewCount: Math.floor(Math.random() * 100) + 10
          }));
          setRestaurants(formattedRestaurants);
        }
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Failed to load restaurants. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [location.state]);

  // Fetch filter data from backend
  useEffect(() => {
    // Fetch cuisines
    axios.get('http://localhost:5000/api/restaurant/cuisines')
      .then(res => setCuisines(res.data.map((c, i) => ({ id: i, name: c }))))
      .catch(() => setCuisines([]));

    // Fetch delivery options
    axios.get('http://localhost:5000/api/menuitem/delivery-options')
      .then(res => setDeliveryOptions(res.data.map((d, i) => ({ id: d, label: d.charAt(0).toUpperCase() + d.slice(1).replace('-', ' ') }))))
      .catch(() => setDeliveryOptions([]));

    // Fetch popular filters
    axios.get('http://localhost:5000/api/menuitem/popular-filters')
      .then(res => setPopularFilters(res.data.map((f, i) => ({
        id: f,
        label: f === 'rating' ? 'Rating 4.0+' : f.charAt(0).toUpperCase() + f.slice(1)
      }))))
      .catch(() => setPopularFilters([]));
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading restaurants...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }
  const restaurantsPerPage = 5;

  // Toggle cuisine selection
  const toggleCuisine = (cuisine) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
    setCurrentPage(1);
  };

  // Toggle delivery option
  const toggleDelivery = (option) => {
    setSelectedDelivery(prev => 
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
    setCurrentPage(1);
  };

  // Toggle popular filter
  const toggleFilter = (filter) => {
    setSelectedFilters(prev => 
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  // Apply filters and sorting
  const filteredRestaurants = restaurants.filter(restaurant => {
    // Filter by selected cuisines
    if (selectedCuisines.length > 0 && !selectedCuisines.includes(restaurant.cuisine)) {
      return false;
    }
    
    // Filter by delivery options
    if (selectedDelivery.includes('free') && restaurant.deliveryFee !== 'Free') return false;
    if (selectedDelivery.includes('fast') && parseInt(restaurant.deliveryTime) > 30) return false;
    if (selectedDelivery.includes('open') && !restaurant.isOpen) return false;
    
    // Filter by popular filters
    if (selectedFilters.includes('rating') && parseFloat(restaurant.rating) < 4.0) return false;
    if (selectedFilters.includes('promo') && !restaurant.tags.includes('Promo')) return false;
    if (selectedFilters.includes('discount') && !restaurant.tags.includes('Discount')) return false;
    if (selectedFilters.includes('new') && !restaurant.tags.includes('New')) return false;
    
    // Filter by delivery time
    if (deliveryTime) {
      const [min, max] = deliveryTime.split('-').map(Number);
      const restaurantTime = parseInt(restaurant.deliveryTime);
      if (restaurantTime < min || restaurantTime > max) return false;
    }
    
    // Filter by price range
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(s => parseInt(s.replace(/[^0-9]/g, '')));
      const restaurantPrice = parseInt(restaurant.minOrder.replace(/[^0-9]/g, ''));
      if (restaurantPrice < min || restaurantPrice > max) return false;
    }
    
    // Filter by rating
    if (rating && parseFloat(restaurant.rating) < parseFloat(rating)) return false;
    
    return true;
  });
  
  // Sort restaurants
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch(sortBy) {
      case 'delivery':
        return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
      case 'rating':
        return parseFloat(b.rating) - parseFloat(a.rating);
      case 'price':
        return parseInt(a.minOrder.replace(/[^0-9]/g, '')) - parseInt(b.minOrder.replace(/[^0-9]/g, ''));
      default:
        return 0;
    }
  });

  // Pagination
  const indexOfLastRestaurant = currentPage * restaurantsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
  const currentRestaurants = sortedRestaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);
  const totalPages = Math.ceil(sortedRestaurants.length / restaurantsPerPage);

  // Handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCuisines([]);
    setSelectedDelivery([]);
    setSelectedFilters([]);
    setDeliveryTime('');
    setPriceRange('');
    setRating('');
    setSortBy('rating');
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = 
    selectedCuisines.length > 0 ||
    selectedDelivery.length > 0 ||
    selectedFilters.length > 0 ||
    deliveryTime ||
    priceRange ||
    rating ||
    sortBy !== 'rating';

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search Results Header */}
      {searchAddress && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiMapPin className="text-blue-600 mr-2" />
              <div>
                <h2 className="text-lg font-semibold text-blue-900">
                  Restaurants near "{searchAddress}"
                </h2>
                <p className="text-sm text-blue-700">
                  Found {restaurants.length} restaurants in your area
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSearchAddress('');
                setSearchType('');
                // Reload all restaurants
                window.location.reload();
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear search
            </button>
          </div>
        </div>
      )}

      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">
          {searchAddress ? 'Search Results' : 'Restaurants'}
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Mobile filter button */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg"
          >
            <FiFilter />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          {/* Sort dropdown */}
          <div className="relative">
            <select 
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm w-full md:w-auto"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="rating">Sort by: Rating</option>
              <option value="delivery">Sort by: Delivery Time</option>
              <option value="price">Sort by: Price</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar - Desktop */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-900">Filters</h3>
              {hasActiveFilters && (
                <button 
                  onClick={clearAllFilters}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear all
                </button>
              )}
            </div>
            
            {/* Delivery Options */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Delivery Options</h4>
              <div className="space-y-2">
                {deliveryOptions.map(option => (
                  <label key={option.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded text-red-600 focus:ring-red-500"
                      checked={selectedDelivery.includes(option.id)}
                      onChange={() => toggleDelivery(option.id)}
                    />
                    <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Popular Filters */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Popular Filters</h4>
              <div className="space-y-2">
                {popularFilters.map(filter => (
                  <label key={filter.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded text-red-600 focus:ring-red-500"
                      checked={selectedFilters.includes(filter.id)}
                      onChange={() => toggleFilter(filter.id)}
                    />
                    <span className="ml-2 text-sm text-gray-700">{filter.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Cuisines */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Cuisines</h4>
              <div className="space-y-2">
                {cuisines.map(cuisine => (
                  <label key={cuisine.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded text-red-600 focus:ring-red-500"
                      checked={selectedCuisines.includes(cuisine.name)}
                      onChange={() => toggleCuisine(cuisine.name)}
                    />
                    <span className="ml-2 text-sm text-gray-700">{cuisine.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCuisines.map(cuisine => (
                <span key={cuisine} className="inline-flex items-center px-3 py-1 bg-gray-100 text-sm rounded-full">
                  {cuisine}
                  <button 
                    onClick={() => toggleCuisine(cuisine)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </span>
              ))}
              
              {selectedDelivery.map(delivery => {
                const label = deliveryOptions.find(o => o.id === delivery)?.label || delivery;
                return (
                  <span key={delivery} className="inline-flex items-center px-3 py-1 bg-gray-100 text-sm rounded-full">
                    {label}
                    <button 
                      onClick={() => toggleDelivery(delivery)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      &times;
                    </button>
                  </span>
                );
              })}
              
              {selectedFilters.map(filter => {
                const label = popularFilters.find(f => f.id === filter)?.label || filter;
                return (
                  <span key={filter} className="inline-flex items-center px-3 py-1 bg-gray-100 text-sm rounded-full">
                    {label}
                    <button 
                      onClick={() => toggleFilter(filter)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      &times;
                    </button>
                  </span>
                );
              })}
              
              {(deliveryTime || priceRange || rating) && (
                <button 
                  onClick={clearAllFilters}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
          
          {/* Restaurant Grid */}
          {currentRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentRestaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
              <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
              <button 
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-1">
                <button
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 disabled:opacity-50"
                >
                  <FiChevronLeft className="h-4 w-4" />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`px-3 py-1 rounded-md border ${
                        currentPage === pageNum
                          ? 'bg-red-600 text-white border-red-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 disabled:opacity-50"
                >
                  <FiChevronRight className="h-4 w-4" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantListing;