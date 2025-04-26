const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const http = require("http");

// Function to send data to InfluxDB
async function sendToInflux(measurement, action, status, duration = 0, errorMessage = "") {
    const data = `${measurement},action=${action} status=${status},duration=${duration},error_message="${errorMessage}"`;

    const options = {
        hostname: "localhost",
        port: 8086,
        path: "/write?db=selenium",
        method: "POST",
        headers: {
            "Content-Type": "text/plain",
            "Content-Length": Buffer.byteLength(data),
        },
    };

    const req = http.request(options, (res) => {
        if (res.statusCode === 204) {
            console.log(`✅ Sent ${action} data to InfluxDB under ${measurement}`);
        } else {
            console.error(`❌ Failed to send data to InfluxDB. Status: ${res.statusCode}`);
        }
    });

    req.on("error", (error) => {
        console.error("❌ Error sending data to InfluxDB:", error.message);
    });

    req.write(data);
    req.end();
}

(async function runTests() {
    let options = new chrome.Options();
    options.addArguments("--headless=new", "--disable-gpu", "--window-size=1920,1080");

    let driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    let startTime, duration, status;

    try {
        console.log("Checking if the main page is available...");

        startTime = Date.now();
        await driver.get("http://localhost:4000");
        duration = Date.now() - startTime;

        console.log(`✅ Page is up! Load time: ${duration} ms`);
        sendToInflux("page_load", "page_availability", 1, duration);
    } catch (error) {
        console.error("❌ Page is DOWN:", error.message);
        sendToInflux("page_load", "page_availability", 0, 0, error.message);
        await driver.quit();
        return; // Exit early if the page is down
    }

    // Functional Test: Form Submission
    try {
        console.log("Testing form submission...");
        let inputField = await driver.findElement(By.id("formInput")).catch(() => {
            throw new Error("Element 'formInput' not found - Possible script issue");
        });
        await inputField.sendKeys("Selenium Test");

        let submitButton = await driver.findElement(By.xpath("//button[text()='Submit Form']")).catch(() => {
            throw new Error("Submit button not found - Possible script issue");
        });

        startTime = Date.now();
        await submitButton.click();
        await driver.wait(until.urlContains("/result"), 5000);
        duration = Date.now() - startTime;

        let resultText = await driver.findElement(By.tagName("p")).getText();
        if (resultText === "You entered: Selenium Test") {
            console.log(`✅ Form submission successful! Load time: ${duration} ms`);
            sendToInflux("functional_test", "form_submission", 1, duration);
        } else {
            throw new Error("Incorrect result text");
        }
    } catch (error) {
        console.error("❌ Form submission test failed:", error.message);
        sendToInflux("functional_test", "form_submission", 0, 0, error.message);
    }

    // Functional Test: Navigation Back
    try {
        console.log("Testing navigation back...");
        let backButton = await driver.findElement(By.tagName("a")).catch(() => {
            throw new Error("Navigation link not found - Possible script issue");
        });

        startTime = Date.now();
        await backButton.click();
        await driver.wait(until.urlIs("http://localhost:4000/"), 5000);
        duration = Date.now() - startTime;

        console.log(`✅ Navigation back successful! Load time: ${duration} ms`);
        sendToInflux("functional_test", "navigation_back", 1, duration);
    } catch (error) {
        console.error("❌ Navigation test failed:", error.message);
        sendToInflux("functional_test", "navigation_back", 0, 0, error.message);
    }

    console.log("✅✅✅✅ All tests completed!");
    await driver.quit();
})();
