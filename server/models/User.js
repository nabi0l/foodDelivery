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
    role: String,
    address: String,
    createdAt: Date,
    updatedAt: Date
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
