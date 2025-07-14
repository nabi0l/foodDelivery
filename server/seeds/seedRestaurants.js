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
  // USA Restaurants (4)
  {
      name: 'Burger King',
      cuisine: 'Fast Food',
      rating: 4.2,
      deliveryTime: 25,
      menuItems: [],
      image: 'https://images.unsplash.com/photo-1716825340559-0242482f7dd1?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YnVyZ2VyJTIwa2luZ3xlbnwwfHwwfHx8MA%3D%3D',
      isOpen: true,
      isPopular: true,
      location: '123 Main St, New York, USA',
      country: 'USA',
      promo: '20% off on Whoppers this weekend',
      minOrder: 10,
      deliveryFee: 2.99,
      tags: ['burgers', 'fast food', 'american']
  },
  {
      name: 'Smokehouse BBQ',
      cuisine: 'American',
      rating: 4.9,
      deliveryTime: 60,
      menuItems: [],
      image: 'https://www.shutterstock.com/shutterstock/photos/2344596997/display_1500/stock-vector-barbeque-smokehouse-bbq-barbecue-bar-and-grill-logo-design-with-fork-and-fire-2344596997.jpg',
      isOpen: true,
      isPopular: true,
      location: '987 Grill Road, Austin, USA',
      country: 'USA',
      promo: 'Free coleslaw with rib orders',
      minOrder: 30,
      deliveryFee: 5.99,
      tags: ['barbecue', 'smoked meats', 'southern']
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
      location: '357 Harbor View, Seattle, USA',
      country: 'USA',
      promo: 'Lobster special - 2 for $50',
      minOrder: 25,
      deliveryFee: 4.50,
      tags: ['fresh seafood', 'grilled fish', 'oysters']
  },
  {
      name: 'Taco Fiesta',
      cuisine: 'Mexican',
      rating: 4.4,
      deliveryTime: 30,
      menuItems: [],
      image: 'https://media.istockphoto.com/id/1359023925/photo/food-stand-at-local-carnival-street-tacos-bubble-tea-elotes-en-vaso-mexican-corn-in-a-cup-and.webp',
      isOpen: true,
      isPopular: true,
      location: '159 South St, Los Angeles, USA',
      country: 'USA',
      promo: 'Taco Tuesday - $1 tacos',
      minOrder: 12,
      deliveryFee: 1.99,
      tags: ['tacos', 'mexican', 'street food']
  },

  // Ethiopia Restaurants (4)
  {
      name: 'Habesha Restaurant',
      cuisine: 'Ethiopian',
      rating: 4.8,
      deliveryTime: 40,
      menuItems: [],
      image: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXRoaW9waWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D',
      isOpen: true,
      isPopular: true,
      location: 'Bole Road, Addis Ababa, Ethiopia',
      country: 'Ethiopia',
      promo: 'Free traditional coffee with orders over 200 birr',
      minOrder: 150,
      deliveryFee: 25,
      tags: ['injera', 'traditional', 'coffee ceremony']
  },
  {
      name: 'Yod Abyssinia',
      cuisine: 'Ethiopian',
      rating: 4.7,
      deliveryTime: 45,
      menuItems: [],
      image: 'https://media.istockphoto.com/id/1457979959/photo/ethiopian-traditional-food-injera-with-meat-and-vegetable.webp',
      isOpen: true,
      isPopular: false,
      location: 'Kazanchis, Addis Ababa, Ethiopia',
      country: 'Ethiopia',
      promo: 'Cultural dinner show on weekends',
      minOrder: 180,
      deliveryFee: 30,
      tags: ['cultural', 'live music', 'traditional']
  },
  {
      name: 'Kategna Restaurant',
      cuisine: 'Ethiopian',
      rating: 4.5,
      deliveryTime: 35,
      menuItems: [],
      image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZXRoaW9waWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D',
      isOpen: true,
      isPopular: true,
      location: 'Sarbet, Addis Ababa, Ethiopia',
      country: 'Ethiopia',
      promo: '10% off on fasting days',
      minOrder: 120,
      deliveryFee: 20,
      tags: ['fasting food', 'vegetarian', 'traditional']
  },
  {
      name: 'Lucy Lounge',
      cuisine: 'International',
      rating: 4.6,
      deliveryTime: 50,
      menuItems: [],
      image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdGF1cmFudCUyMGludGVyaW9yfGVufDB8fDB8fHww',
      isOpen: true,
      isPopular: false,
      location: 'Old Airport, Addis Ababa, Ethiopia',
      country: 'Ethiopia',
      promo: 'Happy hour 5-7PM daily',
      minOrder: 200,
      deliveryFee: 35,
      tags: ['bar', 'international', 'fusion']
  },

  // Italy Restaurants (4)
  {
      name: 'Trattoria Romana',
      cuisine: 'Italian',
      rating: 4.9,
      deliveryTime: 40,
      menuItems: [],
      image: 'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXRhbGlhbiUyMHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D',
      isOpen: true,
      isPopular: true,
      location: 'Via del Corso, Rome, Italy',
      country: 'Italy',
      promo: 'Authentic Roman pasta dishes',
      minOrder: 25,
      deliveryFee: 3.50,
      tags: ['pasta', 'roman', 'authentic']
  },
  {
      name: 'Pizza Napoletana',
      cuisine: 'Italian',
      rating: 4.8,
      deliveryTime: 35,
      menuItems: [],
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmFwbGVzJTIwcGl6emF8ZW58MHx8MHx8fDA%3D',
      isOpen: true,
      isPopular: true,
      location: 'Via Toledo, Naples, Italy',
      country: 'Italy',
      promo: 'Wood-fired oven pizza',
      minOrder: 20,
      deliveryFee: 2.50,
      tags: ['pizza', 'neapolitan', 'traditional']
  },
  {
      name: 'Gelateria Fiorentina',
      cuisine: 'Dessert',
      rating: 4.7,
      deliveryTime: 25,
      menuItems: [],
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2VsYXRvfGVufDB8fDB8fHww',
      isOpen: true,
      isPopular: false,
      location: 'Piazza del Duomo, Florence, Italy',
      country: 'Italy',
      promo: '2 scoops for the price of 1',
      minOrder: 10,
      deliveryFee: 1.50,
      tags: ['gelato', 'dessert', 'ice cream']
  },
  {
      name: 'Ristorante Venezia',
      cuisine: 'Italian',
      rating: 4.6,
      deliveryTime: 45,
      menuItems: [],
      image: 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dmVuaWNlJTIwcmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
      isOpen: true,
      isPopular: false,
      location: 'Canal Grande, Venice, Italy',
      country: 'Italy',
      promo: 'Seafood specials daily',
      minOrder: 30,
      deliveryFee: 4.00,
      tags: ['seafood', 'venetian', 'canal view']
  },

  // India Restaurants (4)
  {
      name: 'Spice Route',
      cuisine: 'Indian',
      rating: 4.6,
      deliveryTime: 50,
      menuItems: [],
      image: 'https://images.unsplash.com/photo-1733622352160-8074a570af6c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHNwaWNlJTIwcm91dGUlMjByZXN0YXVyYW50fGVufDB8fDB8fHww',
      isOpen: true,
      isPopular: false,
      location: 'Connaught Place, New Delhi, India',
      country: 'India',
      promo: '10% off on first order',
      minOrder: 500,
      deliveryFee: 40,
      tags: ['curry', 'tandoori', 'spicy']
  },
  {
      name: 'Bombay Brasserie',
      cuisine: 'Indian',
      rating: 4.8,
      deliveryTime: 45,
      menuItems: [],
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9tYmF5JTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D',
      isOpen: true,
      isPopular: true,
      location: 'Colaba, Mumbai, India',
      country: 'India',
      promo: 'Street food platter special',
      minOrder: 600,
      deliveryFee: 50,
      tags: ['street food', 'mumbai', 'chaat']
  },
  {
      name: 'Dum Pukht',
      cuisine: 'Indian',
      rating: 4.9,
      deliveryTime: 60,
      menuItems: [],
      image: 'https://media.istockphoto.com/id/1316145932/photo/dum-biryani.webp',
      isOpen: true,
      isPopular: true,
      location: 'ITC Maurya, New Delhi, India',
      country: 'India',
      promo: 'Royal dining experience',
      minOrder: 800,
      deliveryFee: 60,
      tags: ['royal', 'biryani', 'awadhi']
  },
  {
      name: 'Paradise Biryani',
      cuisine: 'Indian',
      rating: 4.5,
      deliveryTime: 40,
      menuItems: [],
      image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHlkZXJhYmFkJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D',
      isOpen: true,
      isPopular: false,
      location: 'Secunderabad, Hyderabad, India',
      country: 'India',
      promo: 'Famous Hyderabadi biryani',
      minOrder: 400,
      deliveryFee: 30,
      tags: ['biryani', 'hyderabadi', 'spicy']
  },

  // Japan Restaurants (4)
  {
      name: 'Sushi Zen',
      cuisine: 'Japanese',
      rating: 4.8,
      deliveryTime: 45,
      menuItems: [],
      image: 'https://images.unsplash.com/photo-1620505251384-af3c31f90ef9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHN1c2hpJTIwemVufGVufDB8fDB8fHww',
      isOpen: true,
      isPopular: false,
      location: 'Ginza, Tokyo, Japan',
      country: 'Japan',
      promo: 'Free miso soup with every order',
      minOrder: 3000,
      deliveryFee: 500,
      tags: ['sushi', 'fresh fish', 'japanese']
  },
  {
      name: 'Ramen Street',
      cuisine: 'Japanese',
      rating: 4.7,
      deliveryTime: 30,
      menuItems: [],
      image: 'https://images.unsplash.com/photo-1617093727343-374698b1b188?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFtZW58ZW58MHx8MHx8fDA%3D',
      isOpen: true,
      isPopular: true,
      location: 'Shinjuku, Tokyo, Japan',
      country: 'Japan',
      promo: 'Late night ramen special',
      minOrder: 2000,
      deliveryFee: 300,
      tags: ['ramen', 'noodles', 'comfort food']
  },
  {
      name: 'Izakaya Torii',
      cuisine: 'Japanese',
      rating: 4.6,
      deliveryTime: 40,
      menuItems: [],
      image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXpha2F5YXxlbnwwfHwwfHx8MA%3D%3D',
      isOpen: true,
      isPopular: false,
      location: 'Shibuya, Tokyo, Japan',
      country: 'Japan',
      promo: 'Happy hour 5-7PM',
      minOrder: 2500,
      deliveryFee: 400,
      tags: ['izakaya', 'small plates', 'sake']
  },
  {
      name: 'Okonomiyaki House',
      cuisine: 'Japanese',
      rating: 4.5,
      deliveryTime: 35,
      menuItems: [],
      image: 'https://images.unsplash.com/photo-1630918326546-963661764a4e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b2tvbm9taXlha2l8ZW58MHx8MHx8fDA%3D',
      isOpen: true,
      isPopular: true,
      location: 'Osaka, Japan',
      country: 'Japan',
      promo: 'Osaka-style savory pancakes',
      minOrder: 1800,
      deliveryFee: 350,
      tags: ['okonomiyaki', 'osaka', 'savory']
  },

  // Mexico Restaurants (4)
  {
      name: 'Taqueria El Pastor',
      cuisine: 'Mexican',
      rating: 4.7,
      deliveryTime: 25,
      menuItems: [],
      image: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGFjb3N8ZW58MHx8MHx8fDA%3D',
      isOpen: true,
      isPopular: true,
      location: 'Condesa, Mexico City, Mexico',
      country: 'Mexico',
      promo: 'Al pastor tacos special',
      minOrder: 150,
      deliveryFee: 30,
      tags: ['tacos', 'street food', 'authentic']
  },
  {
      name: 'La Casa de las Enchiladas',
      cuisine: 'Mexican',
      rating: 4.6,
      deliveryTime: 30,
      menuItems: [],
      image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZW5jaGlsYWRhc3xlbnwwfHwwfHx8MA%3D%3D',
      isOpen: true,
      isPopular: false,
      location: 'Roma Norte, Mexico City, Mexico',
      country: 'Mexico',
      promo: 'Mole enchiladas special',
      minOrder: 200,
      deliveryFee: 35,
      tags: ['enchiladas', 'mole', 'traditional']
  },
  {
      name: 'Mariscos Jalisco',
      cuisine: 'Mexican',
      rating: 4.8,
      deliveryTime: 40,
      menuItems: [],
      image: 'https://images.unsplash.com/photo-1601050690117-94b5b7e50a63?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFyaXNjb3N8ZW58MHx8MHx8fDA%3D',
      isOpen: true,
      isPopular: true,
      location: 'Guadalajara, Jalisco, Mexico',
      country: 'Mexico',
      promo: 'Shrimp tacos special',
      minOrder: 250,
      deliveryFee: 40,
      tags: ['seafood', 'shrimp', 'coastal']
  },
  {
      name: 'Pujol',
      cuisine: 'Mexican',
      rating: 4.9,
      deliveryTime: 60,
      menuItems: [],
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWV4aWNhbiUyMGdvdXJtZXR8ZW58MHx8MHx8fDA%3D',
      isOpen: true,
      isPopular: false,
      location: 'Polanco, Mexico City, Mexico',
      country: 'Mexico',
      promo: 'Modern Mexican cuisine',
      minOrder: 500,
      deliveryFee: 60,
      tags: ['gourmet', 'modern', 'fine dining']
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
