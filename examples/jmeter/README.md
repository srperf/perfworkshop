# JMeter examples
Here we have some JMeter scripts that will be used during the workshop

## Some JMeter commands
To run JMeter from CLI will use the following commands:
```bash
jmeter -n -t <ScriptToRun>.jmx -l <PathToResultFile>.jtl
```

After the test was run, if we open the result file we'll see a bunch of letter and numbers that are hard to read.
JMeter can help us with that:
```bash
jmeter -g <PathToResultFile>.jtl -o <PathToNewDashboardFolder>
```


## How to send variables to JMeter from CLI
In the following example we'll send Users=15, RampUp=30 and Duration=300 (5 minutes)
```bash
jmeter -n -t <ScriptToRun>.jmx -JUsers=15 -JRampUp=30 -JDuration=300 -l <PathToResultFile>.jtl
```

For more information please refer to JMeter oficial documentation at https://jmeter.apache.org/usermanual/