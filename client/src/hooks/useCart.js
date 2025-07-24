import { useContext } from 'react';
import CartContext from '../context/cartContext';

// Custom hook for using cart context
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default useCart;
