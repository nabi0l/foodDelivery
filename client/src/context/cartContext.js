import { createContext } from 'react';

// Separate file for the context to avoid Fast Refresh issues
const CartContext = createContext();

export default CartContext;
