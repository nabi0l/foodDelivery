import React from 'react';
import '../styles/main.css';
import HeroSection from '../components/home/HeroSection';
import RestaurantCategories from '../components/home/RestaurantCategories';
import PopularRestaurants from '../components/home/PopularRestaurants';
import PromotionalOffers from '../components/home/PromotionalOffers';
import HowItWorks from '../components/home/HowItWorks';

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <RestaurantCategories />
      <PopularRestaurants />
      <PromotionalOffers />
      <HowItWorks />
    </div>
  );
};

export default Home;