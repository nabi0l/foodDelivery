const express = require('express');
const router = express.Router();

const PromoCode = require('../models/PromoCode');

router.get('/', async (req, res) => {
    try {
        const promoCodes = await PromoCode.find();
        res.json(promoCodes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

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

router.get('/:id', async (req, res) => {
    try {
        const promoCode = await PromoCode.findById(req.params.id);
        res.json(promoCode);
    } catch (error) {
        res.status(500).json({ message: error.message });
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