// routes/contact.js - COMPLETE FIXED VERSION
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const contactController = require('../controllers/contactController');

// Validation rules
const contactValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid Indian phone number required'),
    body('message').trim().notEmpty().withMessage('Message is required')
];

// Public route - Submit contact form (NO AUTH REQUIRED)
router.post('/', contactValidation, contactController.createContact);

// Admin routes
router.get('/', authenticateToken, authorizeRoles('admin'), contactController.getAllContacts);


module.exports = router;