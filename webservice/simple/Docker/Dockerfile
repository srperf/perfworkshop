FROM node:latest

#ADD https://github.com/srperf/perfworkshop/raw/main/webservice/simple/simpleService.js ./

EXPOSE 1234

CMD wget https://github.com/srperf/perfworkshop/raw/main/webservice/simple/simpleService.js && \
    node ./simpleService.js