const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
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

// Menu items data with restaurant names
const menuItems = [
  // ==================== USA RESTAURANTS ====================
  // Burger King
  {
    name: 'Whopper',
    description: 'Signature burger with 1/4 lb flame-grilled beef, tomatoes, lettuce, mayo, pickles, and onions',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90',
    restaurant: 'Burger King',
    category: 'Burgers',
    tags: ['signature', 'beef', 'burger'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Customization',
        isMultiSelect: true,
        options: [
          { name: 'Add Cheese', price: 1.00 },
          { name: 'Add Bacon', price: 1.50 }
        ]
      }
    ]
  },
  {
    name: 'Chicken Fries',
    description: 'Crispy chicken strips shaped like fries with dipping sauce',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330',
    restaurant: 'Burger King',
    category: 'Sides',
    tags: ['chicken', 'appetizer'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Dipping Sauce',
        isMultiSelect: false,
        options: [
          { name: 'BBQ', price: 0 },
          { name: 'Ranch', price: 0 },
          { name: 'Honey Mustard', price: 0 }
        ]
      }
    ]
  },
  {
    name: 'Bacon King',
    description: 'Two 1/4 lb beef patties, thick-cut smoked bacon, melted cheese, ketchup and mayo',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b',
    restaurant: 'Burger King',
    category: 'Burgers',
    tags: ['bacon', 'double', 'signature'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },

  // Smokehouse BBQ
  {
    name: 'BBQ Ribs Platter',
    description: 'Slow-smoked pork ribs with signature BBQ sauce and two sides',
    price: 22.99,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
    restaurant: 'Smokehouse BBQ',
    category: 'Mains',
    tags: ['pork', 'bbq', 'signature'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Sides',
        isMultiSelect: true,
        options: [
          { name: 'Coleslaw', price: 0.50 },
          { name: 'Baked Beans', price: 0 },
          { name: 'Mac & Cheese', price: 1.50 }
        ]
      }
    ]
  },
  {
    name: 'Pulled Pork Sandwich',
    description: 'Tender pulled pork with coleslaw on a brioche bun',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1611273426858-450d0e7b9d42',
    restaurant: 'Smokehouse BBQ',
    category: 'Sandwiches',
    tags: ['pork', 'sandwich'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Brisket Plate',
    description: 'Slow-smoked beef brisket with two sides',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b',
    restaurant: 'Smokehouse BBQ',
    category: 'Mains',
    tags: ['beef', 'smoked', 'signature'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast'],
    popularFilters: ['promo', 'new']
  },

  // Ocean Grill
  {
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon grilled to perfection with herbs and lemon',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
    restaurant: 'Ocean Grill',
    category: 'Seafood',
    tags: ['salmon', 'seafood', 'grilled'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Preparation',
        isMultiSelect: false,
        options: [
          { name: 'Medium Rare', price: 1.00 },
          { name: 'Medium', price: 1.50 },
          { name: 'Well Done', price: 2.50 }
        ]
      }
    ]
  },
  {
    name: 'Lobster Roll',
    description: 'Buttery lobster meat served on a toasted brioche roll',
    price: 28.99,
    image: 'https://images.unsplash.com/photo-1561758033-7e924f619b47',
    restaurant: 'Ocean Grill',
    category: 'Seafood',
    tags: ['lobster', 'premium'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Clam Chowder',
    description: 'Creamy New England style soup with clams and potatoes',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    restaurant: 'Ocean Grill',
    category: 'Soup',
    tags: ['clam', 'creamy'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },

  // ==================== ETHIOPIA RESTAURANTS ====================
  // Habesha Restaurant
  {
    name: 'Doro Wat',
    description: 'Spicy chicken stew with berbere spice, served with injera',
    price: 280,
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143',
    restaurant: 'Habesha Restaurant',
    category: 'Traditional',
    tags: ['chicken', 'spicy', 'signature'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Spice Level',
        isMultiSelect: false,
        options: [
          { name: 'Mild', price: 1.00 },
          { name: 'Medium', price: 1.50 },
          { name: 'Extra Spicy', price: 2.50 }
        ]
      }
    ]
  },
  {
    name: 'Vegetarian Platter',
    description: 'Assortment of 5 lentil and vegetable dishes with injera',
    price: 220,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    restaurant: 'Habesha Restaurant',
    category: 'Vegetarian',
    tags: ['vegan', 'lentils', 'fasting'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Shiro',
    description: 'Chickpea flour stew with garlic, ginger and berbere spice',
    price: 190,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    restaurant: 'Habesha Restaurant',
    category: 'Stews',
    tags: ['chickpea', 'vegan'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },

  // Yod Abyssinia
  {
    name: 'Kitfo',
    description: 'Traditional minced raw beef seasoned with mitmita spice',
    price: 320,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
    restaurant: 'Yod Abyssinia',
    category: 'Specialty',
    tags: ['beef', 'raw', 'traditional'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Preparation',
        isMultiSelect: false,
        options: [
          { name: 'Raw (Traditional)', price: 1.00 },
          { name: 'Lightly Cooked', price: 1.50 }
        ]
      }
    ]
  },
  {
    name: 'Tibs',
    description: 'Sautéed beef cubes with onions, peppers and rosemary',
    price: 290,
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143',
    restaurant: 'Yod Abyssinia',
    category: 'Traditional',
    tags: ['beef', 'sautéed'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Tej',
    description: 'Traditional Ethiopian honey wine',
    price: 150,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    restaurant: 'Yod Abyssinia',
    category: 'Beverages',
    tags: ['alcoholic', 'honey'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },

  // Kategna Restaurant
  {
    name: 'Fasting Platter',
    description: 'Selection of vegan dishes perfect for fasting days',
    price: 240,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    restaurant: 'Kategna Restaurant',
    category: 'Vegetarian',
    tags: ['vegan', 'fasting'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Misir Wat',
    description: 'Spicy red lentil stew with berbere spice',
    price: 180,
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143',
    restaurant: 'Kategna Restaurant',
    category: 'Stews',
    tags: ['lentils', 'spicy'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Gomen',
    description: 'Collard greens cooked with onions, garlic and spices',
    price: 160,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
    restaurant: 'Kategna Restaurant',
    category: 'Vegetables',
    tags: ['greens', 'healthy'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },

  // Lucy Lounge
  {
    name: 'Fusion Tibs',
    description: 'Beef tibs with a modern twist, served with roasted vegetables',
    price: 300,
    image: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d',
    restaurant: 'Lucy Lounge',
    category: 'Fusion',
    tags: ['beef', 'modern'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Avocado Salad',
    description: 'Fresh salad with avocado, tomatoes and lime dressing',
    price: 200,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1',
    restaurant: 'Lucy Lounge',
    category: 'Salads',
    tags: ['avocado', 'healthy'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Ethiopian Coffee',
    description: 'Traditional coffee ceremony brew',
    price: 80,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    restaurant: 'Lucy Lounge',
    category: 'Beverages',
    tags: ['coffee', 'traditional'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast'],
    popularFilters: ['rating', 'new']
  },

  // ==================== ITALY RESTAURANTS ====================
  // Trattoria Romana
  {
    name: 'Cacio e Pepe',
    description: 'Classic Roman pasta with pecorino cheese and black pepper',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1592861956120-e524fc739696',
    restaurant: 'Trattoria Romana',
    category: 'Pasta',
    tags: ['vegetarian', 'traditional'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Spaghetti Carbonara',
    description: 'Pasta with eggs, cheese, pancetta, and black pepper',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141',
    restaurant: 'Trattoria Romana',
    category: 'Pasta',
    tags: ['creamy', 'classic'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9',
    restaurant: 'Trattoria Romana',
    category: 'Dessert',
    tags: ['coffee', 'sweet'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },

  // Pizza Napoletana
  {
    name: 'Margherita Pizza',
    description: 'Classic Neapolitan pizza with tomato, mozzarella and basil',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3',
    restaurant: 'Pizza Napoletana',
    category: 'Pizza',
    tags: ['vegetarian', 'traditional'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Diavola Pizza',
    description: 'Spicy pizza with tomato, mozzarella and spicy salami',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3',
    restaurant: 'Pizza Napoletana',
    category: 'Pizza',
    tags: ['spicy', 'meat'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Calzone',
    description: 'Folded pizza stuffed with ricotta, mozzarella and ham',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9',
    restaurant: 'Pizza Napoletana',
    category: 'Pizza',
    tags: ['stuffed', 'hearty'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },

  // Gelateria Fiorentina
  {
    name: 'Gelato Classico',
    description: 'Traditional Italian gelato in various flavors',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    restaurant: 'Gelateria Fiorentina',
    category: 'Dessert',
    tags: ['ice cream', 'sweet'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Flavor',
        isMultiSelect: false,
        options: [
          { name: 'Vanilla', price: 1.00 },
          { name: 'Chocolate', price: 1.50 },
          { name: 'Strawberry', price: 2.50 }
        ]
      }
    ]
  },
  {
    name: 'Affogato',
    description: 'Vanilla gelato "drowned" with a shot of hot espresso',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1570654621852-9dd25dfa9b4d',
    restaurant: 'Gelateria Fiorentina',
    category: 'Dessert',
    tags: ['coffee', 'gelato'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Sorbetto',
    description: 'Dairy-free fruit sorbet',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141',
    restaurant: 'Gelateria Fiorentina',
    category: 'Dessert',
    tags: ['vegan', 'fruit'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },

  // Ristorante Venezia
  {
    name: 'Risotto al Nero di Seppia',
    description: 'Squid ink risotto with seafood',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d',
    restaurant: 'Ristorante Venezia',
    category: 'Rice',
    tags: ['seafood', 'venetian'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Fritto Misto',
    description: 'Mixed fried seafood with seasonal vegetables',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9',
    restaurant: 'Ristorante Venezia',
    category: 'Appetizer',
    tags: ['fried', 'seafood'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Tiramisu Veneziano',
    description: 'Venetian-style tiramisu with mascarpone cream',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9',
    restaurant: 'Ristorante Venezia',
    category: 'Dessert',
    tags: ['coffee', 'cream'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast'],
    popularFilters: ['rating', 'promo']
  },

  // ==================== INDIA RESTAURANTS ====================
  // Spice Route
  {
    name: 'Butter Chicken',
    description: 'Tandoori chicken in rich tomato and butter sauce',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398',
    restaurant: 'Spice Route',
    category: 'Curry',
    tags: ['chicken', 'creamy'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Spice Level',
        isMultiSelect: false,
        options: [
          { name: 'Mild', price: 1.00 },
          { name: 'Medium', price: 1.50 },
          { name: 'Hot', price: 2.50 }
        ]
      }
    ]
  },
  {
    name: 'Lamb Rogan Josh',
    description: 'Aromatic lamb curry with Kashmiri spices',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
    restaurant: 'Spice Route',
    category: 'Curry',
    tags: ['lamb', 'spicy'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Garlic Naan',
    description: 'Traditional leavened bread with garlic butter',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a',
    restaurant: 'Spice Route',
    category: 'Bread',
    tags: ['garlic', 'side'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },

  // Bombay Brasserie
  {
    name: 'Pani Puri',
    description: 'Crisp hollow puri filled with spiced water and chutneys',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950',
    restaurant: 'Bombay Brasserie',
    category: 'Street Food',
    tags: ['snack', 'vegetarian'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Chicken Tikka Masala',
    description: 'Grilled chicken chunks in spiced curry sauce',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398',
    restaurant: 'Bombay Brasserie',
    category: 'Curry',
    tags: ['chicken', 'creamy'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Mango Lassi',
    description: 'Sweet yogurt drink with mango pulp',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1601050690117-94b5b7e50a63',
    restaurant: 'Bombay Brasserie',
    category: 'Beverage',
    tags: ['sweet', 'refreshing'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },

  // Dum Pukht
  {
    name: 'Dum Biryani',
    description: 'Slow-cooked aromatic rice with meat and spices',
    price: 22.99,
    image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a',
    restaurant: 'Dum Pukht',
    category: 'Rice',
    tags: ['fragrant', 'hearty'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Meat Choice',
        isMultiSelect: false,
        options: [
          { name: 'Chicken', price: 1.00 },
          { name: 'Lamb', price: 3.00 }
        ]
      }
    ]
  },
  {
    name: 'Nalli Nihari',
    description: 'Slow-cooked lamb shank in rich gravy',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
    restaurant: 'Dum Pukht',
    category: 'Curry',
    tags: ['lamb', 'slow-cooked'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Sheermal',
    description: 'Saffron-infused sweet bread',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950',
    restaurant: 'Dum Pukht',
    category: 'Bread',
    tags: ['sweet', 'saffron'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },

  // Paradise Biryani
  {
    name: 'Hyderabadi Biryani',
    description: 'Fragrant basmati rice with meat and spices, cooked "dum" style',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a',
    restaurant: 'Paradise Biryani',
    category: 'Rice',
    tags: ['signature', 'spicy'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Haleem',
    description: 'Slow-cooked wheat and meat porridge with spices',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
    restaurant: 'Paradise Biryani',
    category: 'Stew',
    tags: ['hearty', 'traditional'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Double Ka Meetha',
    description: 'Bread pudding dessert with dry fruits',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1601050690117-94b5b7e50a63',
    restaurant: 'Paradise Biryani',
    category: 'Dessert',
    tags: ['sweet', 'bread'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast'],
    popularFilters: ['rating', 'discount']
  },

  // ==================== JAPAN RESTAURANTS ====================
  // Sushi Zen
  {
    name: 'Sashimi Platter',
    description: 'Assortment of fresh raw fish slices',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
    restaurant: 'Sushi Zen',
    category: 'Sashimi',
    tags: ['raw', 'fresh', 'premium'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Fish Selection',
        isMultiSelect: true,
        options: [
          { name: 'Salmon', price: 1.00 },
          { name: 'Tuna', price: 2.00 },
          { name: 'Yellowtail', price: 2.00 }
        ]
      }
    ]
  },
  {
    name: 'Dragon Roll',
    description: 'Eel and cucumber inside with avocado on top',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    restaurant: 'Sushi Zen',
    category: 'Specialty Roll',
    tags: ['eel', 'avocado'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Miso Soup',
    description: 'Traditional Japanese soup with tofu and seaweed',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1',
    restaurant: 'Sushi Zen',
    category: 'Soup',
    tags: ['tofu', 'light'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },

  // Ramen Street
  {
    name: 'Tonkotsu Ramen',
    description: 'Rich pork bone broth with noodles, chashu pork and egg',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b188',
    restaurant: 'Ramen Street',
    category: 'Noodles',
    tags: ['pork', 'hearty'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Shoyu Ramen',
    description: 'Soy sauce-based broth with chicken and vegetables',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141',
    restaurant: 'Ramen Street',
    category: 'Noodles',
    tags: ['chicken', 'soy'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Gyoza',
    description: 'Japanese pan-fried dumplings with pork filling',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9',
    restaurant: 'Ramen Street',
    category: 'Appetizer',
    tags: ['dumplings', 'pork'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },

  // Izakaya Torii
  {
    name: 'Yakitori Platter',
    description: 'Assorted grilled chicken skewers with tare sauce',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e',
    restaurant: 'Izakaya Torii',
    category: 'Grilled',
    tags: ['chicken', 'skewers'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Agedashi Tofu',
    description: 'Fried tofu in dashi broth with grated daikon',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1',
    restaurant: 'Izakaya Torii',
    category: 'Appetizer',
    tags: ['tofu', 'vegetarian'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Sake',
    description: 'Japanese rice wine',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e',
    restaurant: 'Izakaya Torii',
    category: 'Alcohol',
    tags: ['sake', 'rice wine'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Type',
        isMultiSelect: false,
        options: [
          { name: 'Junmai', price: 1.00 },
          { name: 'Ginjo', price: 2.00 }
        ]
      }
    ]
  },

  // Okonomiyaki House
  {
    name: 'Osaka-style Okonomiyaki',
    description: 'Savory pancake with cabbage, pork and special sauce',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1630918326546-963661764a4e',
    restaurant: 'Okonomiyaki House',
    category: 'Pancake',
    tags: ['savory', 'pork'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Hiroshima-style Okonomiyaki',
    description: 'Layered pancake with noodles, cabbage and egg',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1630918326546-963661764a4e',
    restaurant: 'Okonomiyaki House',
    category: 'Pancake',
    tags: ['noodles', 'layered'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Takoyaki',
    description: 'Octopus-filled fried batter balls with sauce',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e',
    restaurant: 'Okonomiyaki House',
    category: 'Appetizer',
    tags: ['octopus', 'fried'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast'],
    popularFilters: ['promo', 'new']
  },

  // ==================== MEXICO RESTAURANTS ====================
  // Taqueria El Pastor
  {
    name: 'Al Pastor Tacos',
    description: 'Marinated pork with pineapple, onions and cilantro',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c',
    restaurant: 'Taqueria El Pastor',
    category: 'Tacos',
    tags: ['pork', 'street food'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Quantity',
        isMultiSelect: false,
        options: [
          { name: '3 Tacos', price: 1.00 },
          { name: '5 Tacos', price: 2.00 }
        ]
      }
    ]
  },
  {
    name: 'Quesadilla',
    description: 'Grilled flour tortilla with melted cheese and filling',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9',
    restaurant: 'Taqueria El Pastor',
    category: 'Quesadilla',
    tags: ['cheese', 'grilled'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Horchata',
    description: 'Traditional rice milk drink with cinnamon',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1601050690117-94b5b7e50a63',
    restaurant: 'Taqueria El Pastor',
    category: 'Beverage',
    tags: ['sweet', 'refreshing'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },

  // La Casa de las Enchiladas
  {
    name: 'Enchiladas Verdes',
    description: 'Corn tortillas filled with chicken, covered in green sauce',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3',
    restaurant: 'La Casa de las Enchiladas',
    category: 'Enchiladas',
    tags: ['chicken', 'green sauce'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Mole Poblano',
    description: 'Chicken in rich chocolate-chili sauce',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950',
    restaurant: 'La Casa de las Enchiladas',
    category: 'Mole',
    tags: ['chicken', 'chocolate'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Chiles en Nogada',
    description: 'Poblano peppers stuffed with picadillo and walnut sauce',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
    restaurant: 'La Casa de las Enchiladas',
    category: 'Specialty',
    tags: ['peppers', 'stuffed'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },

  // Mariscos Jalisco
  {
    name: 'Shrimp Tacos',
    description: 'Crispy fried shrimp tacos with cabbage and sauce',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1601050690117-94b5b7e50a63',
    restaurant: 'Mariscos Jalisco',
    category: 'Tacos',
    tags: ['shrimp', 'fried'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Ceviche',
    description: 'Fresh raw fish cured in citrus juices with spices',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1',
    restaurant: 'Mariscos Jalisco',
    category: 'Seafood',
    tags: ['raw', 'citrus'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },
  {
    name: 'Aguachile',
    description: 'Shrimp in spicy lime-chili sauce with cucumber',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1601050690117-94b5b7e50a63',
    restaurant: 'Mariscos Jalisco',
    category: 'Seafood',
    tags: ['shrimp', 'spicy'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast']
  },

  // Pujol
  {
    name: 'Tasting Menu',
    description: 'Chef\'s selection of modern Mexican dishes',
    price: 85.99,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    restaurant: 'Pujol',
    category: 'Tasting',
    tags: ['premium', 'modern'],
    isAvailable: true,
    deliveryOptions: ['fast', 'paid']
  },
  {
    name: 'Mole Madre',
    description: 'Aged mole sauce with new mole and tortillas',
    price: 28.99,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950',
    restaurant: 'Pujol',
    category: 'Mole',
    tags: ['signature', 'aged'],
    isAvailable: true,
    deliveryOptions: ['fast', 'paid']
  },
  {
    name: 'Taco Omakase',
    description: 'Chef\'s selection of artisanal tacos',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c',
    restaurant: 'Pujol',
    category: 'Tacos',
    tags: ['premium', 'chef\'s choice'],
    isAvailable: true
  }
];

async function seedMenuItems() {
  const connection = await connectDB();
  
  try {
    // Get all restaurants to map names to IDs
    const restaurants = await Restaurant.find({});
    if (restaurants.length === 0) {
      throw new Error('No restaurants found. Please seed restaurants first.');
    }

    // Create restaurant name to ID map
    const restaurantMap = {};
    restaurants.forEach(restaurant => {
      restaurantMap[restaurant.name] = restaurant._id;
    });

    // Update menu items with restaurant IDs
    const itemsToInsert = menuItems.map(item => {
      const restaurantId = restaurantMap[item.restaurant];
      if (!restaurantId) {
        throw new Error(`Restaurant not found: ${item.restaurant}`);
      }
      return {
        ...item,
        restaurant: restaurantId
      };
    });

    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');

    // Insert new menu items
    const createdItems = await MenuItem.insertMany(itemsToInsert);
    console.log(`Successfully seeded ${createdItems.length} menu items`);
    
    return createdItems;
  } catch (error) {
    console.error('Error seeding menu items:', error.message);
    throw error;
  } finally {
    if (require.main === module) {
      await connection.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Execute if run directly
if (require.main === module) {
  seedMenuItems()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { menuItems, seedMenuItems };