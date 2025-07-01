import React from 'react';
import { Link } from 'react-router-dom';
import { FaMotorcycle, FaSearch, FaUser, FaShoppingCart, FaBars } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <FaMotorcycle className="text-red-500 text-2xl" />
            <Link to="/" className="text-xl font-bold text-gray-800">FoodDelivery</Link>
          </div>
          
          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 flex-1 max-w-md mx-6">
            <FaSearch className="text-gray-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search for restaurants and food" 
              className="bg-transparent border-none outline-none w-full text-gray-700"
            />
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/login" className="text-gray-700 hover:text-red-500 flex items-center">
              <FaUser className="mr-1" /> Login
            </Link>
            <Link to="/cart" className="text-gray-700 hover:text-red-500 flex items-center relative">
              <FaShoppingCart className="text-xl" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button className="md:hidden text-gray-700">
            <FaBars className="text-2xl" />
          </button>
        </div>
        
        {/* Mobile Search - Only visible on mobile */}
        <div className="mt-3 md:hidden">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
            <FaSearch className="text-gray-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search for restaurants and food" 
              className="bg-transparent border-none outline-none w-full text-gray-700"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
