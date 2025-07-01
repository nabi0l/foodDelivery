import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaMotorcycle, 
  FaUtensils, 
  FaHome, 
  FaShoppingCart, 
  FaUser, 
  FaTimes, 
  FaMinus, 
  FaPlus,
  FaTrash
} from 'react-icons/fa';

import '../styles/main.css';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Mock cart items for UI design
  const cartItems = [
    {
      id: 1,
      name: 'Margherita Pizza',
      price: 12.99,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
      customizations: 'Medium, Extra Cheese'
    },
    {
      id: 2,
      name: 'Garlic Bread',
      price: 4.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1585506942814-ec50f7b785af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <FaMotorcycle className="text-red-600 text-2xl" />
          <NavLink to="/" className="text-2xl font-bold text-red-600 hover:text-red-700 transition-colors">
            FoodDelivery
          </NavLink>
        </div>
        
        {/* Navigation Links */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `flex items-center gap-2 px-2 py-2 font-medium transition-colors ${
                    isActive ? 'text-red-600' : 'text-gray-700 hover:text-red-600'
                  }`
                }
              >
                <FaHome className="text-sm" />
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/restaurants" 
                className={({ isActive }) => 
                  `flex items-center gap-2 px-2 py-2 font-medium transition-colors ${
                    isActive ? 'text-red-600' : 'text-gray-700 hover:text-red-600'
                  }`
                }
              >
                <FaUtensils className="text-sm" />
                Restaurants
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              className="p-2 text-gray-700 hover:text-red-600 transition-colors relative"
              aria-label="Cart"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <FaShoppingCart className="text-xl" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
            
            {/* Cart Dropdown */}
            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Your Order</h3>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {cartItems.length > 0 ? (
                    <>
                      {cartItems.map((item) => (
                        <div key={item.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                          <div className="flex gap-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              {item.customizations && (
                                <p className="text-xs text-gray-500 mt-1">{item.customizations}</p>
                              )}
                              <div className="flex justify-between items-center mt-2">
                                <span className="font-medium text-red-600">${(item.price * item.quantity).toFixed(2)}</span>
                                <div className="flex items-center border rounded-md">
                                  <button className="px-2 py-1 text-gray-600 hover:bg-gray-100">
                                    <FaMinus size={12} />
                                  </button>
                                  <span className="px-2 text-sm">{item.quantity}</span>
                                  <button className="px-2 py-1 text-gray-600 hover:bg-gray-100">
                                    <FaPlus size={12} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="p-4 bg-gray-50 border-t border-b border-gray-200">
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Delivery Fee</span>
                          <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-1 font-semibold text-lg mt-2">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <button className="w-full bg-red-600 text-white py-2 rounded-md font-medium hover:bg-red-700 transition-colors">
                          Proceed to Checkout
                        </button>
                        <button className="w-full mt-2 text-center text-red-600 text-sm font-medium hover:underline">
                          View Cart
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center">
                      <FaShoppingCart className="mx-auto text-3xl text-gray-300 mb-3" />
                      <p className="text-gray-500">Your cart is empty</p>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="mt-4 text-red-600 font-medium hover:underline"
                      >
                        Browse Restaurants
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button 
            className="p-2 text-gray-700 hover:text-red-600 transition-colors"
            aria-label="Account"
          >
            <FaUser className="text-xl" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
