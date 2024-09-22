require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const connectDB = require('./app/config/database');
const redisClient = require('./app/config/redis');

const path = require('path');
const fs = require('fs');


const app = express();
const port = process.env.PORT || 3000;


const modelsPath = path.join(__dirname, 'app/models');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));

// Bootstrap models
fs.readdirSync(modelsPath)
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
        require(path.join(modelsPath, file)); // Load all models
    });

// Database Connection
connectDB();

const apiRoutes = require('./app/routes'); // Route for blogs

app.use('/api', apiRoutes);

// 404 response
app.use((req, res) => {
    res.status(404).send({ message: 'Not Found' });
});
// Basic error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'An error occurred!' });
});

// Graceful shutdown
const shutdown = async () => {
    await redisClient.quit();
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});