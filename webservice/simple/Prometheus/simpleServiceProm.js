const http = require('http');
const url = require('url');
const querystring = require('querystring');
const client = require('prom-client');

// Create and register metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics(); // Collect default system metrics

// Variable to control response delay (in milliseconds)
let responseDelayMin = 0;
let responseDelayMax = 0;

// Set the maximum and minimum response delay values
responseDelayMin = 1000; // Minimum delay in milliseconds
responseDelayMax = 5000; // Maximum delay in milliseconds

// Create a summary for tracking response times
const responseSummary = new client.Summary({
  name: 'http_response_duration_seconds',
  help: 'Summary of response durations',
  labelNames: ['method', 'status_code'],
  percentiles: [0.5, 0.9, 0.99], // Define percentiles to calculate
});

const server = http.createServer(async (req, res) => {
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
  } else if (parsedUrl.pathname === '/metrics') {
    // Serve Prometheus metrics
    res.setHeader('Content-Type', client.register.contentType);
    try {
      const metrics = await client.register.metrics(); // Ensure metrics are obtained as a string
      res.end(metrics);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error retrieving metrics');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

function handleRequest(res, myVariable) {
  const start = process.hrtime(); // Start timing

  const randomDelay = Math.random() * (responseDelayMax - responseDelayMin) + responseDelayMin;

  setTimeout(() => {
    const response = `Hello, ${myVariable}! Response delayed by ${randomDelay.toFixed(2)} milliseconds.`;
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(response);

    const [seconds, nanoseconds] = process.hrtime(start); // End timing
    const durationInSeconds = seconds + nanoseconds / 1e9;
    
    // Record the exact duration
    responseSummary.observe({ method: 'GET', status_code: '200' }, durationInSeconds);
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
