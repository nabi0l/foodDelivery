import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaMotorcycle, FaUser } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';

const MainNavbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <FaMotorcycle className="h-8 w-8 text-red-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">FoodDelivery</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `px-3 py-2 text-sm font-medium ${isActive ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-700 hover:text-red-600'}`
                }
              >
                Home
              </NavLink>
              <NavLink 
                to="/restaurants" 
                className={({ isActive }) => 
                  `px-3 py-2 text-sm font-medium ${isActive ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-700 hover:text-red-600'}`
                }
              >
                Restaurants
              </NavLink>
              <NavLink 
                to="/orders" 
                className={({ isActive }) => 
                  `px-3 py-2 text-sm font-medium ${isActive ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-700 hover:text-red-600'}`
                }
              >
                Orders
              </NavLink>
              <NavLink 
                to="/favorites" 
                className={({ isActive }) => 
                  `px-3 py-2 text-sm font-medium ${isActive ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-700 hover:text-red-600'}`
                }
              >
                Favorites
              </NavLink>

              <NavLink 
                to="/contact" 
                className={({ isActive }) => 
                  `px-3 py-2 text-sm font-medium ${isActive ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-700 hover:text-red-600'}`
                }
              >
                Contact Us
              </NavLink>
            </div>
          </div>

          {/* Auth/User Icon - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  className="flex items-center focus:outline-none"
                  onClick={() => setShowDropdown((prev) => !prev)}
                >
                  <FaUser className="h-6 w-6 text-red-600" />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                    <Link
                      to="/user-profile"
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-700 hover:text-red-600">
              <FiMenu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50">
            Home
          </Link>
          <Link to="/restaurants" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50">
            Restaurants
          </Link>
          <Link to="/orders" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50">
            Orders
          </Link>
          <Link to="/favorites" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50">
            Favorites
          </Link>
          <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50">
            Contact Us
          </Link>
          <div className="border-t border-gray-200 pt-4 pb-3">
            <div className="flex space-x-4">
              {isLoggedIn ? (
                <button
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600"
                  onClick={handleLogout}
                >
                  <FaUser className="h-6 w-6 mr-1" /> Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600">
                    Login
                  </Link>
                  <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;