//name
//cuisine
//rating
//deliveryTime
//menuItems
//image
//isOpen
//location

const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery', {
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log('Connected to MongoDB');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const restaurants = [
    {
        name: 'Burger King',
        cuisine: 'Fast Food',
        rating: 4.2,
        deliveryTime: 25,
        menuItems: [],
        image: 'https://images.unsplash.com/photo-1716825340559-0242482f7dd1?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YnVyZ2VyJTIwa2luZ3xlbnwwfHwwfHx8MA%3D%3D',
        isOpen: true,
        isPopular: true,
        location: '123 Main St, Anytown, USA',
        promo: '20% off on Whoppers this weekend',
        minOrder: 10,
        deliveryFee: 2.99,
        tags: ['burgers', 'fast food', 'american']
    },
    {
        name: 'Pizza Hut',
        cuisine: 'Italian',
        rating: 4.5,
        deliveryTime: 35,
        menuItems: [],
        image: 'https://images.unsplash.com/photo-1620174645265-05820da4ff20?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGl6emElMjBodXR8ZW58MHx8MHx8fDA%3D',
        isOpen: true,
        isPopular: true,
        location: '456 Center Ave, Anytown, USA',
        promo: 'Buy 1 get 1 free on medium pizzas',
        minOrder: 15,
        deliveryFee: 1.99,
        tags: ['pizza', 'pasta', 'family style']
    },
    {
        name: 'Pasta Palace',
        cuisine: 'Italian',
        rating: 4.7,
        deliveryTime: 40,
        menuItems: [],
        image: 'https://media.istockphoto.com/id/185097705/photo/restaurant-in-italy.webp?a=1&b=1&s=612x612&w=0&k=20&c=gc-eCOxQBOJKrPsx0rgnvuQ23sSAbekHiFb51HzRTfg=',
        isOpen: true,
        isPopular: false,
        location: '789 Food Court, Anytown, USA',
        promo: 'Free garlic bread with orders over $25',
        minOrder: 20,
        deliveryFee: 3.50,
        tags: ['authentic', 'homemade pasta', 'fine dining']
    },
    {
        name: 'Sushi Zen',
        cuisine: 'Japanese',
        rating: 4.8,
        deliveryTime: 45,
        menuItems: [],
        image: 'https://images.unsplash.com/photo-1620505251384-af3c31f90ef9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHN1c2hpJTIwemVufGVufDB8fDB8fHww',
        isOpen: true,
        isPopular: false,
        location: '321 East St, Anytown, USA',
        promo: 'Free miso soup with every order',
        minOrder: 25,
        deliveryFee: 4.99,
        tags: ['sushi', 'fresh fish', 'japanese']
    },
    {
        name: 'Spice Route',
        cuisine: 'Indian',
        rating: 4.6,
        deliveryTime: 50,
        menuItems: [],
        image: 'https://images.unsplash.com/photo-1733622352160-8074a570af6c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHNwaWNlJTIwcm91dGUlMjByZXN0YXVyYW50fGVufDB8fDB8fHww',
        isOpen: true,
        isPopular: false,
        location: '654 Curry Lane, Anytown, USA',
        promo: '10% off on first order',
        minOrder: 15,
        deliveryFee: 2.50,
        tags: ['curry', 'tandoori', 'spicy']
    },
    {
        name: 'Smokehouse BBQ',
        cuisine: 'American',
        rating: 4.9,
        deliveryTime: 60,
        menuItems: [],
        image: 'https://media.istockphoto.com/id/1266656208/photo/cut-a-large-piece-of-smoked-beef-brisket-to-the-ribs-with-a-dark-crust-classic-texas-barbecue.webp?a=1&b=1&s=612x612&w=0&k=20&c=f1HYWLblpTcHeXcGIB73W5EdEGqvft2tiUK-4_qhjDQ=',
        isOpen: true,
        isPopular: true,
        location: '987 Grill Road, Anytown, USA',
        promo: 'Free coleslaw with rib orders',
        minOrder: 30,
        deliveryFee: 5.99,
        tags: ['barbecue', 'smoked meats', 'southern']
    },
    {
        name: 'Taco Fiesta',
        cuisine: 'Mexican',
        rating: 4.4,
        deliveryTime: 30,
        menuItems: [],
        image: 'https://media.istockphoto.com/id/1359023925/photo/food-stand-at-local-carnival-street-tacos-bubble-tea-elotes-en-vaso-mexican-corn-in-a-cup-and.webp?a=1&b=1&s=612x612&w=0&k=20&c=8sy2FmMnomyI08D65-I09S0HwWtMwXqXTIPWl-seGSY=',
        isOpen: true,
        isPopular: true,
        location: '159 South St, Anytown, USA',
        promo: 'Taco Tuesday - $1 tacos',
        minOrder: 12,
        deliveryFee: 1.99,
        tags: ['tacos', 'mexican', 'street food']
    },
    {
        name: 'Green Leaf',
        cuisine: 'Healthy',
        rating: 4.3,
        deliveryTime: 25,
        menuItems: [],
        image: 'https://plus.unsplash.com/premium_photo-1726837319660-1889970e8cf3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Z3JlZW4lMjBsZWFmJTIwcmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
        isOpen: true,
        isPopular: false,
        location: '753 Wellness Blvd, Anytown, USA',
        promo: 'Free detox juice with salad orders',
        minOrder: 15,
        deliveryFee: 2.99,
        tags: ['salads', 'organic', 'vegan options']
    },
    {
        name: 'Ocean Grill',
        cuisine: 'Seafood',
        rating: 4.7,
        deliveryTime: 45,
        menuItems: [],
        image: 'https://plus.unsplash.com/premium_photo-1675344317761-3ace7cf2362a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b2NlYW4lMjBncmlsbCUyMHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D',
        isOpen: true,
        isPopular: false,
        location: '357 Harbor View, Anytown, USA',
        promo: 'Lobster special - 2 for $50',
        minOrder: 25,
        deliveryFee: 4.50,
        tags: ['fresh seafood', 'grilled fish', 'oysters']
    }
];

async function seedRestaurants() {
  const connection = await connectDB();
  
  try {
    // Clear existing data
    await Restaurant.deleteMany({});
    console.log('Cleared existing restaurants');
    
    // Insert new data
    const createdRestaurants = await Restaurant.insertMany(restaurants);
    console.log(`Successfully seeded ${createdRestaurants.length} restaurants`);
    return createdRestaurants;
  } catch (error) {
    console.error('Error seeding restaurants:', error);
    throw error;
  } finally {
    // Only close the connection if this script is run directly
    if (process.argv[1].includes('seedRestaurants.js')) {
      await connection.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  seedRestaurants()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { restaurants, seedRestaurants };
