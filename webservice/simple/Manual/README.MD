# Simple service instrumented Manually

Here we will instrument manually our app. I want to use InfluxDB to log the response time metrics. super straight forward.

## Instrument function

Check the file [instrument.js](./instrument.js) where you will find the code used to receive the duration metric, and send it as a post to influxdb.

The point of this is to show how you can manually instrument almost anything.

To make this work, we will improt the function in our simpleService file with this:

```
const { sendDataToInflux } = require('./instrument');
```

And then we will implement simple functions to start and end a timer and then send the result to the function.

```
    const startTime = Date.now();
    const randomDelay = Math.random() * (responseDelayMax - responseDelayMin) + responseDelayMin;
    setTimeout(() => {
        const response = `Hello, ${myVariable}! Response delayed by ${randomDelay.toFixed(2)} milliseconds.`;
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(response);
        // Capture end time and calculate duration
        const duration = Date.now() - startTime;
        
        // Send duration to InfluxDB
        sendDataToInflux(duration);
    }, randomDelay);
```

## Configure influxdb

We are using influxdb to receive the metrics. The instrumentation file requires the database **perfWS** to be created before you send metrics to it.

First log to InfluxDB using the CLI and run the following command:

```
create database perfWS
```

Once the database is created you can start the service running:

```
node simpleServiceManual.js
```

Then access the service endpoint at [http://localhost:1234](http://localhost:1234) and refresh it a few times. InfluxDB should have received the duration metrics.

## Viewing the metrics

You could use InfluxDB CLI and execute a query to view the metrics stored:

```
use database perfWs
select * from response_times
```

Alternatively if your InfluxDB is configured locally and default ports you can access [http://localhost:8086/query?db=perfWS&q=select%20*%20from%20response_times&pretty=true](http://localhost:8086/query?db=perfWS&q=select%20*%20from%20response_times&pretty=true)

## Visualizing in Grafana

You can visualize the data in Grafana following the next steps:

- Create a data source to your InfluxDB
- Create or access a Dashboard
- Create a new visualization and configure it to Time Series
- Add the influx data source and the query select * from response_times
- Enjoy