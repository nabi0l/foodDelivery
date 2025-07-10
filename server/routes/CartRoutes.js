const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Cart = require('../models/Cart');

// Middleware to handle async/await errors
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Get all carts (admin only)
router.get('/', asyncHandler(async (req, res) => {
    const carts = await Cart.find().populate('restaurant', 'name');
    res.json({
        success: true,
        count: carts.length,
        data: carts
    });
}));

// Get cart for the current user
router.get('/user/:userId', asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid user ID'
        });
    }

    const cart = await Cart.findOne({ userId: req.params.userId })
        .populate('restaurant', 'name image')
        .lean();

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: 'No cart found for this user'
        });
    }

    res.json({
        success: true,
        data: cart
    });
}));

// Create or update a cart
router.post('/', asyncHandler(async (req, res) => {
    const { userId, items, totalPrice, restaurantId } = req.body;

    if (!userId || !restaurantId) {
        return res.status(400).json({
            success: false,
            message: 'Please provide userId and restaurantId'
        });
    }

    // Calculate total price if not provided
    const calculatedTotal = totalPrice || items.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0);

    // Check if cart already exists for user
    let cart = await Cart.findOne({ userId });

    if (cart) {
        // Update existing cart
        cart.items = items || cart.items;
        cart.totalPrice = calculatedTotal;
        cart.restaurant = restaurantId;
        cart.updatedAt = new Date();
    } else {
        // Create new cart
        cart = new Cart({
            userId,
            items: items || [],
            totalPrice: calculatedTotal,
            restaurant: restaurantId
        });
    }

    const savedCart = await cart.save();
    const populatedCart = await Cart.findById(savedCart._id)
        .populate('restaurant', 'name image');

    res.status(201).json({
        success: true,
        data: populatedCart
    });
}));

// Get cart by ID
router.get('/:id', asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid cart ID'
        });
    }

    const cart = await Cart.findById(req.params.id)
        .populate('restaurant', 'name image');

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: 'Cart not found'
        });
    }

    res.json({
        success: true,
        data: cart
    });
}));

// Update cart
router.patch('/:id', asyncHandler(async (req, res) => {
    const { items, totalPrice, restaurantId } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid cart ID'
        });
    }

    const cart = await Cart.findById(req.params.id);
    
    if (!cart) {
        return res.status(404).json({
            success: false,
            message: 'Cart not found'
        });
    }

    // Update only the fields that are provided
    if (items) cart.items = items;
    if (totalPrice) cart.totalPrice = totalPrice;
    if (restaurantId) cart.restaurant = restaurantId;
    
    cart.updatedAt = new Date();
    
    const updatedCart = await cart.save();
    const populatedCart = await Cart.findById(updatedCart._id)
        .populate('restaurant', 'name image');

    res.json({
        success: true,
        data: populatedCart
    });
}));

// Delete cart by ID
router.delete('/:id', asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid cart ID'
        });
    }

    const cart = await Cart.findByIdAndDelete(req.params.id);
    
    if (!cart) {
        return res.status(404).json({
            success: false,
            message: 'Cart not found'
        });
    }

    res.json({
        success: true,
        message: 'Cart deleted successfully'
    });
}));

// Delete all carts for a user
router.delete('/user/:userId', asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid user ID'
        });
    }

    const result = await Cart.deleteMany({ userId: req.params.userId });
    
    res.json({
        success: true,
        message: `Deleted ${result.deletedCount} cart(s) for user`,
        data: result
    });
}));

// Delete all carts for a restaurant
router.delete('/restaurant/:restaurantId', asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.restaurantId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid restaurant ID'
        });
    }

    const result = await Cart.deleteMany({ restaurant: req.params.restaurantId });
    
    res.json({
        success: true,
        message: `Deleted ${result.deletedCount} cart(s) for restaurant`,
        data: result
    });
}));

// Remove item from all carts
router.delete('/item/:itemId', asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid item ID'
        });
    }

    // Find all carts containing this item
    const carts = await Cart.find({ 'items.menuItemId': req.params.itemId });
    
    // Update each cart to remove the item
    const updatePromises = carts.map(cart => {
        cart.items = cart.items.filter(item => item.menuItemId.toString() !== req.params.itemId);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return cart.save();
    });

    await Promise.all(updatePromises);
    
    res.json({
        success: true,
        message: `Removed item from ${carts.length} cart(s)`
    });
}));

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

module.exports = router;