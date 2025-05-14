const http = require("http");
const url = require("url");

const homePage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Selenium Test Page</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        #dynamicSection { margin-top: 20px; }
        #hiddenText { display: none; color: red; }
    </style>
    <script>
        function showAlert() {
            alert("Button clicked!");
        }
        function addElement() {
            let newElement = document.createElement("p");
            newElement.textContent = "This is a dynamically added element!";
            document.getElementById("dynamicSection").appendChild(newElement);
        }
        function toggleHidden() {
            let hiddenText = document.getElementById("hiddenText");
            hiddenText.style.display = hiddenText.style.display === "none" ? "block" : "none";
        }
        function showPopup() {
            window.open("/popup", "PopupWindow", "width=300,height=200");
        }
        function submitForm() {
            let inputValue = document.getElementById('formInput').value;
            window.location.href = '/result?input=' + encodeURIComponent(inputValue);
        }
        function submitName() {
            let nameValue = document.getElementById('nameInput').value;
            window.location.href = '/result?input=' + encodeURIComponent(nameValue);
        }
        function updateCounter() {
            let counter = document.getElementById("counter");
            counter.textContent = parseInt(counter.textContent) + 1;
        }
        function showDropdownSelection() {
            let dropdown = document.getElementById("dropdown");
            alert("You selected: " + dropdown.value);
        }
        setInterval(updateCounter, 1000);
    </script>
</head>
<body>

    <h1>Welcome to the Selenium Test Page</h1>

    <h2>1. Basic Button Click</h2>
    <button onclick="showAlert()">Click me</button>

    <h2>2. Form Submission</h2>
    <form onsubmit="event.preventDefault(); submitForm();" data-testid="test-form">
        <input type="text" id="formInput" data-testid="form-input" placeholder="Type something">
        <button type="submit" data-testid="submit-button">Submit Form</button>
    </form>

    <h2>3. Hidden Element</h2>
    <p id="hiddenText">This text was hidden!</p>
    <button onclick="toggleHidden()">Show/Hide Text</button>

    <h2>4. Dynamic Elements</h2>
    <button onclick="setTimeout(addElement, 2000)">Add Element After 2 Seconds</button>
    <div id="dynamicSection"></div>

    <h2>5. Live Counter</h2>
    <p>Counter: <span id="counter">0</span></p>

    <h2>6. Text Input & Button</h2>
    <input type="text" id="nameInput" placeholder="Enter your name">
    <button onclick="submitName()">Submit</button>

    <h2>7. Dropdown</h2>
    <select id="dropdown">
        <option value="Option 1">Option 1</option>
        <option value="Option 2">Option 2</option>
        <option value="Option 3">Option 3</option>
    </select>
    <button onclick="showDropdownSelection()">Select</button>

    <h2>8. Alert & Pop-up</h2>
    <button onclick="showPopup()">Open Pop-up</button>

    <h2>9. Simple Table</h2>
    <table border="1">
        <tr><th>Name</th><th>Age</th></tr>
        <tr><td>Alice</td><td>25</td></tr>
        <tr><td>Bob</td><td>30</td></tr>
    </table>

    <h2>10. Link Navigation</h2>
    <a href="/about">Go to About Page</a>

</body>
</html>
`;

const resultPage = (userInput) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Submission Result</title>
    <style> body { font-family: Arial, sans-serif; padding: 20px; } </style>
</head>
<body>
    <h1>Submission Received</h1>
    <p data-testid="result-text">You entered: <strong>${userInput}</strong></p>
    <a href="/" data-testid="back-link">Go Back to Main Page</a>
</body>
</html>
`;

const aboutPage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Page</title>
    <style> body { font-family: Arial, sans-serif; padding: 20px; } </style>
</head>
<body>
    <h1>About Page</h1>
    <p>This is a test page for Selenium navigation.</p>
    <a href="/">Go Back to Main Page</a>
</body>
</html>
`;

const popupPage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Popup</title>
    <style> body { font-family: Arial, sans-serif; padding: 20px; text-align: center; } </style>
</head>
<body>
    <h1>This is a pop-up!</h1>
</body>
</html>
`;

function randomDelay(min, max, callback) {
    let delay = Math.floor(Math.random() * (max - min + 1)) + min;
    setTimeout(callback, delay);
}

const MIN_DELAY = 500;   // Minimum delay in ms
const MAX_DELAY = 3000;  // Maximum delay in ms

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    function respondWith(content) {
        randomDelay(MIN_DELAY, MAX_DELAY, () => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(content);
        });
    }
    randomDelay(MIN_DELAY, MAX_DELAY, () => {
        if (req.url === "/") {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(homePage);
        } else if (parsedUrl.pathname === "/result") {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(resultPage(parsedUrl.query.input || "Nothing entered"));
        } else if (req.url === "/about") {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(aboutPage);
        } else if (req.url === "/popup") {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(popupPage);
        } else {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end("<h1>404 Not Found</h1>");
        }
    });
});

server.listen(4000, () => {
    console.log("Server running at http://localhost:4000");
});
