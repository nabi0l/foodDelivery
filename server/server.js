require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const UserRoutes = require('./routes/UserRoutes');
const RestaurantRoutes = require('./routes/RestaurantRoutes');
const MenuItemRoutes = require('./routes/MenuItemRoutes');
const CartRoutes = require('./routes/CartRoutes');
const OrderRoutes = require('./routes/OrderRoutes');
const PromoCodeRoutes = require('./routes/PromoCodeRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Food Delivery API' });
});

// Routes will be added here

//Routes for User
app.use('/api/user', UserRoutes);

//Routes for Restaurant
app.use('/api/restaurant', RestaurantRoutes);

//Routes for MenuItem
app.use('/api/menuItem', MenuItemRoutes);

//Routes for Cart
app.use('/api/cart', CartRoutes);

//Routes for Order
app.use('/api/order', OrderRoutes);

//Routes for PromoCode
app.use('/api/promoCode', PromoCodeRoutes);

// app.use('/api/auth', require('./routes/auth'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
