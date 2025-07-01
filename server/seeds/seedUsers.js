const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
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

// Sample users data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123', // Will be hashed
    phone: '+1234567890',
    address: '123 Admin St, Admin City',
    role: 'admin',
    isVerified: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123', // Will be hashed
    phone: '+1987654321',
    address: '456 User Ave, User City',
    role: 'user',
    isVerified: true,
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123', // Will be hashed
    phone: '+1122334455',
    address: '789 Customer Rd, Customer Town',
    role: 'user',
    isVerified: true,
  },
  {
    name: 'Restaurant Owner',
    email: 'owner@example.com',
    password: 'owner123', // Will be hashed
    phone: '+1555666777',
    address: '101 Business Blvd, Business City',
    role: 'restaurant_owner',
    isVerified: true,
  },
];

async function seedUsers() {
  const connection = await connectDB();
  
  try {
    // Clear existing data
    await User.deleteMany({});
    console.log('Cleared existing users');
    
    // Hash passwords
    const saltRounds = 10;
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );
    
    // Insert new data
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`Successfully seeded ${createdUsers.length} users`);
    
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  } finally {
    // Only close the connection if this script is run directly
    if (process.argv[1].includes('seedUsers.js')) {
      await connection.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  seedUsers()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { users, seedUsers };