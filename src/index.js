const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize express app
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logger middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Empty route handler
app.all('/empty', (req, res) => {
    try {
        // Create a formatted output object
        const requestInfo = {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            headers: req.headers,
            query: req.query,
            body: req.body,
            params: req.params
        };

        // Log the request info to console
        console.log('Incoming Request to /empty:');
        console.log('========================');
        console.log(JSON.stringify(requestInfo, null, 2));

        // Send a formatted response
        res.json({
            message: 'Request received successfully',
            requestInfo: requestInfo
        });
    } catch (error) {
        console.error('Error processing /empty request:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Health check route
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Root route
app.get('/', (req, res) => {
    res.status(200).send('Server is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found'
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
