# Super simple service

This is a really simple ans straight forward service that we will use in our aoutomations.

To run it you will need to have Node installed.
Go to https://nodejs.org/en/download and install node.

Then go to the folder where the webservice files are located (perworkshop/webservice/simple) and type:
```bash
node simpleService.js
```

Once changes to the service are done, stop the service (ctrl + c) and run again to see the changes reflected.

Once the service is running it will respond on

http://localhost:1234

During the exercise we will update the port and the duration of the response times.

Additionally we will do some exercises sending parameters.
It will be received through a variable called myVariable. Whatever is sent in this variable will be posted in the response.

http://localhost:1234/?myVariable=Hola
