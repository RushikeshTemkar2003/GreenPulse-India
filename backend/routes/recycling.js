// routes/recycling.js - COMPLETE FIXED VERSION
const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const recyclingController = require('../controllers/recyclingController');

// Public route - Create recycling request (NO AUTH REQUIRED)
router.post('/', recyclingController.createRequest);

// Admin routes
router.get('/', authenticateToken, authorizeRoles('admin'), recyclingController.getAllRequests);
router.put('/:id/assign', authenticateToken, authorizeRoles('admin'), recyclingController.assignRequest);

module.exports = router;