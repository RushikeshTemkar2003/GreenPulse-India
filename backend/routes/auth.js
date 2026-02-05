// routes/auth.js - Authentication Routes
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Validation rules
const registerValidation = [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('phone').matches(/^[6-9]\d{9}$/).withMessage('Invalid Indian phone number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['volunteer', 'delivery_boy', 'admin']).withMessage('Invalid role')
];

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', registerValidation, authController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], authController.login);





module.exports = router;