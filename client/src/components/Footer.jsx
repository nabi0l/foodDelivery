import '../styles/main.css'

import React from 'react';
import { Link } from 'react-router-dom';
import { FaMotorcycle, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* First Column - Logo and Description */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <FaMotorcycle className="text-red-800 text-2xl" />
              <span className="text-2xl font-bold text-red-800">FoodDelivery</span>
            </div>
            <p className="text-gray-600 mb-4 text-center md:text-left">
              Delivering your favorite meals with love and care. Fast, fresh, and right to your door.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="text-gray-600 hover:text-red-800 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-red-800 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-red-800 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-red-800 transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Second Column - Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-red-800">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-red-800 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-gray-600 hover:text-red-800 transition-colors">Restaurants</Link>
              </li>
              <li>
                <Link to="/order" className="text-gray-600 hover:text-red-800 transition-colors">Order</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-red-800 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-600 hover:text-red-800 transition-colors">Favorites</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-red-800 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Third Column - Help & Support */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-red-800">Help & Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-red-800 transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-red-800 transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-red-800 transition-colors">Privacy Policy</Link>
              </li>
              <li className="mt-4">
                <p className="text-gray-600">Email: support@fooddelivery.com</p>
                <p className="text-gray-600">Phone: (123) 456-7890</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-red-200 text-center">
          <p className="text-red-600">&copy; {new Date().getFullYear()} FoodDelivery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
