const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant'); // Added missing import

exports.getRestaurantAnalytics = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    // Total Orders
    const totalOrders = await Order.countDocuments({ restaurant: restaurantId });

    // Total Revenue
    const orders = await Order.find({ restaurant: restaurantId });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Most Popular Menu Item
    const menuItems = await MenuItem.find({ restaurant: restaurantId });
    let popularItem = null;
    let maxCount = 0;
    for (const item of menuItems) {
      if (item.ordersCount && item.ordersCount > maxCount) {
        maxCount = item.ordersCount;
        popularItem = item;
      }
    }

    res.json({
      totalOrders,
      totalRevenue,
      mostPopularItem: popularItem ? popularItem.name : 'N/A',
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

// Add this function or update your existing getRestaurants function

exports.getRestaurants = async (req, res) => {
  try {
    const { country } = req.query;
    let query = {};
    if (country) {
      query.country = country;
    }
    const restaurants = await Restaurant.find(query);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
