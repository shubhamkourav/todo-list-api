const mongoose = require('mongoose');
const { generateRefreshToken, generateAccessToken, verifyRefreshToken } = require('../services/tokenService');
const redisClient = require('../config/redis');

const User = mongoose.model('User')
const RefreshToken = mongoose.model('RefreshToken')
exports.register = async (req, res) => {
    const { email } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        const user = new User(req.body);
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Registration failed' });
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid credentials' });

        const accessToken = generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);

        res.json({ accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login failed' });
    }
}

exports.refreshToken = async (req, res) => {

    try {
        const { token } = req.body;
        const user = verifyRefreshToken(token)
        const savedToken = await redisClient.get(`refreshToken:${user.id}`);

        if (token !== savedToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = generateAccessToken(user.id);
        const newRefreshToken = await generateRefreshToken(user.id);

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || erro });
    }

};

exports.logout = async (req, res) => {
    try {
        const { token } = req.body;
        const user = verifyRefreshToken(token)
        await redisClient.del(`refreshToken:${user._id}`); // Remove from Redis
        await RefreshToken.deleteOne({ token }); // Optionally remove from MongoDB
        res.status(200).json({ message: "Logged out" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || error });
    }
};