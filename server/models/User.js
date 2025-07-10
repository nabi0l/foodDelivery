//name
//email
//password
//role
//address

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, enum: ['user', 'restaurant_owner', 'admin'], default: 'user' },
    address: String,
    createdAt: Date,
    updatedAt: Date
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
