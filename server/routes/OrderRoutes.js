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
        deliveryStatus: req.body.deliveryStatus,
        status: 'pending_payment' // Ensure status is set
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
    // Log the request with basic info (excluding sensitive data)
    console.log('Checkout request received:', {
        userId: req.body.userId,
        restaurantId: req.body.restaurantId,
        itemsCount: req.body.items?.length || 0,
        hasAddress: !!req.body.deliveryAddress,
        paymentMethod: req.body.paymentMethod || 'not provided'
    });
    
    // Log full request body in development for debugging
    if (process.env.NODE_ENV !== 'production') {
        console.log('Request body:', JSON.stringify({
            ...req.body,
            items: req.body.items?.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                menuItemId: item.menuItemId
            }))
        }, null, 2));
    }
    
    const session = await mongoose.startSession();
    
    try {
        await session.startTransaction();
        const { 
            userId, 
            restaurantId,
            items, 
            totalPrice, 
            deliveryAddress, 
            paymentMethod, 
            specialInstructions,
            status
        } = req.body;

        // 1. Validate required fields with detailed error messages
        const missingFields = [];
        if (!userId) missingFields.push('userId');
        if (!restaurantId) missingFields.push('restaurantId');
        if (!deliveryAddress) missingFields.push('deliveryAddress');
        if (!items || !Array.isArray(items) || items.length === 0) missingFields.push('items');
        
        if (missingFields.length > 0) {
            await session.abortTransaction();
            const errorMsg = `Missing required fields: ${missingFields.join(', ')}`;
            console.error('Checkout validation failed:', errorMsg);
            return res.status(400).json({ 
                success: false, 
                message: errorMsg,
                missingFields
            });
        }

        // Helper function to safely parse price values
        const parsePrice = (value) => {
            if (typeof value === 'number') return value;
            if (typeof value === 'string') {
                // Remove any non-numeric characters except decimal point and minus sign
                const numericValue = parseFloat(value.toString().replace(/[^0-9.-]+/g, ''));
                return isNaN(numericValue) ? 0 : numericValue;
            }
            return 0;
        };

        // 2. Process items to ensure they have required fields and proper types
        const processedItems = items.map(item => {
            const price = parsePrice(item.price);
            return {
                menuItemId: item.menuItemId || item._id || item.id,
                name: item.name || 'Unnamed Item',
                quantity: Math.max(1, Number(item.quantity) || 1),
                price: price
            };
        });

        // 3. Calculate total price if not provided
        const calculatedTotal = processedItems.reduce(
            (sum, item) => sum + (item.price * item.quantity), 0
        );

        // 4. Create a new order with all required fields
        const orderData = {
            userId,
            restaurantId,
            items: processedItems,
            totalPrice: totalPrice ? parsePrice(totalPrice) : calculatedTotal,
            paymentStatus: 'pending',
            deliveryStatus: 'pending',
            deliveryAddress: deliveryAddress.trim(),
            paymentMethod: paymentMethod || 'cash_on_delivery',
            specialInstructions: specialInstructions?.trim() || '',
            status: status || 'pending_payment'  // Use provided status or default
        };
        
        // Log the order data being saved
        console.log('Creating order with data:', {
            ...orderData,
            items: orderData.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                menuItemId: item.menuItemId
            }))
        });
        
        const order = new Order(orderData);

        // 5. Save the order
        let savedOrder;
        try {
            savedOrder = await order.save({ session });
            console.log('Order saved successfully:', savedOrder._id);
        } catch (saveError) {
            await session.abortTransaction();
            console.error('Error saving order:', saveError);
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to save order',
                error: saveError.message 
            });
        }

        // 6. Clear the cart (if it exists)
        try {
            const cartResult = await Cart.findOneAndDelete({ userId }).session(session);
            if (cartResult) {
                console.log('Cart cleared for user:', userId);
            }
        } catch (cartError) {
            // Log the error but don't fail the order
            console.warn('Warning: Could not clear cart:', cartError.message);
        }

        // 7. Commit the transaction
        try {
            await session.commitTransaction();
            console.log('Transaction committed successfully');
            
            res.status(201).json({
                success: true,
                message: 'Order placed successfully',
                orderId: savedOrder._id,
                order: savedOrder
            });
        } catch (commitError) {
            await session.abortTransaction();
            console.error('Transaction commit failed:', commitError);
            throw commitError; // This will be caught by the outer catch block
        }
    } catch (error) {
        try {
            await session.abortTransaction();
        } catch (abortError) {
            console.error('Error aborting transaction:', abortError);
        }
        
        console.error('Checkout error:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        res.status(500).json({ 
            success: false, 
            message: 'Error processing checkout',
            error: process.env.NODE_ENV === 'production' 
                ? 'Internal server error' 
                : error.message
        });
    } finally {
        try {
            await session.endSession();
        } catch (sessionError) {
            console.error('Error ending session:', sessionError);
        }
    }
});

// PATCH endpoint to update order status
router.patch('/update-status/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        order.status = status;
        await order.save();
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ message: err.message });
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