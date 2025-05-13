# Getting InfluxDB 1.8

There are some steps needed to download and get InfluxDB running.

## Downloading InfluxDB
Go to https://www.influxdata.com/downloads/

Select the OSS version InfluxDB 1.x and download the binaries for your OS.

** AVOID INSTALLERS OR VERSIONS 2 or 3!!!!!!!!!**

## Configure InfluxDB
InfluxDB requieres some config steps to work precisely as we want.

But do not worry, you can just run influxd (exe or bs) to start the service. We will use this as it is the most straight forward.

If you want further info on specific config go to https://docs.influxdata.com/influxdb/v1.8/introduction/install/

## Creating databases for the workshop
During the workshop we will create two databases inside of InfluxDB, one for k6 and one for JMeter.
To do so:
- Start the InfluxDB service
- Open influx.exe (This is the CLI, it will connect automatically to your running local InfluxDB)
- Type the following commands
    - create database k6
    - create database jmeter

With this we will be ready to roll.

# Alternative - Docker
An easier way is to get Influx in a Docker container.
```bash
RUN docker run -d --name=influxdb -p 8086:8086 influxdb:1.8
```

# Cool Influx commands
During the workshop we will be doind some cool things with Influx.
As an example you can do queries from just a browser.
Examples:
- http://localhost:8086/query?db=k6&q=SELECT * FROM http_req_duration
- http://localhost:8086/query?db=jmeter&q=SELECT * FROM measures
- http://localhost:8086/query?db=k6&pretty=true&q=SELECT * FROM http_req_duration

You can also insert data in a similar way. Although for complex elements it requires some json and other formats for the post.
