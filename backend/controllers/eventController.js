const { promisePool } = require('../config/db');
const path = require('path');

exports.getAllEvents = async (req, res) => {
    try {
        const { status } = req.query;
        let query = 'SELECT e.*, u.name as created_by_name FROM events e JOIN users u ON e.created_by = u.id';
        const params = [];

        if (status) {
            query += ' WHERE e.status = ?';
            params.push(status);
        }

        query += ' ORDER BY e.date DESC';

        const [events] = await promisePool.query(query, params);

        res.json({
            success: true,
            count: events.length,
            events
        });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch events'
        });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const [events] = await promisePool.query(
            'SELECT e.*, u.name as created_by_name FROM events e JOIN users u ON e.created_by = u.id WHERE e.id = ?',
            [req.params.id]
        );

        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Get registration count
        const [registrations] = await promisePool.query(
            'SELECT COUNT(*) as count FROM event_registrations WHERE event_id = ?',
            [req.params.id]
        );

        res.json({
            success: true,
            event: {
                ...events[0],
                registration_count: registrations[0].count
            }
        });
    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch event'
        });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location } = req.body;
        const image_url = req.file ? `/uploads/events/${req.file.filename}` : null;

        const [result] = await promisePool.query(
            'INSERT INTO events (title, description, date, location, image_url, created_by) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, date, location, image_url, req.user.id]
        );

        // Log activity
        await promisePool.query(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, 'Event created', 'event', result.insertId, title]
        );

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            eventId: result.insertId
        });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create event'
        });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { title, description, date, location, status } = req.body;
        const image_url = req.file ? `/uploads/events/${req.file.filename}` : undefined;

        let query = 'UPDATE events SET title = ?, description = ?, date = ?, location = ?, status = ?';
        let params = [title, description, date, location, status];

        if (image_url) {
            query += ', image_url = ?';
            params.push(image_url);
        }

        query += ' WHERE id = ?';
        params.push(req.params.id);

        await promisePool.query(query, params);

        // Log activity
        await promisePool.query(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, 'Event updated', 'event', req.params.id, title]
        );

        res.json({
            success: true,
            message: 'Event updated successfully'
        });
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update event'
        });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        await promisePool.query('DELETE FROM events WHERE id = ?', [req.params.id]);

        // Log activity
        await promisePool.query(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)',
            [req.user.id, 'Event deleted', 'event', req.params.id]
        );

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete event'
        });
    }
};
