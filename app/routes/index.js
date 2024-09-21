
const app = require('express').Router();;
const { authenticate, authLimit } = require('../middlewares/auth');
const authRoutes = require('./auth');
const todoRoutes = require('./todo');


app.use('/auth',authLimit, authRoutes);
app.use('/todo',authenticate, todoRoutes)


module.exports = app;