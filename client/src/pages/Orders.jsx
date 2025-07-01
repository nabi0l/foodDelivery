import React from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaMotorcycle, FaCheckCircle } from 'react-icons/fa';

const Orders = () => {
  // Mock order data
  const orders = [
    {
      id: 'ORD-12345',
      date: 'June 30, 2025',
      restaurant: 'Pizza Palace',
      status: 'Delivered',
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 12.99 },
        { name: 'Garlic Bread', quantity: 2, price: 4.99 }
      ],
      total: 22.97,
      deliveryAddress: '123 Main St, City, Country',
      estimatedDelivery: '30-40 min'
    },
    {
      id: 'ORD-12344',
      date: 'June 29, 2025',
      restaurant: 'Burger Barn',
      status: 'Delivered',
      items: [
        { name: 'Classic Burger', quantity: 1, price: 8.99 },
        { name: 'French Fries', quantity: 1, price: 3.99 },
        { name: 'Soda', quantity: 1, price: 2.50 }
      ],
      total: 15.48,
      deliveryAddress: '123 Main St, City, Country',
      estimatedDelivery: '25-35 min'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <FaCheckCircle className="text-green-500 mr-2" />;
      case 'preparing':
        return <FaUtensils className="text-yellow-500 mr-2" />;
      case 'on the way':
        return <FaMotorcycle className="text-blue-500 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">
            <FaUtensils className="mx-auto" />
          </div>
          <h2 className="text-2xl font-medium text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Your delicious food orders will appear here</p>
          <Link 
            to="/restaurants" 
            className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Order Now
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <h3 className="font-medium text-gray-900">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(order.status)}
                    <span className="font-medium">{order.status}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-b border-gray-100">
                <h4 className="font-medium text-gray-900 mb-2">{order.restaurant}</h4>
                <ul className="space-y-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-gray-900">
                        ${(item.quantity * item.price).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Delivery to:</span> {order.deliveryAddress}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Estimated delivery:</span> {order.estimatedDelivery}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="p-3 bg-white border-t border-gray-100 flex justify-end space-x-3">
                <button className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md">
                  Reorder
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md">
                  Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
