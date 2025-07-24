import React, { useState, useEffect } from 'react';
import CartContext from './cartContext';

// Provider component
export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage if available
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        // Ensure the cart has the correct structure
        return {
          items: Array.isArray(parsed?.items) ? parsed.items : [],
          restaurantId: parsed?.restaurantId || null
        };
      }
      return { items: [], restaurantId: null };
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      return { items: [], restaurantId: null };
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  const addToCart = (item, restaurantId) => {
    if (!restaurantId && (!item || !item.restaurantId)) {
      console.error('Cannot add to cart: No restaurant ID provided');
      return;
    }

    const targetRestaurantId = restaurantId || item.restaurantId;
    
    setCart(prevCart => {
      // Ensure prevCart has the expected structure
      const safeCart = {
        items: Array.isArray(prevCart?.items) ? prevCart.items : [],
        restaurantId: prevCart?.restaurantId || null
      };
      
      // If adding to an empty cart or same restaurant
      if (!safeCart.restaurantId || safeCart.restaurantId === targetRestaurantId) {
        const existingItem = safeCart.items.find(cartItem => cartItem.id === item.id);
        
        const updatedItems = existingItem
          ? safeCart.items.map(cartItem =>
              cartItem.id === item.id
                ? { 
                    ...cartItem, 
                    quantity: cartItem.quantity + (item.quantity || 1),
                    restaurantId: targetRestaurantId // Ensure restaurantId is set on items
                  }
                : cartItem
            )
          : [
              ...safeCart.items, 
              { 
                ...item, 
                quantity: item.quantity || 1,
                restaurantId: targetRestaurantId // Ensure restaurantId is set on new items
              }
            ];
        
        return {
          items: updatedItems,
          restaurantId: targetRestaurantId
        };
      } else {
        // If trying to add from a different restaurant, ask user to clear cart first
        if (window.confirm('Your cart contains items from another restaurant. Would you like to clear your cart and add this item?')) {
          return {
            items: [{ 
              ...item, 
              quantity: item.quantity || 1,
              restaurantId: targetRestaurantId 
            }],
            restaurantId: targetRestaurantId
          };
        }
        return prevCart; // Keep the existing cart if user cancels
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.id !== itemId);
      return {
        ...prevCart,
        items: updatedItems,
        restaurantId: updatedItems.length > 0 ? prevCart.restaurantId : null
      };
    });
  };

  const updateCartItemQuantity = (itemId, change) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    }));
  };

  const clearCart = () => {
    setCart({ items: [], restaurantId: null });
    localStorage.removeItem('cart');
  };

  const value = {
    cart: cart.items || [],
    restaurantId: cart.restaurantId,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
