const jwt = require('jsonwebtoken');
const userSchema = require('../models/User.js');

const protect = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_ecom'); // Verify token
        req.user = decoded.user; // Set req.user
        console.log('Decoded User:', req.user); // Debug log
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const isExpert = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const user1 = await userSchema.findById(req.user.id); // Fetch user details from database

        if (!user1) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user1.role === 'expert') {
            req.user = user1; // Ensure req.user is set with user details
            next();
        } else {
            res.status(403).json({ message: 'Not authorized as an expert' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { protect, isExpert };

