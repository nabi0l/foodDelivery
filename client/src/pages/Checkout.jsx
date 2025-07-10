import React from 'react';
import Checkout from '../components/Checkout';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const { cart } = useCart();
  return <Checkout cart={cart} />;
};

export default CheckoutPage;