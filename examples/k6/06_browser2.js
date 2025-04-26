import { browser } from 'k6/experimental/browser';
import http from 'k6/http';

export const options = {
    scenarios: {
        ui: {
            executor: 'constant-vus',
            exec: 'uiTest',
            vus: 1,
            duration: '1m',
        },
    },
};

function sendToInflux(measurement, action, status, duration = 0, errorMessage = "", extraFields = {}) {
    let fieldString = `status=${status},duration=${duration},error_message="${errorMessage}"`;

    // Add any extra fields (like navigationTiming metrics)
    for (const [key, value] of Object.entries(extraFields)) {
        fieldString += `,${key}=${value}`;
    }

    const payload = `${measurement},action=${action} ${fieldString}`;

    const headers = {
        'Content-Type': 'text/plain',
    };

    const res = http.post('http://localhost:8086/write?db=selenium', payload, { headers: headers });
    if (res.status === 204) {
        console.log(`✅ Sent ${action} to InfluxDB under ${measurement}`);
    } else {
        console.error(`❌ Failed to send ${action} to InfluxDB. Status: ${res.status}`);
    }
}

// Helper to extract performance timings
async function getPerformanceMetrics(page) {
    const metrics = await page.evaluate(() => {
        const timing = performance.timing;
        return {
            domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
            loadEvent: timing.loadEventEnd - timing.navigationStart,
        };
    });
    return metrics;
}

export async function uiTest() {
    const page = browser.newPage();

    let startTime, duration;

    try {
        console.log("Checking if the main page is available...");

        startTime = Date.now();
        await page.goto('http://localhost:4000', { waitUntil: 'load' });
        duration = Date.now() - startTime;

        const navMetrics = await getPerformanceMetrics(page);

        console.log(`✅ Page is up! Load time: ${duration} ms`);
        console.log(`📊 Navigation metrics:`, navMetrics);

        sendToInflux("page_load", "page_availability", 1, duration, "", navMetrics);
    } catch (error) {
        console.error("❌ Page is DOWN:", error.message);
        sendToInflux("page_load", "page_availability", 0, 0, error.message);
        await page.close();
        return;
    }

    // Functional Test: Form Submission
    try {
        console.log("Testing form submission...");
        const inputField = await page.locator('#formInput');
        if (!await inputField.isVisible()) {
            throw new Error("Element 'formInput' not found - Possible script issue");
        }
        await inputField.type('Selenium Test');

        const submitButton = await page.locator('button:text("Submit Form")');
        if (!await submitButton.isVisible()) {
            throw new Error("Submit button not found - Possible script issue");
        }

        startTime = Date.now();
        await Promise.all([
            page.waitForNavigation(),
            submitButton.click()
        ]);
        duration = Date.now() - startTime;

        const resultText = await page.locator('p').textContent();
        if (resultText.trim() === 'You entered: Selenium Test') {
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
        const backButton = await page.locator('a');
        if (!await backButton.isVisible()) {
            throw new Error("Navigation link not found - Possible script issue");
        }

        startTime = Date.now();
        await Promise.all([
            page.waitForNavigation({ url: 'http://localhost:4000/' }),
            backButton.click()
        ]);
        duration = Date.now() - startTime;

        console.log(`✅ Navigation back successful! Load time: ${duration} ms`);
        sendToInflux("functional_test", "navigation_back", 1, duration);
    } catch (error) {
        console.error("❌ Navigation test failed:", error.message);
        sendToInflux("functional_test", "navigation_back", 0, 0, error.message);
    }

    console.log("✅✅✅✅ All tests completed!");
    await page.close();
}
