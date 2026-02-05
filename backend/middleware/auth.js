// middleware/auth.js - COMPLETE FIXED VERSION
const jwt = require('jsonwebtoken');

// Authenticate token (required)
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid or expired token'
                });
            }

            req.user = {
                id: decoded.userId,
                role: decoded.role
            };
            next();
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
    }
};

// Optional authentication (doesn't require token)
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (!err) {
                    req.user = {
                        id: decoded.userId,
                        role: decoded.role
                    };
                }
            });
        }
        next();
    } catch (error) {
        next();
    }
};

// Authorize specific roles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    optionalAuth,
    authorizeRoles
};