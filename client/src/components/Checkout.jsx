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
  FaArrowLeft,
  FaSignInAlt
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import useCart from '../hooks/useCart';

// Helper function to parse price from string or number
const parsePrice = (price) => {
  if (price === null || price === undefined) return 0;
  
  // If it's already a number, return it directly
  if (typeof price === 'number') return price;
  
  // If it's a string, remove any non-numeric characters except decimal point
  if (typeof price === 'string') {
    // Remove any currency symbols, commas, etc.
    const cleaned = price.replace(/[^0-9.]/g, '');
    // Convert to number and handle any potential NaN
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  
  return 0;
};

const Checkout = () => {
  const { clearCart, cart: contextCart, restaurantId: cartRestaurantId } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
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

  // Calculate subtotal from cart items array with proper number handling and validation
  const calculateSubtotal = () => {
    if (!contextCart || !contextCart.length) return 0;
    
    try {
      return contextCart.reduce((total, item, index) => {
        // Validate item structure
        if (!item) {
          console.warn(`Invalid item at index ${index} in cart:`, item);
          return total;
        }
        
        // Parse and validate price
        const price = parseFloat(item.price);
        if (isNaN(price) || price < 0) {
          console.warn(`Invalid price for item at index ${index}:`, item.price);
          return total;
        }
        
        // Parse and validate quantity
        const quantity = parseInt(item.quantity, 10);
        if (isNaN(quantity) || quantity < 1) {
          console.warn(`Invalid quantity for item at index ${index}:`, item.quantity);
          return total;
        }
        
        return total + (price * quantity);
      }, 0);
    } catch (error) {
      console.error('Error calculating subtotal:', error);
      return 0;
    }
  };

  const deliveryFee = 5.00; // Fixed delivery fee to match Cart component
  const subtotal = calculateSubtotal();
  const total = (subtotal + deliveryFee).toFixed(2);
  
  // Debug log to check cart data (only in development)
  if (import.meta.env.DEV) {
    console.log('Cart data in Checkout:', {
      items: contextCart?.map(item => ({
        id: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        restaurantId: item.restaurantId
      })),
      restaurantId: cartRestaurantId,
      itemCount: contextCart?.length || 0,
      calculatedSubtotal: subtotal
    });
  }
  
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
    // Check if user is authenticated
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('login') && !window.location.pathname.includes('signup')) {
          localStorage.setItem('fromCheckout', 'true');
          navigate('/login');
        }
        return false;
      }
      
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      return true;
    };

    // Only proceed with loading data if authenticated
    if (checkAuth()) {
      // Load saved address if available
      const savedAddress = localStorage.getItem('deliveryAddress');
      if (savedAddress) {
        setFormData(prev => ({
          ...prev,
          deliveryAddress: savedAddress
        }));
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Enhanced delivery address validation
    const trimmedAddress = deliveryAddress.trim();
    if (!trimmedAddress) {
      setError('Please enter a delivery address');
      return;
    }
    
    // Additional validation for minimum length
    if (trimmedAddress.length < 5) {
      setError('Delivery address is too short. Please provide a more detailed address.');
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('Please log in to place an order');
      }

      // Save address for future use (use the trimmed version)
      localStorage.setItem('deliveryAddress', trimmedAddress);
      
      // Additional validation for cart items
      if (!Array.isArray(contextCart) || contextCart.length === 0) {
        throw new Error('Your cart is empty. Please add items before checking out.');
      }
      
      // Validate each cart item
      const hasInvalidItems = contextCart.some(item => {
        const menuItemId = item.menuItemId || item._id || item.id;
        return !menuItemId || !item.name || isNaN(parseFloat(item.price)) || isNaN(parseInt(item.quantity, 10));
      });
      
      if (hasInvalidItems) {
        throw new Error('Your cart contains invalid items. Please refresh the page and try again.');
      }
      
      // Debug cart and restaurant ID
      console.log('Cart items:', contextCart);
      console.log('Cart restaurant ID:', cartRestaurantId);
      
      // Validate cart has required data
      if (!contextCart || contextCart.length === 0) {
        throw new Error('Your cart is empty. Please add items before checking out.');
      }
      
      // Get restaurant ID from cart context or first item
      const effectiveRestaurantId = cartRestaurantId || 
                                 (contextCart[0]?.restaurantId ? String(contextCart[0].restaurantId) : null);
      
      if (!effectiveRestaurantId) {
        console.error('No restaurant ID found in cart context or items:', {
          cartRestaurantId,
          firstItemRestaurantId: contextCart[0]?.restaurantId,
          cartItems: contextCart.map(item => ({
            id: item.id,
            name: item.name,
            restaurantId: item.restaurantId
          }))
        });
        throw new Error('Could not determine restaurant for this order. Please try adding items to your cart again.');
      }

      // Prepare order items with validation
      const orderItems = contextCart.map((item) => {
        // Ensure we have a valid menuItemId - use item.id instead of item._id or item.menuItemId
        const menuItemId = String(item.id || '').trim();
        if (!menuItemId) {
          console.error('Invalid menu item ID:', item);
          throw new Error('One or more menu items have an invalid ID');
        }
        
        return {
          menuItemId: menuItemId,
          name: String(item.name || 'Unnamed Item').trim(),
          quantity: Math.max(1, Math.min(100, Number(item.quantity) || 1)),
          price: parseFloat(parsePrice(item.price) || 0)
        };
      });

      // Validate that we have at least one item with a valid ID
      if (!orderItems.length || !orderItems.some(item => item.menuItemId)) {
        throw new Error('No valid items in the cart');
      }

      // Calculate total from items as a fallback
      const calculatedTotal = orderItems.reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
      );
      
      // Ensure total is a number before using toFixed
      const numericTotal = typeof total === 'string' ? parseFloat(total) : Number(total) || calculatedTotal;
      
      // Prepare order data with all required fields and additional validation
      const orderData = {
        userId: String(userId).trim(),
        restaurantId: String(effectiveRestaurantId).trim(),
        items: orderItems,
        totalPrice: parseFloat(numericTotal.toFixed(2)), // Ensure this is a number, not a string
        deliveryAddress: String(trimmedAddress).trim(),
        paymentMethod: String(paymentMethod || 'cash_on_delivery').trim(),
        specialInstructions: String(specialInstructions || '').trim(),
        status: 'pending_payment',
        paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'unpaid',
        deliveryStatus: 'pending'
      };
      
      // Final validation of order data
      const missingFields = [];
      if (!orderData.deliveryAddress) missingFields.push('deliveryAddress');
      if (!orderData.restaurantId) missingFields.push('restaurantId');
      if (!orderData.userId) missingFields.push('userId');
      if (!orderData.items || !orderData.items.length) missingFields.push('items');
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      // Log the order data for debugging (formatted for display)
      console.log('Order data being sent:', {
        ...orderData,
        items: orderData.items.map(item => ({
          ...item,
          price: `$${item.price.toFixed(2)}`,
          total: `$${(item.price * item.quantity).toFixed(2)}`
        })),
        totalPrice: `$${orderData.totalPrice.toFixed(2)}`
      });
      
      // Call the checkout API with error handling
      const response = await axios.post(
        'http://localhost:5000/api/order/checkout',
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          validateStatus: function (status) {
            return status < 500; // Only reject if the status code is greater than or equal to 500
          }
        }
      );

      if (response.data.success) {
        console.log('Order successful, response:', response.data);
        setOrderDetails(response.data.order);
        setOrderPlaced(true);
        
        // Only clear the cart after successful order placement
        if (clearCart) {
          clearCart();
        }
        
        toast.success('Order placed successfully!');
        
        // Navigate to orders page after a short delay
        setTimeout(() => {
          navigate('/orders', { 
            state: { 
              orderSuccess: true, 
              newOrderId: response.data.order?._id || response.data.order?.id,
              orderDetails: response.data.order
            } 
          });
        }, 2000);
      } else {
        // Handle non-500 errors from the server
        console.error('Server returned an error:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          request: {
            url: response.config?.url,
            method: response.config?.method,
            data: response.config?.data,
            headers: response.config?.headers
          }
        });
        throw new Error(response.data.message || 'Failed to place order');
      }
    } catch (err) {
      // Log detailed error in development
      console.error('Checkout error details:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        request: {
          url: err.config?.url,
          method: err.config?.method,
          data: err.config?.data,
          headers: err.config?.headers
        },
        stack: import.meta.env.DEV ? err.stack : undefined
      });
      
      // Default error message
      let errorMessage = 'Failed to place order. Please try again.';
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with an error status code
        const { status, data } = err.response;
        
        if (status === 400) {
          errorMessage = data.message || 'Invalid request. Please check your information and try again.';
          if (data.missingFields) {
            errorMessage += ` Missing fields: ${data.missingFields.join(', ')}`;
          }
        } else if (status === 401) {
          errorMessage = 'Please log in to complete your order.';
        } else if (status === 403) {
          errorMessage = 'You do not have permission to perform this action.';
        } else if (status === 404) {
          errorMessage = 'The requested resource was not found.';
        } else if (status === 422) {
          errorMessage = data.message || 'Validation error. Please check your information.';
        } else if (status >= 500) {
          errorMessage = 'Our server encountered an error. Please try again later.';
          
          // Log the complete error response for debugging
          console.error('Server error response:', {
            status: status,
            statusText: err.response.statusText,
            headers: err.response.headers,
            data: data
          });
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your internet connection and try again.';
      } else {
        // Something happened in setting up the request
        errorMessage = `Error: ${err.message}`;
      }
      
      // Show error to user
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-red-600 mx-auto mb-4" />
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
          <FaSignInAlt className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="mb-6">Please log in to continue with your order</p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced && orderDetails) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-500 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">Your order has been received and is being processed.</p>

          {/* Flex row for order items and summary */}
          <div className="flex flex-col md:flex-row gap-8 bg-gray-50 p-6 rounded-lg text-left mb-6">
            {/* Ordered Items */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Ordered Items</h3>
              <ul className="space-y-2">
                {orderDetails.items && orderDetails.items.map((item, idx) => (
                  <li key={item.menuItemId || item._id || idx} className="flex justify-between items-center">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Order Summary */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Order Summary</h3>
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
    <div className="min-h-screen bg-gray-50 py-10 px-2">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
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
              <span>${subtotal.toFixed(2)}</span>
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
    </div>
  );
};

export default Checkout; 