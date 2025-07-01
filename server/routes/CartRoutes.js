const express = require('express');
const router = express.Router();

const Cart = require('../models/Cart');

router.get('/', async (req, res) => {
    try {
        const carts = await Cart.find();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    const cart = new Cart({
        userId: req.body.userId,
        items: req.body.items,
        totalPrice: req.body.totalPrice,
        restaurant: req.body.restaurant
    });
    try {
        const newCart = await cart.save();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        cart.userId = req.body.userId;
        cart.items = req.body.items;
        cart.totalPrice = req.body.totalPrice;
        cart.restaurant = req.body.restaurant;
        const updatedCart = await cart.save();
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const cart = await Cart.findByIdAndDelete(req.params.id);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/user/:userId', async (req, res) => {
    try {
        const cart = await Cart.deleteMany({ userId: req.params.userId });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/restaurant/:restaurantId', async (req, res) => {
    try {
        const cart = await Cart.deleteMany({ restaurantId: req.params.restaurantId });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



router.delete('/item/:itemId', async (req, res) => {
    try {
        const cart = await Cart.deleteMany({ itemId: req.params.itemId });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;