import React, { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt, FaSearch, FaArrowRight, FaLocationArrow } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [address, setAddress] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [topRestaurants, setTopRestaurants] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentAddresses, setRecentAddresses] = useState([]);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  const popularSearches = [
    { id: 1, name: 'Pizza', emoji: '🍕' },
    { id: 2, name: 'Burger', emoji: '🍔' },
    { id: 3, name: 'Sushi', emoji: '🍣' },
    { id: 4, name: 'Pasta', emoji: '🍝' },
  ];

  // Load recent addresses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentAddresses');
    if (saved) {
      setRecentAddresses(JSON.parse(saved));
    }
  }, []);

  // Save address to recent addresses
  const saveToRecentAddresses = (address) => {
    const updated = [address, ...recentAddresses.filter(addr => addr !== address)].slice(0, 5);
    setRecentAddresses(updated);
    localStorage.setItem('recentAddresses', JSON.stringify(updated));
  };

  // Handle address input change
  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    setError('');

    if (value.length > 2) {
      // Generate suggestions based on input
      const filtered = recentAddresses.filter(addr => 
        addr.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle address selection
  const handleAddressSelect = (selectedAddress) => {
    setAddress(selectedAddress);
    setShowSuggestions(false);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!address.trim()) {
      setError('Please enter a delivery address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Save address to recent addresses
      saveToRecentAddresses(address.trim());

      // Search for restaurants based on address
      const response = await fetch(`/api/restaurant/search/by-address?address=${encodeURIComponent(address.trim())}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to search restaurants');
      }

      const restaurants = await response.json();
      
      // Navigate to restaurant listing with search results
      navigate('/restaurants', { 
        state: { 
          searchResults: restaurants,
          searchAddress: address.trim(),
          searchType: 'address'
        }
      });
    } catch (err) {
      setError('Unable to find restaurants for this address. Please try again.');
      console.error('Error searching restaurants:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle location button click
  const handleLocationClick = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      setError('');
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocode to get address
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
            );
            
            if (response.ok) {
              const data = await response.json();
              if (data.results && data.results[0]) {
                const formattedAddress = data.results[0].formatted_address;
                setAddress(formattedAddress);
                saveToRecentAddresses(formattedAddress);
              }
            }
          } catch (err) {
            console.error('Error getting address from coordinates:', err);
            setError('Unable to get your current address. Please enter it manually.');
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          setError('Location access denied. Please enter your address manually.');
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMapIconClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Call a function to filter restaurants
          fetchNearbyRestaurants(latitude, longitude);
        },
        (error) => {
          alert("Location access denied or unavailable.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const fetchNearbyRestaurants = (latitude, longitude) => {
    fetch(`/api/restaurant/search/by-location?lat=${latitude}&lng=${longitude}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => setTopRestaurants(data))
      .catch(err => console.error('Error fetching nearby restaurants:', err));
  };

  return (
    <div className="relative min-h-[600px] bg-gradient-to-r from-red-50 to-red-100 flex items-center overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600 opacity-10 transform rotate-12 origin-top-right"></div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Delicious food,<br />
            <span className="text-red-600">delivered to your door</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto">
            Order from your favorite local restaurants with just a few taps. Fast, fresh, and made just for you.
          </p>
          
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl p-1 max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-red-600" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={address}
                  onChange={handleAddressChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter your delivery address"
                  className={`w-full py-5 pl-12 pr-4 text-gray-700 placeholder-gray-400 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 ${
                    isFocused ? 'ring-2 ring-red-500' : 'ring-1 ring-gray-200'
                  }`}
                  disabled={isLoading}
                />
                
                {/* Address Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div 
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                  >
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleAddressSelect(suggestion)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center"
                      >
                        <FaMapMarkerAlt className="text-red-600 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 md:mt-0 md:ml-4 px-8 py-5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    <span>Searching...</span>
                  </div>
                ) : (
                  <>
                    <span>Find Food</span>
                    <FaArrowRight className="ml-2" />
                  </>
                )}
              </button>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mt-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </form>
          
          {/* Insert MapView here */}

          <div className="mt-8">
            <p className="text-sm text-gray-500 mb-3">POPULAR SEARCHES:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {popularSearches.map((item) => (
                <button
                  key={item.id}
                  className="flex items-center px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 transition-all hover:shadow-md"
                >
                  <span className="mr-2">{item.emoji}</span>
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;