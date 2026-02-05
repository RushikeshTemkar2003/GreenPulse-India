// routes/admin.js - COMPLETE FILE WITH dashboard-stats
const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// ⭐ DASHBOARD STATISTICS - THIS IS THE MAIN ONE YOU NEED!
router.get('/dashboard-stats', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        console.log('📊 Fetching dashboard stats...');

        // Count volunteers
        const [volunteers] = await promisePool.query(
            'SELECT COUNT(*) as count FROM users WHERE role = ?',
            ['volunteer']
        );

        // Count delivery boys
        const [deliveryBoys] = await promisePool.query(
            'SELECT COUNT(*) as count FROM users WHERE role = ?',
            ['delivery_boy']
        );

        // Count events
        const [events] = await promisePool.query(
            'SELECT COUNT(*) as count FROM events'
        );

        // Count and sum donations
        const [donations] = await promisePool.query(
            'SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total FROM donations'
        );

        // Count recycling requests
        const [recycling] = await promisePool.query(
            'SELECT COUNT(*) as count FROM recycling_requests'
        );

        

        const stats = {
            total_volunteers: volunteers[0].count || 0,
            total_delivery_boys: deliveryBoys[0].count || 0,
            total_events: events[0].count || 0,
            total_donations: donations[0].count || 0,
            total_donation_amount: donations[0].total || 0,
            total_recycling_requests: recycling[0].count || 0,
           
        };

       

        // Get recent activity
        const [recentActivity] = await promisePool.query(
            `SELECT al.*, u.name as user_name 
             FROM activity_logs al 
             LEFT JOIN users u ON al.user_id = u.id 
             ORDER BY al.created_at DESC 
             LIMIT 10`
        );

       

        res.json({
            success: true,
            stats,
            recentActivity
        });

    } catch (error) {
        console.error('❌ Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message
        });
    }
});

// Get all users
router.get('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { role } = req.query;
        let query = 'SELECT id, name, email, phone, role, vehicle_type, created_at FROM users';
        const params = [];

        if (role) {
            query += ' WHERE role = ?';
            params.push(role);
        }

        query += ' ORDER BY created_at DESC';

        const [users] = await promisePool.query(query, params);

        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
});

// Get all volunteers with stats
router.get('/volunteers', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const [volunteers] = await promisePool.query(`
            SELECT 
                u.id as volunteer_id,
                u.name,
                u.email,
                u.phone,
                u.created_at,
                COUNT(DISTINCT er.event_id) as events_participated,
                COUNT(DISTINCT c.id) as certificates_earned,
                COALESCE(SUM(d.amount), 0) as total_donated
            FROM users u
            LEFT JOIN event_registrations er ON u.id = er.volunteer_id
            LEFT JOIN certificates c ON u.id = c.volunteer_id
            LEFT JOIN donations d ON u.id = d.user_id
            WHERE u.role = 'volunteer'
            GROUP BY u.id, u.name, u.email, u.phone, u.created_at
            ORDER BY u.created_at DESC
        `);

        res.json({
            success: true,
            count: volunteers.length,
            volunteers
        });
    } catch (error) {
        console.error('Get volunteers error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch volunteers'
        });
    }
});

// Get all delivery boys with stats
router.get('/delivery-boys', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const [deliveryBoys] = await promisePool.query(`
            SELECT 
                u.id as delivery_boy_id,
                u.name,
                u.email,
                u.phone,
                u.vehicle_type,
                u.created_at,
                COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_tasks,
                COUNT(DISTINCT CASE WHEN t.status IN ('assigned', 'in-progress') THEN t.id END) as active_tasks,
                COUNT(DISTINCT CASE WHEN rr.status = 'completed' THEN rr.id END) as completed_pickups
            FROM users u
            LEFT JOIN tasks t ON u.id = t.assigned_to AND t.assigned_role = 'delivery_boy'
            LEFT JOIN recycling_requests rr ON u.id = rr.assigned_to
            WHERE u.role = 'delivery_boy'
            GROUP BY u.id, u.name, u.email, u.phone, u.vehicle_type, u.created_at
            ORDER BY u.created_at DESC
        `);

        res.json({
            success: true,
            count: deliveryBoys.length,
            deliveryBoys
        });
    } catch (error) {
        console.error('Get delivery boys error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch delivery boys'
        });
    }
});

// Get available delivery boys for assignment
router.get('/available-delivery-boys', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const [deliveryBoys] = await promisePool.query(`
            SELECT 
                u.id,
                u.name,
                u.email,
                u.phone,
                u.vehicle_type,
                COUNT(t.id) as active_tasks
            FROM users u
            LEFT JOIN tasks t ON u.id = t.assigned_to 
                AND t.status IN ('assigned', 'in-progress')
            WHERE u.role = 'delivery_boy'
            GROUP BY u.id, u.name, u.email, u.phone, u.vehicle_type
            ORDER BY active_tasks ASC, u.name ASC
        `);

        res.json({
            success: true,
            count: deliveryBoys.length,
            deliveryBoys
        });
    } catch (error) {
        console.error('Get available delivery boys error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch delivery boys'
        });
    }
});


// Get event registrations
router.get('/events/:eventId/registrations', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const [registrations] = await promisePool.query(
            `SELECT er.*, u.name as volunteer_name, u.email as volunteer_email, u.phone as volunteer_phone
             FROM event_registrations er
             JOIN users u ON er.volunteer_id = u.id
             WHERE er.event_id = ?
             ORDER BY er.registration_date DESC`,
            [req.params.eventId]
        );

        res.json({
            success: true,
            count: registrations.length,
            registrations
        });
    } catch (error) {
        console.error('Get registrations error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch registrations'
        });
    }
});

// Mark event registration as completed
router.put('/event-registrations/:id/complete', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        await promisePool.query(
            'UPDATE event_registrations SET status = ?, completion_date = NOW() WHERE id = ?',
            ['completed', req.params.id]
        );

        res.json({
            success: true,
            message: 'Participation marked as completed'
        });
    } catch (error) {
        console.error('Complete registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update registration'
        });
    }
});


module.exports = router;