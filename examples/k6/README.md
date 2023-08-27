# k6 examples
Here we have some k6 scripts that will be used during the workshop

## Cool k6 commands
We will use some cool commands to make things easier.
Run the k6 script:
```bash
k6 run <ChooseScript>.js
```

That was very simple, lets try something else.


Run the k6 script with 5 users for 30 seconds:
```bash
k6 run --vus 5 --duration 30s <ChooseScript>.js
```
This is great, let's send these results somewhere.
Send results to your InfluxDB instance:
```bash
k6 run --vus 5 --duration 30s --out influxdb=http://localhost:8086/k6 <ChooseScript>.js
```

You can send results as well to Prometheus and multiple other databases. For more info please refer to the k6 docs at https://k6.io/docs

To visualize we will need some other details, refer to the Grafana and InfluxDB section.