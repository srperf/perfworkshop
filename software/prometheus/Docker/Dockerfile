# prometheus image for the perf workshop, staright and simple.
# do not care about it stayin alive or config other than CMD params
FROM prom/prometheus

# expose the Prometheus server port
EXPOSE 9090

CMD [ "--config.file=/etc/prometheus/prometheus.yml", \
     "--web.enable-remote-write-receiver" ]