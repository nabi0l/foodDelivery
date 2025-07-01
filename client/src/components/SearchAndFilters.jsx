import { useState, useEffect } from 'react';
import { FaSearch, FaTimes, FaFilter, FaStar, FaMotorcycle, FaDollarSign } from 'react-icons/fa';

const SearchAndFilters = ({
  onSearch,
  onFilterChange,
  filters = {},
  cuisines = [],
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    cuisine: '',
    minRating: 0,
    maxDeliveryTime: '',
    priceRange: '',
    sortBy: 'rating',
    ...filters
  });

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(prev => ({
      ...prev,
      ...filters
    }));
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...localFilters,
      [key]: value
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      cuisine: '',
      minRating: 0,
      maxDeliveryTime: '',
      priceRange: '',
      sortBy: 'rating'
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.entries(localFilters).some(
    ([key, value]) => key !== 'sortBy' && value && value !== ''
  );

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for restaurants or cuisines..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  onSearch('');
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <button 
            type="submit" 
            className="mt-2 w-full md:w-auto md:absolute md:right-1 md:top-1/2 md:transform md:-translate-y-1/2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4 flex justify-end">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
        >
          <FaFilter />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {Object.values(localFilters).filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block`}>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Cuisine Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuisine
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-red-500 focus:border-red-500"
                value={localFilters.cuisine || ''}
                onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                disabled={loading}
              >
                <option value="">All Cuisines</option>
                {cuisines.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Rating
              </label>
              <div className="flex items-center space-x-2">
                <FaStar className="text-yellow-400" />
                <select
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-red-500 focus:border-red-500"
                  value={localFilters.minRating || 0}
                  onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
                  disabled={loading}
                >
                  <option value="0">Any</option>
                  <option value="4">4.0+</option>
                  <option value="4.5">4.5+</option>
                  <option value="5">5.0</option>
                </select>
              </div>
            </div>

            {/* Delivery Time Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Delivery Time
              </label>
              <div className="flex items-center space-x-2">
                <FaMotorcycle className="text-gray-400" />
                <select
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-red-500 focus:border-red-500"
                  value={localFilters.maxDeliveryTime || ''}
                  onChange={(e) => handleFilterChange('maxDeliveryTime', e.target.value)}
                  disabled={loading}
                >
                  <option value="">Any time</option>
                  <option value="30">Under 30 min</option>
                  <option value="45">Under 45 min</option>
                  <option value="60">Under 60 min</option>
                </select>
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <div className="flex items-center space-x-2">
                <FaDollarSign className="text-gray-400" />
                <select
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-red-500 focus:border-red-500"
                  value={localFilters.priceRange || ''}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  disabled={loading}
                >
                  <option value="">All Prices</option>
                  <option value="$">$ (Cheap)</option>
                  <option value="$$">$$ (Moderate)</option>
                  <option value="$$$">$$$ (Expensive)</option>
                  <option value="$$$$">$$$$ (Very Expensive)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sort By */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'rating', label: 'Rating', icon: <FaStar className="mr-1" /> },
                { value: 'deliveryTime', label: 'Delivery Time', icon: <FaMotorcycle className="mr-1" /> },
                { value: 'priceLowToHigh', label: 'Price: Low to High', icon: <FaDollarSign className="mr-1" /> },
                { value: 'priceHighToLow', label: 'Price: High to Low', icon: <FaDollarSign className="mr-1" /> },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`flex items-center px-3 py-2 rounded-lg border text-sm ${
                    localFilters.sortBy === option.value
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleFilterChange('sortBy', option.value)}
                  disabled={loading}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters;
