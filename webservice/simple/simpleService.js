const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Variable to control response delay (in milliseconds)
let responseDelayMin = 0;
let responseDelayMax = 0;

// Set the maximum and minimum response delay values
responseDelayMin = 1000; // Minimum delay in milliseconds
responseDelayMax = 5000; // Maximum delay in milliseconds

// POST endpoint
app.post('/hello', (req, res) => {
    // Extract parameters from the request body (if provided)
    const name = req.body.name || 'World';

    // Generate a random delay within the specified range
    const randomDelay = Math.random() * (responseDelayMax - responseDelayMin) + responseDelayMin;

    // Set the response delay and send the response
    setTimeout(() => {
        const response = `Hello, ${name}! Response delayed by ${randomDelay.toFixed(2)} milliseconds.`;
        res.send(response);
    }, randomDelay);
});

// Start the server
const port = 1234;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
