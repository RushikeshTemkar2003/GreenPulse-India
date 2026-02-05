// controllers/recyclingController.js - COMPLETE FIXED VERSION
const { promisePool } = require('../config/db');

exports.createRequest = async (req, res) => {
    try {
        const { name, email, phone, address, item_type, pickup_date } = req.body;
        
        // Validate input
        if (!name || !email || !phone || !address || !item_type || !pickup_date) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        
        const request_id = `REQ-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

        const [result] = await promisePool.query(
            'INSERT INTO recycling_requests (request_id, name, email, phone, address, item_type, pickup_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [request_id, name, email, phone, address, item_type, pickup_date]
        );

        res.status(201).json({
            success: true,
            message: 'Recycling request submitted successfully! We will contact you soon.',
            request: {
                id: result.insertId,
                request_id
            }
        });
    } catch (error) {
        console.error('Create recycling request error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit request',
            error: error.message
        });
    }
};

exports.getAllRequests = async (req, res) => {
    try {
        const { status } = req.query;
        let query = 'SELECT r.*, u.name as assigned_to_name FROM recycling_requests r LEFT JOIN users u ON r.assigned_to = u.id';
        const params = [];

        if (status) {
            query += ' WHERE r.status = ?';
            params.push(status);
        }

        query += ' ORDER BY r.created_at DESC';

        const [requests] = await promisePool.query(query, params);

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
};

exports.assignRequest = async (req, res) => {
    try {
        const { deliveryBoyId } = req.body;

        if (!deliveryBoyId) {
            return res.status(400).json({
                success: false,
                message: 'Delivery boy ID is required'
            });
        }

        await promisePool.query(
            'UPDATE recycling_requests SET assigned_to = ?, status = ? WHERE id = ?',
            [deliveryBoyId, 'assigned', req.params.id]
        );

        await promisePool.query(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)',
            [req.user.id, 'Recycling request assigned', 'recycling_request', req.params.id]
        );

        res.json({
            success: true,
            message: 'Request assigned successfully'
        });
    } catch (error) {
        console.error('Assign request error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to assign request'
        });
    }
};