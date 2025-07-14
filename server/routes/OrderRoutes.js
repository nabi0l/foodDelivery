const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Get all orders for the logged-in user
router.get('/', async (req, res) => {
    try {
        console.log('Fetching orders...');
        
        // In a real app, you would get the user ID from the JWT token
        // For now, we'll use a query parameter or return all orders
        const userId = req.query.userId;
        
        let query = {};
        if (userId) {
            query.userId = userId;
        }
        
        console.log('Query:', query);
        
        const orders = await Order.find(query)
            .populate('restaurantId', 'name image') // Populate restaurant name and image
            .sort({ createdAt: -1 }) // Sort by newest first
            .lean(); // Convert to plain JavaScript objects
            
        console.log('Found orders:', orders.length);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching orders', 
            error: error.message 
        });
    }
});

router.post('/', async (req, res) => {
    const order = new Order({
        userId: req.body.userId,
        restaurantId: req.body.restaurantId,
        items: req.body.items,
        totalPrice: req.body.totalPrice,
        paymentStatus: req.body.paymentStatus,
        deliveryStatus: req.body.deliveryStatus
    });
    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        order.userId = req.body.userId;
        order.restaurantId = req.body.restaurantId;
        order.items = req.body.items;
        order.totalPrice = req.body.totalPrice;
        order.paymentStatus = req.body.paymentStatus;
        order.deliveryStatus = req.body.deliveryStatus;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/user/:userId', async (req, res) => {
    try {
        const order = await Order.deleteMany({ userId: req.params.userId });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/restaurant/:restaurantId', async (req, res) => {
    try {
        const order = await Order.deleteMany({ restaurantId: req.params.restaurantId });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/item/:itemId', async (req, res) => {
    try {
        const order = await Order.deleteMany({ itemId: req.params.itemId });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Checkout route
router.post('/checkout', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId, deliveryAddress, paymentMethod } = req.body;
        
        // 1. Get the user's cart
        const cart = await Cart.findOne({ userId }).session(session);
        
        if (!cart || !cart.items || cart.items.length === 0) {
            await session.abortTransaction();
            return res.status(400).json({ 
                success: false, 
                message: 'Your cart is empty' 
            });
        }

        // 2. Create a new order
        const order = new Order({
            userId: cart.userId,
            restaurantId: cart.restaurant,
            items: cart.items.map(item => ({
                menuItemId: item.menuItemId,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            totalPrice: cart.totalPrice,
            paymentStatus: 'pending',
            deliveryStatus: 'pending',
            deliveryAddress: deliveryAddress || 'Not specified',
            paymentMethod: paymentMethod || 'cash_on_delivery'
        });

        // 3. Save the order
        const savedOrder = await order.save({ session });

        // 4. Clear the cart
        await Cart.findByIdAndDelete(cart._id).session(session);

        // 5. Commit the transaction
        await session.commitTransaction();
        
        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order: savedOrder
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Checkout error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing your order',
            error: error.message
        });
    } finally {
        session.endSession();
    }
});

//get all orders for specific restaurant

router.get('/restaurant/:restaurantId/orders', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const orders = await Order.find({ restaurant: restaurantId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;