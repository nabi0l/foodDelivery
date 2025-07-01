const express = require('express');
const router = express.Router();
const PromoCode = require('../models/PromoCode');
const mongoose = require('mongoose');

// Get all active promo codes
router.get('/active', async (req, res) => {
    try {
        const currentDate = new Date();
        const activePromoCodes = await PromoCode.find({
            isActive: true,
            startDate: { $lte: currentDate },
            endDate: { $gte: currentDate }
        }).sort({ createdAt: -1 }).limit(3);
        res.json(activePromoCodes);
    } catch (error) {
        console.error('Error fetching active promo codes:', error);
        res.status(500).json({ message: 'Failed to fetch active promo codes', error: error.message });
    }
});

// Get all promo codes (admin only)
router.get('/', async (req, res) => {
    try {
        const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
        res.json(promoCodes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new promo code (admin only)
router.post('/', async (req, res) => {
    try {
        const promoCode = new PromoCode({
            code: req.body.code,
            description: req.body.description,
            discountType: req.body.discountType,
            discountValue: req.body.discountValue,
            minOrderAmount: req.body.minOrderAmount,
            maxDiscount: req.body.maxDiscount,
            startDate: req.body.startDate || new Date(),
            endDate: req.body.endDate,
            isActive: req.body.isActive !== undefined ? req.body.isActive : true,
            usageLimit: req.body.usageLimit || 1000,
            applicableCategories: req.body.applicableCategories || ['all'],
            applicableRestaurants: req.body.applicableRestaurants || []
        });

        const newPromoCode = await promoCode.save();
        res.status(201).json(newPromoCode);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get promo code by ID
router.get('/:id', async (req, res) => {
    try {
        const promoCode = await PromoCode.findById(req.params.id);
        if (!promoCode) {
            return res.status(404).json({ message: 'Promo code not found' });
        }
        res.json(promoCode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update promo code (admin only)
router.patch('/:id', async (req, res) => {
    try {
        const promoCode = await PromoCode.findById(req.params.id);
        if (!promoCode) {
            return res.status(404).json({ message: 'Promo code not found' });
        }

        // Update only the fields that are provided in the request
        const updates = {};
        const allowedUpdates = ['code', 'description', 'discountType', 'discountValue', 'minOrderAmount', 
                              'maxDiscount', 'startDate', 'endDate', 'isActive', 'usageLimit', 
                              'applicableCategories', 'applicableRestaurants'];
        
        for (const field of allowedUpdates) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const updatedPromoCode = await PromoCode.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        res.json(updatedPromoCode);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete promo code (admin only)
router.delete('/:id', async (req, res) => {
    try {
        const deletedPromoCode = await PromoCode.findByIdAndDelete(req.params.id);
        if (!deletedPromoCode) {
            return res.status(404).json({ message: 'Promo code not found' });
        }
        res.json({ message: 'Promo code deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
