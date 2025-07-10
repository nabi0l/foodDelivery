const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const PromoCode = require('../models/PromoCode');
const Restaurant = require('../models/Restaurant');

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


module.exports = router;