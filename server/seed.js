const mongoose = require('mongoose');
require('dotenv').config();

// Import seed functions
const { seedRestaurants } = require('./seeds/seedRestaurants');
const { seedMenuItems } = require('./seeds/seedMenuItems');
const { seedPromoCodes } = require('./seeds/seedPromoCodes');
const { seedUsers } = require('./seeds/seedUsers');

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

// Main seeding function
async function seedDatabase() {
  console.log('🚀 Starting database seeding process...');
  const connection = await connectDB();
  
  try {
    // Run seeds in order
    console.log('\n🌱 Seeding restaurants...');
    const restaurants = await seedRestaurants();
    console.log(`✅ Seeded ${restaurants.length} restaurants`);
    
    console.log('\n🍽️  Seeding menu items...');
    const menuItems = await seedMenuItems();
    console.log(`✅ Seeded ${menuItems.length} menu items`);
    
    console.log('\n🎟️  Seeding promo codes...');
    const promoCodes = await seedPromoCodes();
    console.log(`✅ Seeded ${promoCodes.length} promo codes`);
    
    console.log('\n👥 Seeding users...');
    const users = await seedUsers();
    console.log(`✅ Seeded ${users.length} users`);
    
    console.log('\n✨ All seeds completed successfully!');
    return {
      restaurants: restaurants.length,
      menuItems: menuItems.length,
      promoCodes: promoCodes.length,
      users: users.length
    };
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    throw error;
  } finally {
    await connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then((results) => {
      console.log('\n📊 Seeding Summary:');
      console.log(`- Restaurants: ${results.restaurants}`);
      console.log(`- Menu Items: ${results.menuItems}`);
      console.log(`- Promo Codes: ${results.promoCodes}`);
      console.log(`- Users: ${results.users}`);
      console.log('\n🎉 Database seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Database seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
