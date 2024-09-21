const mongoose = require('mongoose');
const { verifyAccessToken } = require('../services/tokenService');
const redisClient = require('../config/redis');
const User = mongoose.model('User');
const rateLimit = require('express-rate-limit');



exports.authenticate = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Access token required" });

    try {
        const decoded = verifyAccessToken(token)
        req.user = await User.findById(decoded.id).select('-password'); // Exclude password from user object
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid token" });
    }
};

exports.verifyRefreshToken = async (req, res, next) => {
    const { token } = req.body;

    if (!token) return res.sendStatus(401); // No refresh token provided

    const savedToken = await redisClient.get(`refreshToken:${req.user.id}`);
    if (token !== savedToken) return res.sendStatus(403); // Invalid refresh token

    next(); // Proceed to the next middleware/route handler
};

exports.authLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 100 requests per windowMs
    message: {
        status: 429,
        message: "Too many requests, please try again later."
    }
});
