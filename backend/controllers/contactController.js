// controllers/contactController.js - FIXED VERSION
const { promisePool } = require('../config/db');
const { validationResult } = require('express-validator');

// Create Contact Message
exports.createContact = async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, email, phone, message } = req.body;

        // Validate input
        if (!name || !email || !phone || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Insert contact message
        const [result] = await promisePool.query(
            'INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)',
            [name, email, phone, message]
        );

        res.status(201).json({
            success: true,
            message: 'Message sent successfully! We will contact you soon.',
            contactId: result.insertId
        });
    } catch (error) {
        console.error('Create contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message
        });
    }
};

// Get All Contact Messages (Admin)
exports.getAllContacts = async (req, res) => {
    try {
        const [contacts] = await promisePool.query(
            'SELECT * FROM contact_messages ORDER BY created_at DESC'
        );

        res.json({
            success: true,
            count: contacts.length,
            contacts
        });
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contacts'
        });
    }
};

