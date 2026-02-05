const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');


// Get my assigned recycling requests
router.get('/recycling-requests', authenticateToken, authorizeRoles('delivery_boy'), async (req, res) => {
    try {
        const [requests] = await promisePool.query(
            'SELECT * FROM recycling_requests WHERE assigned_to = ? ORDER BY pickup_date ASC',
            [req.user.id]
        );

        res.json({
            success: true,
            count: requests.length,
            requests
        });
    } catch (error) {
        console.error('Get recycling requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch requests'
        });
    }
});

// Complete recycling pickup
router.put('/recycling-requests/:id/complete', authenticateToken, authorizeRoles('delivery_boy'), async (req, res) => {
    try {
        await promisePool.query(
            'UPDATE recycling_requests SET status = ? WHERE id = ? AND assigned_to = ?',
            ['completed', req.params.id, req.user.id]
        );

        await promisePool.query(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)',
            [req.user.id, 'Recycling pickup completed', 'recycling_request', req.params.id]
        );

        res.json({
            success: true,
            message: 'Pickup completed successfully'
        });
    } catch (error) {
        console.error('Complete pickup error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete pickup'
        });
    }
});

module.exports = router;