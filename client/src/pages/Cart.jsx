import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';

const Cart = () => {
  const { cart, removeFromCart, updateCartItemQuantity } = useCart();
  const navigate = useNavigate();

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const deliveryFee = 5.00; // Example delivery fee

  const calculateTotal = () => {
    return (parseFloat(calculateSubtotal()) + deliveryFee).toFixed(2);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="text-red-600 hover:text-red-700 flex items-center">
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-center flex-grow">Your Shopping Cart</h1>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <img 
                    src={item.image || 'https://via.placeholder.com/100'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-500 text-sm">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center border rounded-lg">
                    <button 
                      onClick={() => updateCartItemQuantity(item.id, -1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="px-4 py-1">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartItemQuantity(item.id, 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                  <p className="font-semibold w-24 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-6 border-t pt-6">
            <div className="flex justify-end">
              <div className="w-full max-w-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${calculateSubtotal()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
                <button 
                  disabled
                  title="Checkout functionality is temporarily disabled"
                  className="w-full bg-gray-400 text-white py-3 mt-4 rounded-lg font-semibold cursor-not-allowed"
                >
                  Proceed to Checkout
                </button>
                 <p className="text-xs text-center text-gray-500 mt-2">NOTE: Checkout is disabled. This cart is for demonstration purposes only.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;