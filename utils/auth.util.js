// const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// dotenv.config();


const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRE_IN = process.env.ACCESS_TOKEN_EXPIRE_IN || '10m';
if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) { 
    console.error('Access token and refresh token secrets not found in.env file');
    process.exit(1);
}

function generateAccessToken(user) {
    return jwt.sign({ id: user.id, username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRE_IN });
}


module.exports = { generateAccessToken };