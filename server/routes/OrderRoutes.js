const express = require('express');
const router = express.Router();

const Order = require('../models/Order');

router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
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



module.exports = router;