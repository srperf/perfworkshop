FROM node:alpine

#ADD https://github.com/srperf/perfworkshop/raw/main/webservice/simple/simpleService.js ./

EXPOSE 1234
EXPOSE 1235

CMD wget -O simpleService.js https://github.com/srperf/perfworkshop/raw/main/webservice/simple/simpleService.js && \
    node ./simpleService.js