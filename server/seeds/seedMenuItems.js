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
          { name: 'Extra Patty', price: 2.50 },
          { name: 'Add Cheese', price: 1.00 },
          { name: 'Add Bacon', price: 1.50 },
          { name: 'Extra Sauce', price: 0.50 }
        ]
      },
      {
        name: 'Doneness',
        isMultiSelect: false,
        options: [
          { name: 'Medium', price: 0 },
          { name: 'Well Done', price: 0 }
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
          { name: 'Honey Mustard', price: 0 },
          { name: 'Buffalo', price: 0 }
        ]
      },
      {
        name: 'Portion Size',
        isMultiSelect: false,
        options: [
          { name: 'Regular', price: 0 },
          { name: 'Large', price: 2.00 }
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Customization',
        isMultiSelect: true,
        options: [
          { name: 'Extra Bacon', price: 1.50 },
          { name: 'Extra Cheese', price: 1.00 },
          { name: 'Add Jalapeños', price: 0.75 }
        ]
      }
    ]
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
        name: 'Sauce Choice',
        isMultiSelect: false,
        options: [
          { name: 'Original BBQ', price: 0 },
          { name: 'Spicy BBQ', price: 0 },
          { name: 'Honey BBQ', price: 0 }
        ]
      },
      {
        name: 'Sides',
        isMultiSelect: true,
        options: [
          { name: 'Coleslaw', price: 0 },
          { name: 'Baked Beans', price: 0 },
          { name: 'Mac & Cheese', price: 1.50 },
          { name: 'Cornbread', price: 1.00 }
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Bun Choice',
        isMultiSelect: false,
        options: [
          { name: 'Brioche', price: 0 },
          { name: 'Whole Wheat', price: 0 },
          { name: 'Gluten-Free', price: 1.50 }
        ]
      },
      {
        name: 'Add-ons',
        isMultiSelect: true,
        options: [
          { name: 'Extra Pork', price: 2.50 },
          { name: 'Cheese', price: 1.00 },
          { name: 'Pickles', price: 0.50 }
        ]
      }
    ]
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
    options: [
      {
        name: 'Cut Preference',
        isMultiSelect: false,
        options: [
          { name: 'Lean', price: 0 },
          { name: 'Mixed', price: 0 },
          { name: 'Fatty', price: 0 }
        ]
      },
      {
        name: 'Sides',
        isMultiSelect: true,
        options: [
          { name: 'Potato Salad', price: 0 },
          { name: 'Green Beans', price: 0 },
          { name: 'Corn on the Cob', price: 1.00 }
        ]
      }
    ]
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
          { name: 'Medium Rare', price: 0 },
          { name: 'Medium', price: 0 },
          { name: 'Well Done', price: 0 }
        ]
      },
      {
        name: 'Sauce',
        isMultiSelect: false,
        options: [
          { name: 'Lemon Butter', price: 1.00 },
          { name: 'Dill Cream', price: 1.50 },
          { name: 'Mango Salsa', price: 2.00 }
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Style',
        isMultiSelect: false,
        options: [
          { name: 'Maine Style (Cold)', price: 0 },
          { name: 'Connecticut Style (Warm with Butter)', price: 0 }
        ]
      },
      {
        name: 'Add-ons',
        isMultiSelect: true,
        options: [
          { name: 'Extra Lobster', price: 5.00 },
          { name: 'Avocado', price: 1.50 },
          { name: 'Bacon', price: 1.50 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Size',
        isMultiSelect: false,
        options: [
          { name: 'Cup', price: 0 },
          { name: 'Bowl', price: 2.00 }
        ]
      },
      {
        name: 'Toppings',
        isMultiSelect: true,
        options: [
          { name: 'Oyster Crackers', price: 0 },
          { name: 'Bacon Bits', price: 1.00 },
          { name: 'Fresh Herbs', price: 0.50 }
        ]
      }
    ]
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
          { name: 'Mild', price: 0 },
          { name: 'Medium', price: 0 },
          { name: 'Extra Spicy', price: 0 }
        ]
      },
      {
        name: 'Injera Type',
        isMultiSelect: false,
        options: [
          { name: 'Regular', price: 0 },
          { name: 'Extra Soft', price: 20 },
          { name: 'Gluten-Free', price: 30 }
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Dish Selection',
        isMultiSelect: true,
        options: [
          { name: 'Misir Wat (Red Lentil)', price: 0 },
          { name: 'Kik Alicha (Yellow Split Pea)', price: 0 },
          { name: 'Gomen (Collard Greens)', price: 0 },
          { name: 'Atakilt Wat (Cabbage)', price: 0 },
          { name: 'Fosolia (Green Beans)', price: 0 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Consistency',
        isMultiSelect: false,
        options: [
          { name: 'Regular', price: 0 },
          { name: 'Extra Thick', price: 0 },
          { name: 'Extra Spicy', price: 0 }
        ]
      }
    ]
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
          { name: 'Raw (Traditional)', price: 0 },
          { name: 'Lightly Cooked', price: 0 },
          { name: 'Well Cooked', price: 0 }
        ]
      },
      {
        name: 'Add-ons',
        isMultiSelect: true,
        options: [
          { name: 'Extra Spice', price: 20 },
          { name: 'Ayib (Cheese)', price: 30 },
          { name: 'Gomen (Greens)', price: 25 }
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Meat Cut',
        isMultiSelect: false,
        options: [
          { name: 'Regular', price: 0 },
          { name: 'Premium Cut', price: 50 }
        ]
      },
      {
        name: 'Spice Level',
        isMultiSelect: false,
        options: [
          { name: 'Mild', price: 0 },
          { name: 'Medium', price: 0 },
          { name: 'Spicy', price: 0 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Size',
        isMultiSelect: false,
        options: [
          { name: 'Small (250ml)', price: 0 },
          { name: 'Medium (500ml)', price: 80 },
          { name: 'Large (1L)', price: 140 }
        ]
      },
      {
        name: 'Sweetness',
        isMultiSelect: false,
        options: [
          { name: 'Regular', price: 0 },
          { name: 'Extra Sweet', price: 20 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Dish Selection',
        isMultiSelect: true,
        options: [
          { name: 'Shiro', price: 0 },
          { name: 'Misir Wat', price: 0 },
          { name: 'Atakilt Wat', price: 0 },
          { name: 'Fosolia', price: 0 },
          { name: 'Gomen', price: 0 }
        ]
      },
      {
        name: 'Injera Quantity',
        isMultiSelect: false,
        options: [
          { name: 'Standard', price: 0 },
          { name: 'Extra', price: 30 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Spice Level',
        isMultiSelect: false,
        options: [
          { name: 'Mild', price: 0 },
          { name: 'Medium', price: 0 },
          { name: 'Extra Spicy', price: 0 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Add-ons',
        isMultiSelect: true,
        options: [
          { name: 'Extra Garlic', price: 10 },
          { name: 'Spicy Peppers', price: 15 },
          { name: 'Ayib (Cheese)', price: 25 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Cooking Style',
        isMultiSelect: false,
        options: [
          { name: 'Stir-Fried', price: 0 },
          { name: 'Grilled', price: 0 }
        ]
      },
      {
        name: 'Sauce Choice',
        isMultiSelect: false,
        options: [
          { name: 'Traditional', price: 0 },
          { name: 'Teriyaki Fusion', price: 20 },
          { name: 'Pepper Sauce', price: 20 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Add Protein',
        isMultiSelect: false,
        options: [
          { name: 'None', price: 0 },
          { name: 'Grilled Chicken', price: 50 },
          { name: 'Beef Strips', price: 60 }
        ]
      },
      {
        name: 'Dressing',
        isMultiSelect: false,
        options: [
          { name: 'Lime Vinaigrette', price: 0 },
          { name: 'Tahini', price: 10 },
          { name: 'Honey Mustard', price: 10 }
        ]
      }
    ]
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
    popularFilters: ['rating', 'new'],
    options: [
      {
        name: 'Roast Level',
        isMultiSelect: false,
        options: [
          { name: 'Light', price: 0 },
          { name: 'Medium', price: 0 },
          { name: 'Dark', price: 0 }
        ]
      },
      {
        name: 'Add-ons',
        isMultiSelect: true,
        options: [
          { name: 'Traditional Incense', price: 20 },
          { name: 'Popcorn', price: 15 },
          { name: 'Sugar', price: 0 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Pasta Type',
        isMultiSelect: false,
        options: [
          { name: 'Spaghetti', price: 0 },
          { name: 'Tonnarelli', price: 1.00 },
          { name: 'Bucatini', price: 1.00 }
        ]
      },
      {
        name: 'Cheese Level',
        isMultiSelect: false,
        options: [
          { name: 'Standard', price: 0 },
          { name: 'Extra Cheese', price: 1.50 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Guanciale/Pancetta',
        isMultiSelect: false,
        options: [
          { name: 'Standard', price: 0 },
          { name: 'Extra', price: 2.00 }
        ]
      },
      {
        name: 'Egg Yolk Option',
        isMultiSelect: false,
        options: [
          { name: 'Mixed In', price: 0 },
          { name: 'On Top', price: 0 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Coffee Strength',
        isMultiSelect: false,
        options: [
          { name: 'Regular', price: 0 },
          { name: 'Extra Strong', price: 0 }
        ]
      },
      {
        name: 'Alcohol Option',
        isMultiSelect: false,
        options: [
          { name: 'With Marsala Wine', price: 1.00 },
          { name: 'Without Alcohol', price: 0 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Size',
        isMultiSelect: false,
        options: [
          { name: 'Small (10")', price: 0 },
          { name: 'Medium (12")', price: 2.00 },
          { name: 'Large (14")', price: 4.00 }
        ]
      },
      {
        name: 'Extra Toppings',
        isMultiSelect: true,
        options: [
          { name: 'Extra Mozzarella', price: 1.50 },
          { name: 'Fresh Basil', price: 0.50 },
          { name: 'Olive Oil Drizzle', price: 0.50 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Spice Level',
        isMultiSelect: false,
        options: [
          { name: 'Mild', price: 0 },
          { name: 'Medium', price: 0 },
          { name: 'Extra Spicy', price: 0 }
        ]
      },
      {
        name: 'Cheese Options',
        isMultiSelect: true,
        options: [
          { name: 'Extra Mozzarella', price: 1.50 },
          { name: 'Parmesan', price: 1.00 },
          { name: 'Pecorino', price: 1.00 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Fillings',
        isMultiSelect: true,
        options: [
          { name: 'Extra Ricotta', price: 1.50 },
          { name: 'Extra Ham', price: 1.50 },
          { name: 'Mushrooms', price: 1.00 }
        ]
      },
      {
        name: 'Sauce on Side',
        isMultiSelect: false,
        options: [
          { name: 'Marinara', price: 0.50 },
          { name: 'Garlic Butter', price: 0.50 }
        ]
      }
    ]
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
        name: 'Size',
        isMultiSelect: false,
        options: [
          { name: 'Small (1 scoop)', price: 0 },
          { name: 'Medium (2 scoops)', price: 2.00 },
          { name: 'Large (3 scoops)', price: 3.50 }
        ]
      },
      {
        name: 'Flavor',
        isMultiSelect: true,
        options: [
          { name: 'Vanilla', price: 0 },
          { name: 'Chocolate', price: 0 },
          { name: 'Strawberry', price: 0 },
          { name: 'Pistachio', price: 0.50 },
          { name: 'Hazelnut', price: 0.50 }
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Coffee Type',
        isMultiSelect: false,
        options: [
          { name: 'Regular Espresso', price: 0 },
          { name: 'Double Espresso', price: 1.00 },
          { name: 'Decaf', price: 0 }
        ]
      },
      {
        name: 'Add-ons',
        isMultiSelect: true,
        options: [
          { name: 'Whipped Cream', price: 0.50 },
          { name: 'Chocolate Shavings', price: 0.50 },
          { name: 'Amaretto', price: 1.50 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Flavor',
        isMultiSelect: false,
        options: [
          { name: 'Lemon', price: 0 },
          { name: 'Mango', price: 0 },
          { name: 'Raspberry', price: 0 },
          { name: 'Passion Fruit', price: 0.50 }
        ]
      },
      {
        name: 'Size',
        isMultiSelect: false,
        options: [
          { name: 'Small', price: 0 },
          { name: 'Large', price: 1.50 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Seafood Selection',
        isMultiSelect: true,
        options: [
          { name: 'Squid', price: 0 },
          { name: 'Shrimp', price: 2.00 },
          { name: 'Mussels', price: 1.50 },
          { name: 'Clams', price: 1.50 }
        ]
      },
      {
        name: 'Consistency',
        isMultiSelect: false,
        options: [
          { name: 'All\'onda (Creamy)', price: 0 },
          { name: 'More Firm', price: 0 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Dipping Sauce',
        isMultiSelect: false,
        options: [
          { name: 'Aioli', price: 0 },
          { name: 'Marinara', price: 0 },
          { name: 'Tartar', price: 0 }
        ]
      },
      {
        name: 'Lemon Wedges',
        isMultiSelect: false,
        options: [
          { name: 'With Lemon', price: 0 },
          { name: 'Without Lemon', price: 0 }
        ]
      }
    ]
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
    popularFilters: ['rating', 'promo'],
    options: [
      {
        name: 'Alcohol Option',
        isMultiSelect: false,
        options: [
          { name: 'Traditional (With Marsala)', price: 0 },
          { name: 'Non-Alcoholic', price: 0 }
        ]
      },
      {
        name: 'Coffee Strength',
        isMultiSelect: false,
        options: [
          { name: 'Regular', price: 0 },
          { name: 'Extra Strong', price: 0 }
        ]
      }
    ]
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
          { name: 'Mild', price: 0 },
          { name: 'Medium', price: 0 },
          { name: 'Hot', price: 0 },
          { name: 'Extra Hot', price: 0 }
        ]
      },
      {
        name: 'Accompaniments',
        isMultiSelect: true,
        options: [
          { name: 'Naan', price: 2.50 },
          { name: 'Rice', price: 2.00 },
          { name: 'Raita', price: 1.00 }
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Spice Level',
        isMultiSelect: false,
        options: [
          { name: 'Mild', price: 0 },
          { name: 'Medium', price: 0 },
          { name: 'Hot', price: 0 },
          { name: 'Extra Hot', price: 0 }
        ]
      },
      {
        name: 'Cut Preference',
        isMultiSelect: false,
        options: [
          { name: 'Boneless', price: 1.50 },
          { name: 'Bone-in', price: 0 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Quantity',
        isMultiSelect: false,
        options: [
          { name: '1 Piece', price: 0 },
          { name: '2 Pieces', price: 1.50 },
          { name: '3 Pieces', price: 3.00 }
        ]
      },
      {
        name: 'Toppings',
        isMultiSelect: true,
        options: [
          { name: 'Extra Garlic', price: 0.50 },
          { name: 'Cheese', price: 1.00 },
          { name: 'Herbs', price: 0.50 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Quantity',
        isMultiSelect: false,
        options: [
          { name: '6 Pieces', price: 0 },
          { name: '12 Pieces', price: 3.00 }
        ]
      },
      {
        name: 'Spice Level',
        isMultiSelect: false,
        options: [
          { name: 'Mild', price: 0 },
          { name: 'Medium', price: 0 },
          { name: 'Hot', price: 0 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Spice Level',
        isMultiSelect: false,
        options: [
          { name: 'Mild', price: 0 },
          { name: 'Medium', price: 0 },
          { name: 'Hot', price: 0 }
        ]
      },
      {
        name: 'Cooking Style',
        isMultiSelect: false,
        options: [
          { name: 'Creamy', price: 0 },
          { name: 'Charred', price: 0 },
          { name: 'Extra Creamy', price: 1.00 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Size',
        isMultiSelect: false,
        options: [
          { name: 'Small', price: 0 },
          { name: 'Medium', price: 1.00 },
          { name: 'Large', price: 2.00 }
        ]
      },
      {
        name: 'Sweetness',
        isMultiSelect: false,
        options: [
          { name: 'Less Sweet', price: 0 },
          { name: 'Regular', price: 0 },
          { name: 'Extra Sweet', price: 0 }
        ]
      }
    ]
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
          { name: 'Chicken', price: 0 },
          { name: 'Lamb', price: 3.00 },
          { name: 'Vegetable', price: -2.00 }
        ]
      },
      {
        name: 'Accompaniments',
        isMultiSelect: true,
        options: [
          { name: 'Raita', price: 1.00 },
          { name: 'Mirchi Ka Salan', price: 1.50 },
          { name: 'Baghaar-e-Baingan', price: 2.00 }
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Spice Level',
        isMultiSelect: false,
        options: [
          { name: 'Mild', price: 0 },
          { name: 'Medium', price: 0 },
          { name: 'Hot', price: 0 }
        ]
      },
      {
        name: 'Bone Marrow',
        isMultiSelect: false,
        options: [
          { name: 'Included', price: 0 },
          { name: 'Extra', price: 3.00 },
          { name: 'None', price: -1.00 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Quantity',
        isMultiSelect: false,
        options: [
          { name: '1 Piece', price: 0 },
          { name: '2 Pieces', price: 1.50 },
          { name: '3 Pieces', price: 3.00 }
        ]
      },
      {
        name: 'Toppings',
        isMultiSelect: true,
        options: [
          { name: 'Extra Saffron', price: 1.00 },
          { name: 'Dry Fruits', price: 1.50 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Meat Choice',
        isMultiSelect: false,
        options: [
          { name: 'Chicken', price: 0 },
          { name: 'Lamb', price: 3.00 },
          { name: 'Prawn', price: 4.00 }
        ]
      },
      {
        name: 'Spice Level',
        isMultiSelect: false,
        options: [
          { name: 'Mild', price: 0 },
          { name: 'Medium', price: 0 },
          { name: 'Hot', price: 0 },
          { name: 'Extra Hot', price: 0 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Meat Choice',
        isMultiSelect: false,
        options: [
          { name: 'Chicken', price: 0 },
          { name: 'Lamb', price: 2.00 },
          { name: 'Beef', price: 2.50 }
        ]
      },
      {
        name: 'Toppings',
        isMultiSelect: true,
        options: [
          { name: 'Fried Onions', price: 0.50 },
          { name: 'Lemon Wedges', price: 0.25 },
          { name: 'Ginger', price: 0.50 }
        ]
      }
    ]
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
    popularFilters: ['rating', 'discount'],
    options: [
      {
        name: 'Size',
        isMultiSelect: false,
        options: [
          { name: 'Small', price: 0 },
          { name: 'Medium', price: 1.50 },
          { name: 'Large', price: 3.00 }
        ]
      },
      {
        name: 'Toppings',
        isMultiSelect: true,
        options: [
          { name: 'Extra Dry Fruits', price: 1.00 },
          { name: 'Ice Cream', price: 2.00 },
          { name: 'Rabdi', price: 1.50 }
        ]
      }
    ]
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
          { name: 'Salmon', price: 0 },
          { name: 'Tuna', price: 2.00 },
          { name: 'Yellowtail', price: 2.00 },
          { name: 'Octopus', price: 3.00 },
          { name: 'Sea Urchin', price: 5.00 }
        ]
      },
      {
        name: 'Portion Size',
        isMultiSelect: false,
        options: [
          { name: 'Small (8 pieces)', price: 0 },
          { name: 'Medium (12 pieces)', price: 5.00 },
          { name: 'Large (16 pieces)', price: 8.00 }
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Rice Type',
        isMultiSelect: false,
        options: [
          { name: 'White Rice', price: 0 },
          { name: 'Brown Rice', price: 1.00 }
        ]
      },
      {
        name: 'Add-ons',
        isMultiSelect: true,
        options: [
          { name: 'Extra Eel', price: 3.00 },
          { name: 'Spicy Mayo', price: 0.50 },
          { name: 'Tobiko', price: 1.50 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Add-ons',
        isMultiSelect: true,
        options: [
          { name: 'Extra Tofu', price: 1.00 },
          { name: 'Mushrooms', price: 0.75 },
          { name: 'Green Onions', price: 0.50 }
        ]
      },
      {
        name: 'Size',
        isMultiSelect: false,
        options: [
          { name: 'Small', price: 0 },
          { name: 'Large', price: 1.00 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Noodle Firmness',
        isMultiSelect: false,
        options: [
          { name: 'Soft', price: 0 },
          { name: 'Medium', price: 0 },
          { name: 'Firm', price: 0 }
        ]
      },
      {
        name: 'Add-ons',
        isMultiSelect: true,
        options: [
          { name: 'Extra Chashu', price: 2.50 },
          { name: 'Ajitama Egg', price: 1.50 },
          { name: 'Corn', price: 1.00 },
          { name: 'Bamboo Shoots', price: 1.00 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Broth Richness',
        isMultiSelect: false,
        options: [
          { name: 'Light', price: 0 },
          { name: 'Medium', price: 0 },
          { name: 'Rich', price: 0 }
        ]
      },
      {
        name: 'Add-ons',
        isMultiSelect: true,
        options: [
          { name: 'Extra Chicken', price: 2.00 },
          { name: 'Seaweed', price: 0.75 },
          { name: 'Bean Sprouts', price: 0.50 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Quantity',
        isMultiSelect: false,
        options: [
          { name: '5 Pieces', price: 0 },
          { name: '8 Pieces', price: 2.00 },
          { name: '12 Pieces', price: 4.00 }
        ]
      },
      {
        name: 'Dipping Sauce',
        isMultiSelect: false,
        options: [
          { name: 'Ponzu', price: 0 },
          { name: 'Gyoza Sauce', price: 0 },
          { name: 'Spicy Mayo', price: 0.50 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Skewer Selection',
        isMultiSelect: true,
        options: [
          { name: 'Thigh (Momo)', price: 0 },
          { name: 'Breast (Sasami)', price: 0 },
          { name: 'Skin (Kawa)', price: 1.00 },
          { name: 'Liver (Reba)', price: 1.00 },
          { name: 'Meatballs (Tsukune)', price: 1.50 }
        ]
      },
      {
        name: 'Sauce',
        isMultiSelect: false,
        options: [
          { name: 'Tare (Sweet Soy)', price: 0 },
          { name: 'Shio (Salt)', price: 0 },
          { name: 'Spicy', price: 0.50 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Toppings',
        isMultiSelect: true,
        options: [
          { name: 'Bonito Flakes', price: 0.50 },
          { name: 'Green Onions', price: 0.25 },
          { name: 'Ginger', price: 0.50 }
        ]
      },
      {
        name: 'Spice Level',
        isMultiSelect: false,
        options: [
          { name: 'Mild', price: 0 },
          { name: 'Medium', price: 0 },
          { name: 'Spicy', price: 0.50 }
        ]
      }
    ]
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
          { name: 'Junmai', price: 0 },
          { name: 'Ginjo', price: 2.00 },
          { name: 'Daiginjo', price: 4.00 }
        ]
      },
      {
        name: 'Temperature',
        isMultiSelect: false,
        options: [
          { name: 'Chilled', price: 0 },
          { name: 'Room Temperature', price: 0 },
          { name: 'Warm', price: 0 }
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Main Ingredient',
        isMultiSelect: false,
        options: [
          { name: 'Pork', price: 0 },
          { name: 'Seafood', price: 2.00 },
          { name: 'Vegetable', price: 0 }
        ]
      },
      {
        name: 'Toppings',
        isMultiSelect: true,
        options: [
          { name: 'Okonomiyaki Sauce', price: 0 },
          { name: 'Mayonnaise', price: 0 },
          { name: 'Bonito Flakes', price: 0.50 },
          { name: 'Seaweed', price: 0.50 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Noodle Type',
        isMultiSelect: false,
        options: [
          { name: 'Udon', price: 0 },
          { name: 'Soba', price: 0 },
          { name: 'Yakisoba', price: 1.00 }
        ]
      },
      {
        name: 'Add-ons',
        isMultiSelect: true,
        options: [
          { name: 'Extra Egg', price: 1.00 },
          { name: 'Cheese', price: 1.50 },
          { name: 'Kimchi', price: 1.00 }
        ]
      }
    ]
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
    popularFilters: ['promo', 'new'],
    options: [
      {
        name: 'Quantity',
        isMultiSelect: false,
        options: [
          { name: '6 Pieces', price: 0 },
          { name: '12 Pieces', price: 3.00 }
        ]
      },
      {
        name: 'Toppings',
        isMultiSelect: true,
        options: [
          { name: 'Takoyaki Sauce', price: 0 },
          { name: 'Mayonnaise', price: 0 },
          { name: 'Bonito Flakes', price: 0.50 },
          { name: 'Seaweed', price: 0.50 }
        ]
      }
    ]
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
          { name: '3 Tacos', price: 0 },
          { name: '5 Tacos', price: 3.00 }
        ]
      },
      {
        name: 'Toppings',
        isMultiSelect: true,
        options: [
          { name: 'Extra Pineapple', price: 0.50 },
          { name: 'Guacamole', price: 1.50 },
          { name: 'Queso Fresco', price: 1.00 }
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Filling',
        isMultiSelect: false,
        options: [
          { name: 'Cheese', price: 0 },
          { name: 'Chicken', price: 1.50 },
          { name: 'Beef', price: 2.00 },
          { name: 'Mushroom', price: 1.00 }
        ]
      },
      {
        name: 'Add-ons',
        isMultiSelect: true,
        options: [
          { name: 'Sour Cream', price: 0.50 },
          { name: 'Guacamole', price: 1.50 },
          { name: 'Pico de Gallo', price: 0.75 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Size',
        isMultiSelect: false,
        options: [
          { name: 'Small', price: 0 },
          { name: 'Medium', price: 1.00 },
          { name: 'Large', price: 2.00 }
        ]
      },
      {
        name: 'Sweetness',
        isMultiSelect: false,
        options: [
          { name: 'Less Sweet', price: 0 },
          { name: 'Regular', price: 0 },
          { name: 'Extra Sweet', price: 0 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Filling',
        isMultiSelect: false,
        options: [
          { name: 'Chicken', price: 0 },
          { name: 'Cheese', price: 0 },
          { name: 'Beef', price: 1.50 }
        ]
      },
      {
        name: 'Toppings',
        isMultiSelect: true,
        options: [
          { name: 'Crema', price: 0.50 },
          { name: 'Queso Fresco', price: 1.00 },
          { name: 'Pickled Onions', price: 0.50 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Protein',
        isMultiSelect: false,
        options: [
          { name: 'Chicken', price: 0 },
          { name: 'Pork', price: 1.00 },
          { name: 'Vegetables', price: 0 }
        ]
      },
      {
        name: 'Spice Level',
        isMultiSelect: false,
        options: [
          { name: 'Mild', price: 0 },
          { name: 'Medium', price: 0 },
          { name: 'Spicy', price: 0 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Stuffing',
        isMultiSelect: false,
        options: [
          { name: 'Traditional Picadillo', price: 0 },
          { name: 'Vegetarian', price: 0 },
          { name: 'Seafood', price: 2.00 }
        ]
      },
      {
        name: 'Sauce',
        isMultiSelect: false,
        options: [
          { name: 'Walnut Cream', price: 0 },
          { name: 'Almond Cream', price: 0 },
          { name: 'Cashew Cream', price: 0 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Quantity',
        isMultiSelect: false,
        options: [
          { name: '2 Tacos', price: 0 },
          { name: '3 Tacos', price: 3.00 }
        ]
      },
      {
        name: 'Sauce',
        isMultiSelect: false,
        options: [
          { name: 'Chipotle', price: 0 },
          { name: 'Avocado', price: 0 },
          { name: 'Mango Habanero', price: 0.50 }
        ]
      }
    ]
  },
   // Mariscos Jalisco
   {
    name: 'Ceviche',
    description: 'Fresh raw fish cured in citrus juices with spices',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1',
    restaurant: 'Mariscos Jalisco',
    category: 'Seafood',
    tags: ['raw', 'citrus'],
    isAvailable: true,
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Seafood Type',
        isMultiSelect: false,
        options: [
          { name: 'Shrimp', price: 0 },
          { name: 'Fish', price: 0 },
          { name: 'Mixed (Shrimp+Fish)', price: 2.00 },
          { name: 'Octopus', price: 3.00 }
        ]
      },
      {
        name: 'Style',
        isMultiSelect: false,
        options: [
          { name: 'Traditional (Lime)', price: 0 },
          { name: 'Mango-Habanero', price: 1.00 },
          { name: 'Coconut Milk', price: 1.50 }
        ]
      },
      {
        name: 'Add-ons',
        isMultiSelect: true,
        options: [
          { name: 'Avocado', price: 1.50 },
          { name: 'Cucumber', price: 0.50 },
          { name: 'Jicama', price: 0.75 },
          { name: 'Tostadas', price: 1.00 }
        ]
      }
    ]
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
    deliveryOptions: ['paid', 'fast'],
    options: [
      {
        name: 'Spice Level',
        isMultiSelect: false,
        options: [
          { name: 'Mild', price: 0 },
          { name: 'Medium', price: 0 },
          { name: 'Extra Spicy', price: 0 }
        ]
      },
      {
        name: 'Protein',
        isMultiSelect: false,
        options: [
          { name: 'Shrimp', price: 0 },
          { name: 'Scallops', price: 3.00 },
          { name: 'Mixed', price: 2.00 }
        ]
      },
      {
        name: 'Style',
        isMultiSelect: false,
        options: [
          { name: 'Traditional Green', price: 0 },
          { name: 'Mango', price: 1.00 },
          { name: 'Negro (Squid Ink)', price: 2.00 }
        ]
      }
    ]
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
    deliveryOptions: ['fast', 'paid'],
    options: [
      {
        name: 'Course Selection',
        isMultiSelect: false,
        options: [
          { name: '5 Courses', price: 0 },
          { name: '7 Courses', price: 20.00 },
          { name: '9 Courses', price: 35.00 }
        ]
      },
      {
        name: 'Dietary Restrictions',
        isMultiSelect: true,
        options: [
          { name: 'Vegetarian', price: 0 },
          { name: 'Pescatarian', price: 0 },
          { name: 'Gluten-Free', price: 0 }
        ]
      },
      {
        name: 'Wine Pairing',
        isMultiSelect: false,
        options: [
          { name: 'None', price: 0 },
          { name: 'Mexican Wines', price: 25.00 },
          { name: 'International Wines', price: 35.00 }
        ]
      }
    ]
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
    deliveryOptions: ['fast', 'paid'],
    options: [
      {
        name: 'Aging Time',
        isMultiSelect: false,
        options: [
          { name: '30 Days', price: 0 },
          { name: '60 Days', price: 5.00 },
          { name: '90 Days', price: 8.00 }
        ]
      },
      {
        name: 'Accompaniments',
        isMultiSelect: true,
        options: [
          { name: 'Blue Corn Tortillas', price: 0 },
          { name: 'Sesame Seeds', price: 0 },
          { name: 'Queso Fresco', price: 1.50 },
          { name: 'Toasted Nuts', price: 2.00 }
        ]
      }
    ]
  },
  {
    name: 'Taco Omakase',
    description: 'Chef\'s selection of artisanal tacos',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c',
    restaurant: 'Pujol',
    category: 'Tacos',
    tags: ['premium', 'chef\'s choice'],
    isAvailable: true,
    deliveryOptions: ['fast', 'paid'],
    options: [
      {
        name: 'Taco Count',
        isMultiSelect: false,
        options: [
          { name: '5 Tacos', price: 0 },
          { name: '7 Tacos', price: 10.00 },
          { name: '9 Tacos', price: 18.00 }
        ]
      },
      {
        name: 'Protein Focus',
        isMultiSelect: false,
        options: [
          { name: 'Mixed', price: 0 },
          { name: 'Seafood', price: 5.00 },
          { name: 'Vegetarian', price: 0 }
        ]
      },
      {
        name: 'Premium Add-ons',
        isMultiSelect: true,
        options: [
          { name: 'Truffle', price: 10.00 },
          { name: 'Caviar', price: 15.00 },
          { name: 'Foie Gras', price: 12.00 }
        ]
      }
    ]
  }
];

async function seedMenuItems() {
  const connection = await connectDB();
  
  try {
    // Clear existing menu items first
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');
    
    // Get all restaurants to map names to IDs
    const restaurants = await Restaurant.find({});
    const restaurantMap = {};
    restaurants.forEach(restaurant => {
      restaurantMap[restaurant.name] = restaurant._id;
    });

    // Map menu items to include restaurant IDs
    const itemsToInsert = [];
    
    for (const item of menuItems) {
      const restaurantId = restaurantMap[item.restaurant];
      if (!restaurantId) {
        console.warn(`Restaurant not found: ${item.restaurant}`);
        continue; // Skip this item if restaurant not found
      }
      
      itemsToInsert.push({
        ...item,
        restaurant: restaurantId
      });
    }
    
    // Insert menu items
    const createdItems = await MenuItem.insertMany(itemsToInsert);
    console.log(`Successfully seeded ${createdItems.length} menu items`);
    
    return createdItems;
  } catch (error) {
    console.error('Error seeding menu items:', error);
    throw error; // Re-throw to handle in the calling function
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