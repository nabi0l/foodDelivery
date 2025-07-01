const mongoose = require('mongoose');
const PromoCode = require('../models/PromoCode');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery', {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const promoCodes = [
  {
    code: 'WELCOME20',
    description: 'Get 20% off on your first order with us!',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 15,
    maxDiscount: 10,
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Started 7 days ago
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
    isActive: true,
    usageLimit: 1000,
    usedCount: 0,
    applicableCategories: ['all'],
    applicableRestaurants: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: 'FREESHIP25',
    description: 'Free delivery on all orders over $25 - limited time offer!',
    discountType: 'fixed',
    discountValue: 5.99,
    minOrderAmount: 25,
    startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Started yesterday
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Expires in 14 days
    isActive: true,
    usageLimit: 500,
    usedCount: 0,
    applicableCategories: ['all'],
    applicableRestaurants: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: 'WEEKEND15',
    description: '15% off on weekends',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 20,
    maxDiscount: 15,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    isActive: true,
    usageLimit: 300,
    usedCount: 0,
    applicableCategories: ['all'],
    applicableRestaurants: [],
  },
  {
    code: 'BIRTHDAY',
    description: 'Special birthday discount',
    discountType: 'percentage',
    discountValue: 25,
    minOrderAmount: 30,
    maxDiscount: 20,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    isActive: true,
    usageLimit: 1,
    usedCount: 0,
    applicableCategories: ['all'],
    applicableRestaurants: [],
  },
  {
    code: 'LOYAL10',
    description: '10% off for loyal customers',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 15,
    maxDiscount: 10,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    isActive: true,
    usageLimit: 100,
    usedCount: 0,
    applicableCategories: ['all'],
    applicableRestaurants: [],
  },
];

async function seedPromoCodes() {
  const connection = await connectDB();
  
  try {
    // Clear existing data
    await PromoCode.deleteMany({});
    console.log('Cleared existing promo codes');
    
    // Insert new data
    const createdPromoCodes = await PromoCode.insertMany(promoCodes);
    console.log(`Successfully seeded ${createdPromoCodes.length} promo codes`);
    
    return createdPromoCodes;
  } catch (error) {
    console.error('Error seeding promo codes:', error);
    throw error;
  } finally {
    // Only close the connection if this script is run directly
    if (process.argv[1].includes('seedPromoCodes.js')) {
      await connection.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  seedPromoCodes()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { promoCodes, seedPromoCodes };
