# Simple service instrumented with Prom Client

This section will guide you through the steps needed to observ utomatically your app's performance with Prometheus.

## Gathering needed libraries

Once you are in this folder (perfworkshop/webservice/simple/Prometheus) you must execute the following command to get the prometheus client for node.

```
npm install prom-client
```

## Starting the instrumented service

Once you have the client library, you can run the following code to start the service:

```
node simpleServiceProm.js
```

This will start the service. Once the service is running, go to [http://localhost:1234](http://localhost:1234) to trigger the service. You can do this multiple times.

## Test metrics exposed

Once you triggered the service, you can check the metrics generated at [http://localhost1234/metrics](http://localhost1234/metrics) to see the location that prometheus will be scraping.

## Config and start Prometheus

Now, for Prometheus to be able to scrape this app, change the config yml file (usually prometheus.yml) adding the following to the scraping section:

```
scrape_configs:
  - job_name: 'perf_workshop_app'
    static_configs:
      - targets: ['localhost:1234']
```

Once you saved the config yml file, start prometheus using the following command:

```
prometheus --config.file=path/to/prometheus.yml
```

## Visualizing results

Once Prometheus is running, go to [http://localhost:9090](http://localhost:9090) to launch the prometheus web platform. There click on the Graph tab and add the following PromQL:

```
http_response_duration_seconds{method="GET", status_code="200"}
```

This will display the response times from the times you triggered the service. You can trigger it a few more times and watch the metrics.

You can try other PromQL queries to display diverse metrics, have fun!

## One last thing

If you want fancier visualizations you can also configure Grafana to pull data from Prometheus and visualize lots of things.