import React from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft, FaBoxOpen } from 'react-icons/fa';

const Cart = () => {
  const { cart, removeFromCart, updateCartItemQuantity } = useCart();
  const navigate = useNavigate();

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const deliveryFee = 5.00; // Fixed delivery fee

  const calculateTotal = () => {
    return (parseFloat(calculateSubtotal()) + deliveryFee).toFixed(2);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
        <FaBoxOpen className="text-6xl text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <button
          onClick={() => navigate('/restaurants')}
          className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 py-10 px-2">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <button onClick={() => navigate(-1)} className="text-red-600 hover:text-red-700 flex items-center font-medium">
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-center flex-grow text-gray-800">Your Cart</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Items</h2>
          <div className="space-y-6">
            {cart.map(item => (
              <div key={item.id} className="flex flex-row items-center justify-between gap-4 border-b pb-6 last:border-b-0 last:pb-0 flex-wrap">
                <div className="flex flex-row items-center gap-4 flex-1 min-w-0">
                  <img 
                    src={item.image || 'https://via.placeholder.com/100'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl border border-gray-100 shadow-sm flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">{item.name}</h3>
                    <p className="text-gray-500 text-sm">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  <div className="flex items-center border rounded-lg overflow-hidden bg-gray-50">
                    <button 
                      onClick={() => updateCartItemQuantity(item.id, -1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-200 focus:outline-none"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="px-4 py-1 font-semibold text-gray-700 bg-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartItemQuantity(item.id, 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-200 focus:outline-none"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                  <span className="font-semibold w-20 text-right text-gray-700">${(item.price * item.quantity).toFixed(2)}</span>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="ml-2 text-red-500 hover:text-red-700 p-2 rounded-full bg-red-50 hover:bg-red-100 transition"
                    title="Remove"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${calculateSubtotal()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-800">
              <span>Total</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition mb-2"
          >
            Proceed to Checkout
          </button>
          <p className="text-xs text-center text-gray-500 mt-2">NOTE: Checkout is disabled. This cart is for demonstration purposes only.</p>
        </div>
      </div>
    </div>
  );
};

export default Cart;