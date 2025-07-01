//userId
//items
//totalPrice
//createdAt
//updatedAt
//restaurant

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    userId: String,
    items: Array,
    totalPrice: Number,
    createdAt: Date,
    updatedAt: Date,
    restaurant: String
}, {
    timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
