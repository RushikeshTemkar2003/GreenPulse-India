// routes/donations.js - COMPLETE FIXED VERSION
const express = require('express');
const router = express.Router();
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const donationController = require('../controllers/donationController');

// Public route, but attach user if token present (associates donation to logged-in user)
router.post('/', optionalAuth, donationController.createDonation);

// User routes (with auth)
router.get('/my-donations', authenticateToken, donationController.getUserDonations);

// Admin routes
router.get('/', authenticateToken, donationController.getAllDonations);

module.exports = router;