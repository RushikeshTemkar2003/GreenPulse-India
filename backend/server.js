// server.js - COMPLETE SETUP
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const donationRoutes = require('./routes/donations');
const contactRoutes = require('./routes/contact');
const recyclingRoutes = require('./routes/recycling');
const volunteerRoutes = require('./routes/volunteers');
const deliveryBoyRoutes = require('./routes/deliveryBoys');
const adminRoutes = require('./routes/admin'); // 👈 IMPORTANT!

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/recycling', recyclingRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/delivery-boys', deliveryBoyRoutes);
app.use('/api/admin', adminRoutes); // 👈 IMPORTANT!

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'GreenPulse India API is running!' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

module.exports = app;