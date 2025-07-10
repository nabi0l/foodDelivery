//name
//description
//price
//image
//restaurant
//category
//tags
//isAvailable
//createdAt
//updatedAt
//options


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuItemSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
    restaurant: String,
    category: String,
    tags: Array,
    isAvailable: Boolean,
    createdAt: Date,
    updatedAt: Date,
    options: Array,
    deliveryOptions: [String],
    popularFilters: [String],
}, {
    timestamps: true
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;