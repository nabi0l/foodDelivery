import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaUtensils, FaMotorcycle, FaCheckCircle, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import axios from 'axios';

const Orders = () => {
  const [cart, setCart] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    specialInstructions: '',
    paymentMethod: 'cash_on_delivery'
  });
  const location = useLocation();
  const orderSuccess = location.state?.orderSuccess;
  const newOrderId = location.state?.newOrderId;

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (userId) {
          const response = await axios.get(`http://localhost:5000/api/cart/user/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (response.data.success) {
            setCart(response.data.data);
          }
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setCart(null);
        } else {
          console.error('Error fetching cart in Orders page:', err);
        }
      }
    };
    fetchCart();
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
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load orders. Please try again later.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const _formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusIcon = (status) => {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'delivered':
        return <FaCheckCircle className="text-green-500 mr-2" />;
      case 'preparing':
        return <FaUtensils className="text-yellow-500 mr-2" />;
      case 'on the way':
      case 'out for delivery':
        return <FaMotorcycle className="text-blue-500 mr-2" />;
      default:
        return <FaUtensils className="text-gray-500 mr-2" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
        <span className="ml-2 text-lg">Loading your orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaExclamationCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <p className="text-xl text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {statusTabs.map(tab => (
          <button
            key={tab.value}
            className={`px-4 py-2 rounded ${selectedStatus === tab.value ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setSelectedStatus(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Table */}
      {loading ? (
        <div>Loading orders...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-red-100 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 border-b text-left font-semibold text-gray-700">Order ID</th>
                <th className="py-3 px-4 border-b text-left font-semibold text-gray-700">Customer</th>
                <th className="py-3 px-4 border-b text-left font-semibold text-gray-700">Items</th>
                <th className="py-3 px-4 border-b text-left font-semibold text-gray-700">Status</th>
                <th className="py-3 px-4 border-b text-left font-semibold text-gray-700">Time</th>
                <th className="py-3 px-4 border-b text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order, idx) => (
                  <tr
                    key={order._id}
                    className={
                      idx % 2 === 0
                        ? 'bg-white hover:bg-red-50 transition-colors'
                        : 'bg-gray-50 hover:bg-red-50 transition-colors'
                    }
                  >
                    <td className="py-3 px-4 border-b font-mono text-sm text-gray-700">#{order._id.slice(-5)}</td>
                    <td className="py-3 px-4 border-b text-gray-800">{order.customerName || '-'}</td>
                    <td className="py-3 px-4 border-b text-gray-700">
                      {order.items && order.items.length > 0
                        ? order.items.map(item => `${item.name} x${item.quantity}`).join(', ')
                        : <span className="italic text-gray-400">No items</span>}
                    </td>
                    <td className="py-3 px-4 border-b capitalize">
                      <span className={
                        order.status === 'new'
                          ? 'bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold'
                          : order.status === 'in_progress'
                          ? 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold'
                          : order.status === 'completed'
                          ? 'bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold'
                          : 'bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold'
                      }>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b text-gray-600">{timeAgo(order.createdAt)}</td>
                    <td className="py-3 px-4 border-b">
                      {order.status === 'new' && (
                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded transition-colors text-sm font-medium shadow-sm">Accept</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
