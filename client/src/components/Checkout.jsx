import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaShoppingCart, 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaMapMarkerAlt, 
  FaCheckCircle, 
  FaSpinner,
  FaExclamationTriangle,
  FaArrowLeft
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const Checkout = ({ cart, onOrderPlaced, onCancel }) => {
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    specialInstructions: '',
    paymentMethod: 'cash_on_delivery'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();

  // Calculate delivery fee
  const deliveryFee = 2.99;
  const total = cart ? (cart.totalPrice + deliveryFee).toFixed(2) : '0.00';
  
  const { deliveryAddress, specialInstructions, paymentMethod } = formData;
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRadioChange = (value) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: value
    }));
  };

  useEffect(() => {
    // Load saved address if available
    const savedAddress = localStorage.getItem('deliveryAddress');
    if (savedAddress) {
      setFormData(prev => ({
        ...prev,
        deliveryAddress: savedAddress
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!deliveryAddress.trim()) {
      setError('Please enter a delivery address');
      return;
    }

    if (!cart?.items?.length) {
      setError('Your cart is empty');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('Please log in to place an order');
      }

      // Save address for future use
      localStorage.setItem('deliveryAddress', deliveryAddress);
      
      // Prepare order data
      const orderData = {
        userId,
        restaurantId: cart.restaurant?._id || cart.restaurant,
        items: cart.items.map(item => ({
          menuItemId: item.menuItemId || item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalPrice: cart.totalPrice,
        deliveryAddress: deliveryAddress.trim(),
        paymentMethod,
        specialInstructions: specialInstructions.trim()
      };
      
      // Call the checkout API
      const response = await axios.post(
        'http://localhost:5000/api/order/checkout',
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setOrderDetails(response.data.order);
        setOrderPlaced(true);
        toast.success('Order placed successfully!');
        setTimeout(() => {
          if (onOrderPlaced) onOrderPlaced(response.data.order);
          if (onCancel) onCancel();
          navigate('/orders', { state: { orderSuccess: true, newOrderId: response.data.order?._id } });
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to place order. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (orderPlaced && orderDetails) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-500 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">Your order has been received and is being processed.</p>
          
          <div className="bg-gray-50 p-6 rounded-lg text-left mb-6">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Order Details</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Order #:</span> {orderDetails.orderNumber || orderDetails._id}</p>
              <p>
                <span className="font-medium">Status:</span>
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                  {orderDetails.status || 'Processing'}
                </span>
              </p>
              <p><span className="font-medium">Estimated Delivery:</span> 30-45 minutes</p>
              <p><span className="font-medium">Delivery Address:</span> {orderDetails.deliveryAddress}</p>
              <p><span className="font-medium">Payment Method:</span> 
                {orderDetails.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
              </p>
              <p className="mt-4 font-medium">Total: ${orderDetails.totalPrice?.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/orders')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              View Order Status
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <button 
          onClick={onCancel}
          className="mr-4 text-gray-600 hover:text-gray-800"
          disabled={isLoading}
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 flex items-start">
          <FaExclamationTriangle className="text-xl mr-2 mt-1" />
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            <FaMapMarkerAlt className="inline mr-2" /> Delivery Address
          </label>
          <input
            type="text"
            name="deliveryAddress"
            value={deliveryAddress}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter your delivery address"
            disabled={isLoading}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Special Instructions (optional)
          </label>
          <textarea
            name="specialInstructions"
            value={specialInstructions}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="e.g. Leave at the door, call on arrival, etc."
            disabled={isLoading}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
          <div className="flex items-center gap-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="cash_on_delivery"
                checked={paymentMethod === 'cash_on_delivery'}
                onChange={() => handleRadioChange('cash_on_delivery')}
                className="mr-2"
                disabled={isLoading}
              />
              <FaMoneyBillWave className="text-green-500 mr-1" /> Cash on Delivery
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => handleRadioChange('card')}
                className="mr-2"
                disabled={isLoading}
              />
              <FaCreditCard className="text-blue-500 mr-1" /> Credit/Debit Card
            </label>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Subtotal:</span>
            <span>${cart?.totalPrice?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span>Delivery Fee:</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xl font-bold mt-2">
            <span>Total:</span>
            <span>${total}</span>
          </div>
        </div>
        <button
          type="submit"
          className={`w-full py-3 rounded-md font-semibold text-lg transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <FaSpinner className="animate-spin mr-2" /> Placing Order...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <FaShoppingCart className="mr-2" /> Place Order (${total})
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default Checkout; 