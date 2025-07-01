//userId
//restaurantId
//items
//totalPrice
//createdAt
//updatedAt
//paymentStatus
//deliveryStatus

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: String,
    restaurantId: String,
    items: Array,
    totalPrice: Number,
    createdAt: Date,
    updatedAt: Date,
    paymentStatus: String,
    deliveryStatus: String
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;