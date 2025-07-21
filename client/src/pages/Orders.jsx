import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaClock, FaTimesCircle, FaBoxOpen } from 'react-icons/fa';

const statusStyles = {
  new: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels = {
  new: 'New',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const statusIcons = {
  new: <FaBoxOpen className="text-blue-400 text-xl mr-2" />,
  in_progress: <FaClock className="text-yellow-400 text-xl mr-2" />,
  completed: <FaCheckCircle className="text-green-500 text-xl mr-2" />,
  cancelled: <FaTimesCircle className="text-red-400 text-xl mr-2" />,
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setOrders([]);
          setLoading(false);
          return;
        }
        const response = await axios.get(`http://localhost:5000/api/order?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <FaClock className="animate-spin text-3xl text-red-500 mr-2" />
      <span className="text-lg text-gray-600">Loading your orders...</span>
    </div>
  );
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      <FaTimesCircle className="text-4xl text-red-500 mb-2" />
      <span className="text-lg text-gray-600">{error}</span>
    </div>
  );

  // Only show orders with status 'paid' or 'completed'
  const paidOrders = orders.filter(order => order.status === 'paid' || order.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-red-700 mb-8 text-center">My Orders</h2>
        {paidOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-md">
            <FaBoxOpen className="text-5xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-4">You haven't placed any orders yet. Start exploring delicious food now!</p>
            <a href="/" className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">Order Now</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paidOrders.map(order => (
              <div key={order._id} className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-2 border border-gray-100 hover:shadow-lg transition">
                <div className="flex items-center mb-2">
                  {statusIcons[order.status] || <FaBoxOpen className="text-gray-400 text-xl mr-2" />}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-2 ${statusStyles[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                  <span className="ml-auto text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm text-gray-500">Order #{order._id.slice(-5)}</span>
                </div>
                <div className="mb-2">
                  <span className="block text-gray-700 font-semibold mb-1">Items:</span>
                  <ul className="list-disc list-inside text-gray-600 text-sm">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <li key={idx}>{item.name} <span className="text-gray-400">x{item.quantity}</span></li>
                      ))
                    ) : (
                      <li className="italic text-gray-400">No items</li>
                    )}
                  </ul>
                </div>
                {order.deliveryAddress && (
                  <div className="mb-1">
                    <span className="block text-gray-700 font-semibold">Delivery Address:</span>
                    <span className="text-gray-600 text-sm">{order.deliveryAddress}</span>
                  </div>
                )}
                {order.specialInstructions && (
                  <div className="mb-1">
                    <span className="block text-gray-700 font-semibold">Instructions:</span>
                    <span className="text-gray-600 text-sm">{order.specialInstructions}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
