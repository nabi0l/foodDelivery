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
  // Burger King items (unchanged, as they already have the correct format)
  {
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and special sauce on a sesame seed bun',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
    restaurant: 'Burger King',
    category: 'Burgers',
    tags: ['burger', 'beef', 'classic'],
    isAvailable: true,
    options: [
      {
        name: 'Add-ons',
        isMultiSelect: true,
        options: [
          { name: 'Cheese', price: 1.00 },
          { name: 'Bacon', price: 1.50 },
          { name: 'Avocado', price: 2.00 }
        ]
      }
    ]
  },
  {
    name: 'Whopper',
    description: 'Our signature burger with 1/4 lb flame-grilled beef, tomatoes, lettuce, mayo, pickles, and onions on a sesame seed bun',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90',
    restaurant: 'Burger King',
    category: 'Burgers',
    tags: ['signature', 'whopper', 'beef'],
    isAvailable: true,
    options: [
      {
        name: 'Extras',
        isMultiSelect: true,
        options: [
          { name: 'Bacon', price: 1.50 },
          { name: 'Extra Cheese', price: 1.00 },
        ]
      },
      {
        name: 'Patty',
        isMultiSelect: false,
        options: [
          { name: 'Single Patty', price: 0 },
          { name: 'Double Patty', price: 3.00 }
        ]
      }
    ]
  },
  {
    name: 'Chicken Fries',
    description: 'Crispy chicken strips shaped like fries, perfect for dipping',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1626074353765-517c681e0be6',
    restaurant: 'Burger King',
    category: 'Sides',
    tags: ['chicken', 'fries', 'appetizer'],
    isAvailable: true,
    options: [
      {
        name: 'Dipping Sauce',
        isMultiSelect: false,
        options: [
          { name: 'BBQ Sauce', price: 0.50 },
          { name: 'Ranch', price: 0.50 },
          { name: 'Honey Mustard', price: 0.50 }
        ]
      }
    ]
  },

  // Pizza Hut items - updated to follow the same format
  {
    name: 'Pepperoni Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and pepperoni',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e',
    restaurant: 'Pizza Hut',
    category: 'Pizza',
    tags: ['pizza', 'italian', 'pepperoni'],
    isAvailable: true,
    options: [
      {
        name: 'Toppings',
        isMultiSelect: true,
        options: [
          { name: 'Extra Cheese', price: 2.00 },
          { name: 'Mushrooms', price: 1.50 },
          { name: 'Olives', price: 1.00 }
        ]
      },
      {
        name: 'Crust',
        isMultiSelect: false,
        options: [
          { name: 'Regular', price: 0 },
          { name: 'Thin Crust', price: 1.00 },
          { name: 'Stuffed Crust', price: 2.50 }
        ]
      }
    ]
  },
  {
    name: 'Supreme Pizza',
    description: 'Loaded with pepperoni, Italian sausage, green peppers, onions and mushrooms',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3',
    restaurant: 'Pizza Hut',
    category: 'Pizza',
    tags: ['pizza', 'meat lovers', 'vegetables'],
    isAvailable: true,
    options: [
      {
        name: 'Extra Toppings',
        isMultiSelect: true,
        options: [
          { name: 'Extra Cheese', price: 2.00 },
          { name: 'Bacon', price: 2.50 },
          { name: 'Jalapeños', price: 1.50 }
        ]
      },
      {
        name: 'Size',
        isMultiSelect: false,
        options: [
          { name: 'Medium', price: 0 },
          { name: 'Large', price: 3.00 },
          { name: 'Extra Large', price: 5.00 }
        ]
      }
    ]
  },
  {
    name: 'Garlic Knots',
    description: 'Soft dough knots baked with garlic butter and parmesan',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950',
    restaurant: 'Pizza Hut',
    category: 'Sides',
    tags: ['garlic', 'bread', 'appetizer'],
    isAvailable: true,
    options: [
      {
        name: 'Extras',
        isMultiSelect: true,
        options: [
          { name: 'Extra Garlic', price: 0.50 },
          { name: 'Parmesan', price: 0.50 }
        ]
      },
      {
        name: 'Dipping Sauce',
        isMultiSelect: false,
        options: [
          { name: 'Marinara', price: 0.50 },
          { name: 'Ranch', price: 0.50 },
          { name: 'No Sauce', price: 0 }
        ]
      }
    ]
  },

  // Pasta Palace items - updated format
  {
    name: 'Spaghetti Carbonara',
    description: 'Classic Italian pasta with eggs, cheese, pancetta, and black pepper',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1612874742237-6526229898c7',
    restaurant: 'Pasta Palace',
    category: 'Pasta',
    tags: ['pasta', 'italian', 'creamy'],
    isAvailable: true,
    options: [
      {
        name: 'Add-ons',
        isMultiSelect: true,
        options: [
          { name: 'Add Chicken', price: 3.00 },
          { name: 'Add Shrimp', price: 4.00 }
        ]
      },
      {
        name: 'Pasta Type',
        isMultiSelect: false,
        options: [
          { name: 'Regular', price: 0 },
          { name: 'Gluten-Free', price: 2.00 }
        ]
      }
    ]
  },
  {
    name: 'Fettuccine Alfredo',
    description: 'Ribbon pasta tossed in rich, creamy parmesan sauce',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb',
    restaurant: 'Pasta Palace',
    category: 'Pasta',
    tags: ['pasta', 'creamy', 'vegetarian'],
    isAvailable: true,
    options: [
      {
        name: 'Protein Add-ons',
        isMultiSelect: true,
        options: [
          { name: 'Add Shrimp', price: 4.00 },
          { name: 'Add Mushrooms', price: 2.00 },
          { name: 'Add Chicken', price: 3.00 }
        ]
      },
      {
        name: 'Portion Size',
        isMultiSelect: false,
        options: [
          { name: 'Regular', price: 0 },
          { name: 'Large', price: 3.00 }
        ]
      }
    ]
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb',
    restaurant: 'Pasta Palace',
    category: 'Dessert',
    tags: ['dessert', 'coffee', 'italian'],
    isAvailable: true,
    options: [
      {
        name: 'Customization',
        isMultiSelect: true,
        options: [
          { name: 'Extra Espresso Shot', price: 1.00 },
          { name: 'Extra Cream', price: 0.50 }
        ]
      }
    ]
  },

  // Sushi Zen items - updated format
  {
    name: 'California Roll',
    description: 'Sushi roll with crab, avocado, and cucumber',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
    restaurant: 'Sushi Zen',
    category: 'Sushi',
    tags: ['sushi', 'japanese', 'roll'],
    isAvailable: true,
    options: [
      {
        name: 'Sauce',
        isMultiSelect: true,
        options: [
          { name: 'Spicy Mayo', price: 0.50 },
          { name: 'Eel Sauce', price: 0.50 }
        ]
      },
      {
        name: 'Add-ons',
        isMultiSelect: true,
        options: [
          { name: 'Extra Avocado', price: 1.00 },
          { name: 'Cream Cheese', price: 0.75 }
        ]
      }
    ]
  },
  {
    name: 'Salmon Nigiri',
    description: 'Fresh slices of salmon over pressed sushi rice',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e0102',
    restaurant: 'Sushi Zen',
    category: 'Sushi',
    tags: ['sushi', 'raw fish', 'nigiri'],
    isAvailable: true,
    options: [
      {
        name: 'Extras',
        isMultiSelect: true,
        options: [
          { name: 'Wasabi on Side', price: 0 },
          { name: 'Extra Ginger', price: 0.50 }
        ]
      },
      {
        name: 'Soy Sauce',
        isMultiSelect: false,
        options: [
          { name: 'Regular', price: 0 },
          { name: 'Low Sodium', price: 0 }
        ]
      }
    ]
  },
  {
    name: 'Miso Soup',
    description: 'Traditional Japanese soup with tofu, seaweed and scallions',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1601050690117-64b9d48173d1',
    restaurant: 'Sushi Zen',
    category: 'Sides',
    tags: ['soup', 'japanese', 'starter'],
    isAvailable: true,
    options: [
      {
        name: 'Customization',
        isMultiSelect: true,
        options: [
          { name: 'Extra Tofu', price: 1.00 },
          { name: 'No Seaweed', price: 0 }
        ]
      }
    ]
  },

  // Spice Route items - updated format
  {
    name: 'Chicken Biryani',
    description: 'Fragrant basmati rice cooked with tender chicken, saffron, and aromatic spices',
    price: 15.99,
    image: 'https://plus.unsplash.com/premium_photo-1694141252774-c937d97641da',
    restaurant: 'Spice Route',
    category: 'Indian',
    tags: ['biryani', 'spicy', 'authentic', 'indian'],
    isAvailable: true,
    options: [
      {
        name: 'Protein Choice',
        isMultiSelect: false,
        options: [
          { name: 'Chicken', price: 0 },
          { name: 'Lamb', price: 3.00 },
          { name: 'Vegetable', price: -2.00 }
        ]
      },
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
    name: 'Butter Chicken',
    description: 'Tandoori chicken in a rich tomato and butter sauce',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398',
    restaurant: 'Spice Route',
    category: 'Indian',
    tags: ['chicken', 'creamy', 'mild'],
    isAvailable: true,
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
        name: 'Extras',
        isMultiSelect: true,
        options: [
          { name: 'Extra Sauce', price: 1.50 },
          { name: 'Add Paneer', price: 2.00 }
        ]
      }
    ]
  },
  {
    name: 'Garlic Naan',
    description: 'Traditional Indian flatbread baked with garlic and butter',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a',
    restaurant: 'Spice Route',
    category: 'Bread',
    tags: ['naan', 'garlic', 'side'],
    isAvailable: true,
    options: [
      {
        name: 'Customization',
        isMultiSelect: true,
        options: [
          { name: 'Extra Garlic', price: 0.50 },
          { name: 'Extra Butter', price: 0.50 }
        ]
      }
    ]
  },

  // Smokehouse BBQ items - updated format
  {
    name: 'BBQ Ribs Platter',
    description: 'Slow-cooked pork ribs smothered in our signature BBQ sauce',
    price: 22.99,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
    restaurant: 'Smokehouse BBQ',
    category: 'BBQ',
    tags: ['ribs', 'pork', 'bbq'],
    isAvailable: true,
    options: [
      {
        name: 'Sauce Style',
        isMultiSelect: false,
        options: [
          { name: 'Regular Sauce', price: 0 },
          { name: 'Extra Sauce', price: 1.00 },
          { name: 'Dry Rub', price: 0 }
        ]
      },
      {
        name: 'Side Choices',
        isMultiSelect: true,
        options: [
          { name: 'Coleslaw', price: 0 },
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
    image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce',
    restaurant: 'Smokehouse BBQ',
    category: 'Sandwiches',
    tags: ['pork', 'sandwich', 'bbq'],
    isAvailable: true,
    options: [
      {
        name: 'Extras',
        isMultiSelect: true,
        options: [
          { name: 'Extra Coleslaw', price: 0.50 },
          { name: 'Spicy Sauce', price: 0.50 },
          { name: 'Pickles', price: 0.25 }
        ]
      }
    ]
  },
  {
    name: 'Brisket Plate',
    description: 'Slow-smoked beef brisket with two sides',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1556691421-cf15fe27a0b6',
    restaurant: 'Smokehouse BBQ',
    category: 'BBQ',
    tags: ['brisket', 'beef', 'smoked'],
    isAvailable: true,
    options: [
      {
        name: 'Cut Preference',
        isMultiSelect: false,
        options: [
          { name: 'Lean Cut', price: 0 },
          { name: 'Fatty Cut', price: 0 }
        ]
      },
      {
        name: 'Side Choices',
        isMultiSelect: true,
        options: [
          { name: 'Coleslaw', price: 0 },
          { name: 'Baked Beans', price: 0 },
          { name: 'Potato Salad', price: 0 },
          { name: 'Mac & Cheese', price: 1.50 }
        ]
      }
    ]
  },

  // Taco Fiesta items - updated format
  {
    name: 'Street Tacos',
    description: 'Three soft corn tortillas with your choice of meat, onions and cilantro',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c',
    restaurant: 'Taco Fiesta',
    category: 'Tacos',
    tags: ['tacos', 'street food', 'authentic'],
    isAvailable: true,
    options: [
      {
        name: 'Protein Choice',
        isMultiSelect: false,
        options: [
          { name: 'Chicken', price: 0 },
          { name: 'Beef', price: 0 },
          { name: 'Pork', price: 0 },
          { name: 'Vegetarian', price: -1.00 }
        ]
      },
      {
        name: 'Extras',
        isMultiSelect: true,
        options: [
          { name: 'Guacamole', price: 1.50 },
          { name: 'Sour Cream', price: 0.50 }
        ]
      }
    ]
  },
  {
    name: 'Quesadilla',
    description: 'Grilled flour tortilla with melted cheese and your choice of filling',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1615872325608-1e7886e5ab35',
    restaurant: 'Taco Fiesta',
    category: 'Mexican',
    tags: ['quesadilla', 'cheese', 'grilled'],
    isAvailable: true,
    options: [
      {
        name: 'Filling Choice',
        isMultiSelect: false,
        options: [
          { name: 'Chicken', price: 0 },
          { name: 'Beef', price: 0 },
          { name: 'Vegetarian', price: -1.00 }
        ]
      },
      {
        name: 'Extras',
        isMultiSelect: true,
        options: [
          { name: 'Guacamole', price: 1.50 },
          { name: 'Sour Cream', price: 0.50 },
          { name: 'Pico de Gallo', price: 0.50 }
        ]
      }
    ]
  },
  {
    name: 'Churros',
    description: 'Fried dough pastry dusted with cinnamon sugar',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d',
    restaurant: 'Taco Fiesta',
    category: 'Dessert',
    tags: ['churros', 'sweet', 'fried'],
    isAvailable: true,
    options: [
      {
        name: 'Dipping Sauce',
        isMultiSelect: false,
        options: [
          { name: 'Chocolate Sauce', price: 0.50 },
          { name: 'Caramel Sauce', price: 0.50 },
          { name: 'None', price: 0 }
        ]
      }
    ]
  },

  // Green Leaf items - updated format
  {
    name: 'Kale Caesar Salad',
    description: 'Fresh kale with Caesar dressing, parmesan and croutons',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1',
    restaurant: 'Green Leaf',
    category: 'Salads',
    tags: ['salad', 'healthy', 'vegetarian'],
    isAvailable: true,
    options: [
      {
        name: 'Protein Add-ons',
        isMultiSelect: false,
        options: [
          { name: 'None', price: 0 },
          { name: 'Add Chicken', price: 3.00 },
          { name: 'Add Salmon', price: 4.00 }
        ]
      },
      {
        name: 'Special Requests',
        isMultiSelect: true,
        options: [
          { name: 'Gluten-Free', price: 0 },
          { name: 'Extra Dressing', price: 0.50 }
        ]
      }
    ]
  },
  {
    name: 'Acai Bowl',
    description: 'Blended acai berries topped with granola, banana and honey',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf',
    restaurant: 'Green Leaf',
    category: 'Breakfast',
    tags: ['acai', 'healthy', 'fruit'],
    isAvailable: true,
    options: [
      {
        name: 'Toppings',
        isMultiSelect: true,
        options: [
          { name: 'Extra Fruit', price: 1.00 },
          { name: 'Peanut Butter', price: 0.75 },
          { name: 'Chia Seeds', price: 0.50 }
        ]
      }
    ]
  },
  {
    name: 'Avocado Toast',
    description: 'Sourdough bread with smashed avocado, cherry tomatoes and feta',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b',
    restaurant: 'Green Leaf',
    category: 'Breakfast',
    tags: ['avocado', 'toast', 'vegetarian'],
    isAvailable: true,
    options: [
      {
        name: 'Add-ons',
        isMultiSelect: true,
        options: [
          { name: 'Add Egg', price: 1.50 },
          { name: 'Bacon', price: 2.00 },
          { name: 'Smoked Salmon', price: 3.00 }
        ]
      }
    ]
  },

  // Ocean Grill items - updated format
  {
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with lemon butter sauce and seasonal vegetables',
    price: 22.99,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
    restaurant: 'Ocean Grill',
    category: 'Seafood',
    tags: ['salmon', 'grilled', 'healthy'],
    isAvailable: true,
    options: [
      {
        name: 'Cooking Preference',
        isMultiSelect: false,
        options: [
          { name: 'Medium Rare', price: 0 },
          { name: 'Medium', price: 0 },
          { name: 'Well Done', price: 0 }
        ]
      },
      {
        name: 'Extras',
        isMultiSelect: true,
        options: [
          { name: 'Extra Sauce', price: 1.00 },
          { name: 'Double Vegetables', price: 1.50 }
        ]
      }
    ]
  },
  {
    name: 'Lobster Roll',
    description: 'Buttery lobster meat served on a toasted brioche roll',
    price: 28.99,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
    restaurant: 'Ocean Grill',
    category: 'Seafood',
    tags: ['lobster', 'sandwich', 'premium'],
    isAvailable: true,
    options: [
      {
        name: 'Sauce Preference',
        isMultiSelect: false,
        options: [
          { name: 'Regular', price: 0 },
          { name: 'Extra Butter', price: 1.00 },
          { name: 'Light Mayo', price: 0 }
        ]
      }
    ]
  },
  {
    name: 'Clam Chowder',
    description: 'Creamy New England style soup with clams and potatoes',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b',
    restaurant: 'Ocean Grill',
    category: 'Soup',
    tags: ['clam', 'chowder', 'creamy'],
    isAvailable: true,
    options: [
      {
        name: 'Serving Style',
        isMultiSelect: false,
        options: [
          { name: 'Regular Bowl', price: 0 },
          { name: 'Bread Bowl', price: 2.00 }
        ]
      },
      {
        name: 'Extras',
        isMultiSelect: true,
        options: [
          { name: 'Extra Crackers', price: 0.50 },
          { name: 'Extra Bacon Bits', price: 1.00 }
        ]
      }
    ]
  }
];

async function seedMenuItems() {
  const connection = await connectDB();
  
  try {
    // Get all restaurants to map names to IDs
    const restaurants = await Restaurant.find({});
    if (restaurants.length === 0) {
      console.log('No restaurants found. Please seed restaurants first.');
      return [];
    }

    // Create a map of restaurant names to their IDs
    const restaurantMap = {};
    restaurants.forEach(restaurant => {
      restaurantMap[restaurant.name] = restaurant._id;
    });

    // Update menu items with restaurant IDs
    const itemsWithRestaurantIds = menuItems
      .map(item => {
        const restaurantId = restaurantMap[item.restaurant];
        if (!restaurantId) {
          console.warn(`Restaurant not found: ${item.restaurant}. Skipping item: ${item.name}`);
          return null;
        }
        return {
          ...item,
          restaurant: restaurantId
        };
      })
      .filter(Boolean);

    if (itemsWithRestaurantIds.length === 0) {
      console.log('No valid menu items to seed.');
      return [];
    }

    // Clear existing data
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');
    
    // Insert new data
    const createdItems = await MenuItem.insertMany(itemsWithRestaurantIds);
    console.log(`Successfully seeded ${createdItems.length} menu items`);
    
    return createdItems;
  } catch (error) {
    console.error('Error seeding menu items:', error);
    throw error;
  } finally {
    // Only close the connection if this script is run directly
    if (process.argv[1].includes('seedMenuItems')) {
      await connection.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  seedMenuItems()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { menuItems, seedMenuItems };