const http = require('http');

// Variable to control response delay (in milliseconds)
let responseDelayMin = 0;
let responseDelayMax = 0;

// Set the maximum and minimum response delay values
responseDelayMin = 500; // Minimum delay in milliseconds
responseDelayMax = 1000; // Maximum delay in milliseconds

// Create an HTTP server
const server = http.createServer((req, res) => {
    // Extract query parameter from the URL
    const name = req.url.includes('?myVariable=') ? req.url.split('=')[1] : 'World';

    // Generate a random delay within the specified range
    const randomDelay = Math.random() * (responseDelayMax - responseDelayMin) + responseDelayMin;

    // Set the response delay and send the response
    setTimeout(() => {
        const response = `Hello, ${name}! Response delayed by ${randomDelay.toFixed(2)} milliseconds.`;
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(response);
    }, randomDelay);
});

// Start the server
const port = 1234;
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
