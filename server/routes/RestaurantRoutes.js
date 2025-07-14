const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const PromoCode = require('../models/PromoCode');
const Restaurant = require('../models/Restaurant');
const { getRestaurantAnalytics } = require('../controllers/RestaurantController');

// Add address-based restaurant search route
router.get('/search/by-address', async (req, res) => {
    try {
        const { address, radius = 10 } = req.query;
        
        if (!address) {
            return res.status(400).json({ message: 'Address is required' });
        }

        // For now, we'll do a simple text-based search
        // In a real app, you'd use geocoding to get coordinates and search by distance
        const restaurants = await Restaurant.find({
            $or: [
                { location: { $regex: address, $options: 'i' } },
                { name: { $regex: address, $options: 'i' } },
                { cuisine: { $regex: address, $options: 'i' } }
            ],
            isOpen: true
        }).limit(20);

        res.json(restaurants);
    } catch (error) {
        console.error('Error searching restaurants by address:', error);
        res.status(500).json({ message: 'Error searching restaurants' });
    }
});

// Get restaurants by location coordinates
router.get('/search/by-location', async (req, res) => {
    try {
        const { lat, lng, radius = 10 } = req.query;
        
        if (!lat || !lng) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }

        // For now, return all open restaurants
        // In a real app, you'd implement geospatial queries
        const restaurants = await Restaurant.find({ isOpen: true }).limit(20);
        
        res.json(restaurants);
    } catch (error) {
        console.error('Error searching restaurants by location:', error);
        res.status(500).json({ message: 'Error searching restaurants' });
    }
});

router.get('/', async (req, res) => {
    try {
        const promoCodes = await PromoCode.find();
        res.json(promoCodes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/popular', async (req, res) => {
    try {
        // Step 1: Get the top-rated restaurant for each country
        const topPerCountry = await Restaurant.aggregate([
            { $match: { isPopular: true } },
            { $sort: { country: 1, rating: -1 } },
            {
                $group: {
                    _id: "$country",
                    restaurant: { $first: "$$ROOT" }
                }
            },
            { $replaceRoot: { newRoot: "$restaurant" } }
        ]);
        // Step 2: Sort those by rating and pick the top 5
        const top5 = topPerCountry
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5);
        res.json(top5);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/open', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ isOpen: true });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/close', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ isOpen: false });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Place custom filter routes BEFORE any parameterized routes
router.get('/cuisines', async (req, res) => {
  try {
    const cuisines = await Restaurant.distinct('cuisine');
    res.json(cuisines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single restaurant by ID
router.get('/:id', async (req, res) => {
    try {
        // Check if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid restaurant ID format' });
        }
        
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.json(restaurant);
    } catch (error) {
        console.error('Error fetching restaurant:', error);
        res.status(500).json({ message: 'Server error while fetching restaurant' });
    }
});

// Create a new promo code
router.post('/', async (req, res) => {
    const promoCode = new PromoCode({
        code: req.body.code,
        discount: req.body.discount,
        expiryDate: req.body.expiryDate
    });
    try {
        const newPromoCode = await promoCode.save();
        res.status(201).json(newPromoCode);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const promoCode = await PromoCode.findById(req.params.id);
        promoCode.code = req.body.code;
        promoCode.discount = req.body.discount;
        promoCode.expiryDate = req.body.expiryDate;
        const updatedPromoCode = await promoCode.save();
        res.json(updatedPromoCode);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const promoCode = await PromoCode.findByIdAndDelete(req.params.id);
        res.json(promoCode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/code/:code', async (req, res) => {
    try {
        const promoCode = await PromoCode.deleteMany({ code: req.params.code });
        res.json(promoCode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// create new restaurant logic
router.post('/',async(req,res)=>{
    try{
        const newRestaurant = new Restaurant(req.body);
        const savedRestaurant = await newRestaurant.save();
        res.status(201).json(savedRestaurant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//update the restaurant
router.put('/:id', async (req, res) => {
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(updatedRestaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


//delete the restaurant
router.delete('/:id', async (req, res) => {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deletedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get stats for a restaurant
router.get('/:id/stats', async (req, res) => {
  try {
    const restaurantId = req.params.id;
    // Total Orders
    const Order = require('../models/Order');
    const MenuItem = require('../models/MenuItem');

    const totalOrders = await Order.countDocuments({ restaurantId });
    // Total Revenue
    const orders = await Order.find({ restaurantId });
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    // Top Item
    const allItems = await Order.aggregate([
      { $match: { restaurantId: mongoose.Types.ObjectId(restaurantId) } },
      { $unwind: "$items" },
      { $group: { _id: "$items.menuItemId", count: { $sum: "$items.quantity" } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    let topItem = null;
    if (allItems.length > 0) {
      const menuItem = await MenuItem.findById(allItems[0]._id);
      topItem = menuItem ? menuItem.name : null;
    }

    // Customer Rating (average)
    const Restaurant = require('../models/Restaurant');
    const restaurant = await Restaurant.findById(restaurantId);
    const customerRating = restaurant?.rating || null;

    res.json({
      totalOrders,
      totalRevenue,
      topItem,
      customerRating
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// General dashboard endpoint
router.get('/dashboard', async (req, res) => {
  try {
    const Restaurant = require('../models/Restaurant');
    const Order = require('../models/Order');
    const User = require('../models/User');
    const totalRestaurants = await Restaurant.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    res.json({ totalRestaurants, totalOrders, totalUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/analytics', getRestaurantAnalytics);

module.exports = router;