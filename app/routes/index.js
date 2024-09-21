
const app = require('express').Router();;
const authRoutes = require('./auth');


app.use('/auth', authRoutes);


module.exports = app;