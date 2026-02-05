const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Register for event
router.post('/events/:eventId/register', authenticateToken, authorizeRoles('volunteer'), async (req, res) => {
    try {
        const { eventId } = req.params;
        const volunteerId = req.user.id;

        // Check if already registered
        const [existing] = await promisePool.query(
            'SELECT id FROM event_registrations WHERE volunteer_id = ? AND event_id = ?',
            [volunteerId, eventId]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Already registered for this event'
            });
        }

        await promisePool.query(
            'INSERT INTO event_registrations (volunteer_id, event_id) VALUES (?, ?)',
            [volunteerId, eventId]
        );

        await promisePool.query(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)',
            [volunteerId, 'Registered for event', 'event', eventId]
        );

        res.status(201).json({
            success: true,
            message: 'Successfully registered for event'
        });
    } catch (error) {
        console.error('Event registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
    }
});

// Get my events
router.get('/my-events', authenticateToken, authorizeRoles('volunteer'), async (req, res) => {
    try {
        const [events] = await promisePool.query(
            `SELECT e.*, er.status as registration_status, er.registration_date, er.completion_date
             FROM event_registrations er
             JOIN events e ON er.event_id = e.id
             WHERE er.volunteer_id = ?
             ORDER BY e.date DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            count: events.length,
            events
        });
    } catch (error) {
        console.error('Get my events error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch events'
        });
    }
});


module.exports = router;