import React from 'react';
import '../styles/main.css';
import HeroSection from '../components/home/HeroSection';
import RestaurantCategories from '../components/home/RestaurantCategories';
import PopularRestaurants from '../components/home/PopularRestaurants';
import SpecialOffers from '../components/home/SpecialOffers';
import HowItWorks from '../components/home/HowItWorks';

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <RestaurantCategories />
      <PopularRestaurants />
      <SpecialOffers />
      <HowItWorks />
    </div>
  );
};

export default Home;