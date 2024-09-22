const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const redisClient = require('../config/redis');
const moment = require('moment');
const RefreshToken = mongoose.model('RefreshToken')

const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN || '10m' });
};

const generateRefreshToken = async (userId) => {
    const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET);

    const expiryDate = moment().add(7, 'days')

    await RefreshToken.deleteMany({ user: userId }); // Invalidate old tokens
    await redisClient.set(`refreshToken:${userId}`, refreshToken, 'EX', expiryDate.diff(moment(), 'seconds'))
    const token = new RefreshToken({ token: refreshToken, user: userId, expiryDate });
    await token.save();

    return refreshToken;
};

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {

        throw new Error('Invalid access token');
    }

};

const verifyRefreshToken = (token) => {

    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw new Error('Invalid refresh token');
    }

};

module.exports = { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
