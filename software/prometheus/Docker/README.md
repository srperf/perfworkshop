# Run Prometheus in docker
I have created two options for you.

## Just run my image
I have uploaded an image to the docker repositories so you can just run a command and have it. It comes from the oficial prometheus docker image.

To get it type:
'''
docker run -d -p=9090:9090 srperf/workshop_prom
'''

## Use the Dockerfile here
In this directory is a [Dockerfile](./Dockerfile) you can use to create the image yourself.
Example commands:
'''
cd [Path of the dockerimage file]
docker build -t="YourUID/YourDesiredName" .
docker run -d -p=9090:9090 YourUID/YourDesiredName
'''

Just set your path in those commands and add your docker UID and name it however you like.