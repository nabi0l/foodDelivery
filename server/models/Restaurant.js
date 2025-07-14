//name
//cuisine
//rating
//deliveryTime
//menuItems
//image
//isOpen
//location

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    name: String,
    cuisine: String,
    rating: Number,
    deliveryTime: Number,
    menuItems: Array,
    image: String,
    isOpen: Boolean,
    isPopular: Boolean,
    location: String,
    country: String, // Added country field
    createdAt: Date,
    updatedAt: Date
}, {
    timestamps: true
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

//

module.exports = Restaurant;    