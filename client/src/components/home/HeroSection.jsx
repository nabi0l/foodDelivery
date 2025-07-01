import { useState } from 'react';
import { FaMapMarkerAlt, FaSearch, FaArrowRight } from 'react-icons/fa';

const HeroSection = () => {
  const [address, setAddress] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const popularSearches = [
    { id: 1, name: 'Pizza', emoji: '🍕' },
    { id: 2, name: 'Burger', emoji: '🍔' },
    { id: 3, name: 'Sushi', emoji: '🍣' },
    { id: 4, name: 'Pasta', emoji: '🍝' },
  ];

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
          
          <div className="bg-white rounded-xl shadow-2xl p-1 max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-red-600" />
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter your delivery address"
                  className={`w-full py-5 pl-12 pr-4 text-gray-700 placeholder-gray-400 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 ${
                    isFocused ? 'ring-2 ring-red-500' : 'ring-1 ring-gray-200'
                  }`}
                />
              </div>
              <button
                type="button"
                className="mt-4 md:mt-0 md:ml-4 px-8 py-5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105"
              >
                <span>Find Food</span>
                <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
          
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