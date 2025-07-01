const express = require('express');
const router = express.Router();

const MenuItem = require('../models/MenuItem');

// Get all menu items or filter by restaurant ID
router.get('/', async (req, res) => {
    try {
        const { restaurantId } = req.query;
        let query = {};
        
        if (restaurantId) {
            query.restaurant = restaurantId;
        }
        
        const menuItems = await MenuItem.find(query).populate('restaurant', 'name');
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get menu items by restaurant ID
router.get('/restaurant/:restaurantId', async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ restaurant: req.params.restaurantId })
            .populate('restaurant', 'name');
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    const menuItem = new MenuItem({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image,
        restaurant: req.body.restaurant,
        category: req.body.category,
        tags: req.body.tags,
        isAvailable: req.body.isAvailable,
        options: req.body.options
    });
    try {
        const newMenuItem = await menuItem.save();
        res.status(201).json(newMenuItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        res.json(menuItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        menuItem.name = req.body.name;
        menuItem.description = req.body.description;
        menuItem.price = req.body.price;
        menuItem.image = req.body.image;
        menuItem.restaurant = req.body.restaurant;
        menuItem.category = req.body.category;
        menuItem.tags = req.body.tags;
        menuItem.isAvailable = req.body.isAvailable;
        menuItem.options = req.body.options;
        const updatedMenuItem = await menuItem.save();
        res.json(updatedMenuItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
        res.json(menuItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/restaurant/:restaurantId', async (req, res) => {
    try {
        const menuItem = await MenuItem.deleteMany({ restaurantId: req.params.restaurantId });
        res.json(menuItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/item/:itemId', async (req, res) => {
    try {
        const menuItem = await MenuItem.deleteMany({ itemId: req.params.itemId });
        res.json(menuItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;