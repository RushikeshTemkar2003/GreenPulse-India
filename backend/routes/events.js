const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticateToken, authorizeRoles, optionalAuth } = require('../middleware/auth');
const eventController = require('../controllers/eventController');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/events/');
    },
    filename: (req, file, cb) => {
        cb(null, `event-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed'));
    }
});

// Public routes
router.get('/', optionalAuth, eventController.getAllEvents);
router.get('/:id', optionalAuth, eventController.getEventById);

// Admin routes
router.post('/', authenticateToken, authorizeRoles('admin'), upload.single('image'), eventController.createEvent);
router.put('/:id', authenticateToken, authorizeRoles('admin'), upload.single('image'), eventController.updateEvent);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), eventController.deleteEvent);

module.exports = router;