import React from 'react';
import Checkout from '../components/Checkout';

const CheckoutPage = () => {
  // The Checkout component now gets cart data directly from the CartContext
  return <Checkout />;
};

export default CheckoutPage;