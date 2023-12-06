# prometheus image for the perf workshop, staright and simple.
# do not care about it stayin alive or config other than CMD params
FROM prom/prometheus

# expose the Prometheus server port
EXPOSE 9090

# set the entrypoint command
ENTRYPOINT [ "prometheus", \
             "--storage.tsdb.retention=30d", \
             "--web.console.libraries=/usr/share/prometheus/console_libraries", \
             "--web.console.templates=/usr/share/prometheus/consoles", \
             "--web.external-url=http://localhost:9090", \
             "--web.enable-remote-write-receiver", \
             "--log.level=info", \
             "--log.format=logger:stderr" ]