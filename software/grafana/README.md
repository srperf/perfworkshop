# Getting Grafana
There are several ways to get Grafana locally in your computer.
To download it, go to https://grafana.com/grafana/download

Select the steps adequate to your OS.

An easy way is to use docker.
```bash
docker run -d --name=grafana -p 3000:3000 grafana/grafana-enterprise
```

Make sure to have grafana up and running for the workshop.
We will configure any further details then.