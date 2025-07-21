const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
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

async function getRestaurantIds() {
  const connection = await connectDB();
  
  try {
    const restaurants = await Restaurant.find({});
    
    console.log('\n=== Restaurant IDs ===');
    restaurants.forEach(restaurant => {
      console.log(`Name: ${restaurant.name}`);
      console.log(`ID: ${restaurant._id}`);
      console.log('---');
    });
    
    return restaurants;
  } catch (error) {
    console.error('Error getting restaurant IDs:', error);
  } finally {
    await connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  getRestaurantIds()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = getRestaurantIds;
