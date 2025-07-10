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
    <div className="container mx-auto px-4 py-8">
      {cart && cart.items && cart.items.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Current Cart</h2>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 transition-colors text-lg"
          >
            Proceed to Checkout (${(cart.totalPrice + 2.99).toFixed(2)})
          </button>
        </div>
      )}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
      
      {orderSuccess && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded">
          Order placed successfully! 🎉
          {newOrderId && <div>Your order ID: {newOrderId}</div>}
        </div>
      )}
      
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
                    <div className="text-sm text-gray-500">
                      {order._id} • {_formatDate(order.createdAt)}
                    </div>
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
                  {order.items?.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between py-1">
                      <span>{item.quantity}x {item.name || 'Item'}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Delivery to:</span> {order.deliveryAddress}
                  </p>
                  <div className="text-sm text-gray-600">
                    <div>Order Status: {order.deliveryStatus || 'Processing'}</div>
                    <div>Payment Status: {order.paymentStatus || 'Pending'}</div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <div className="font-semibold">Total: ${order.totalPrice?.toFixed(2) || '0.00'}</div>
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
