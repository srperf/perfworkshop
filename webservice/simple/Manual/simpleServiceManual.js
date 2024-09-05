const http = require('http');
const url = require('url');
const querystring = require('querystring');

// Variable to control response delay (in milliseconds)
let responseDelayMin = 0;
let responseDelayMax = 0;

// Set the maximum and minimum response delay values
responseDelayMin = 1000; // Minimum delay in milliseconds
responseDelayMax = 5000; // Maximum delay in milliseconds

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    const query = querystring.parse(parsedUrl.query);
    const myVariable = query.myVariable || 'World';

    if (req.method === 'GET' && parsedUrl.pathname === '/') {
        handleRequest(res, myVariable);
    } else if (req.method === 'POST' && parsedUrl.pathname === '/') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            const postQuery = querystring.parse(body);
            const postMyVariable = postQuery.myVariable || 'World';
            handleRequest(res, postMyVariable);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

function handleRequest(res, myVariable) {
    const randomDelay = Math.random() * (responseDelayMax - responseDelayMin) + responseDelayMin;

    setTimeout(() => {
        const response = `Hello, ${myVariable}! Response delayed by ${randomDelay.toFixed(2)} milliseconds.`;
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(response);
    }, randomDelay);
}

const port = 1234;
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

process.on('SIGTERM', () => {
    // Cleanup tasks
    process.exit(0);
  });
