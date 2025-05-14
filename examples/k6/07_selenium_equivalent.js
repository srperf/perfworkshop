import { browser } from 'k6/browser';
import { check } from 'k6';
import exec from 'k6/execution';
//import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

export const options = {
  scenarios: {
    browser: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    'browser_web_vital_lcp': ['p(90) < 5000'], // Largest Contentful Paint
    'browser_web_vital_fid': ['p(90) < 100'],   // First Input Delay
    'browser_web_vital_cls': ['p(90) < 0.1'],   // Cumulative Layout Shift
  },
};

export default async function () {
  const page = await browser.newPage();

  // Test 1: Page Load
  try {
    const pageLoadStart = Date.now();
    await page.goto('http://localhost:4000');
    const pageLoadDuration = Date.now() - pageLoadStart;
    
    console.log(`✅ Page is up! Load time: ${pageLoadDuration} ms`);
  } catch (error) {
    console.error('❌ Page is DOWN:', error.message);
    exec.test.abort();
  }

  // Test 2: Form Submission
  try {
    const formInput = page.locator('[data-testid="form-input"]');
    await formInput.type('Selenium Test');
    
    const submitButton = page.locator('[data-testid="submit-button"]');
    
    const submissionStart = Date.now();
    await submitButton.click();
    
    // Wait for navigation and check result
    //await page.waitForNavigation();
    const submissionDuration = Date.now() - submissionStart;
    
    const resultText = await page.locator('[data-testid="result-text"]').textContent();
    check(resultText, {
      'form submission successful': (text) => text.includes('You entered: Selenium Test'),
    });
    
    console.log(`✅ Form submission successful! Load time: ${submissionDuration} ms`);
  } catch (error) {
    console.error('❌ Form submission test failed:', error);
  }

  // Test 3: Navigation Back
  try {
    const backLink = page.locator('[data-testid="back-link"]');
    
    const navigationStart = Date.now();
    await backLink.click();
    // Wait for navigation back to home page
    //await page.waitForNavigation();
    const navigationDuration = Date.now() - navigationStart;
    
    check(page.url(), {
      'navigation back successful': (url) => url === 'http://localhost:4000/',
    });
    
    console.log(`✅ Navigation back successful! Load time: ${navigationDuration} ms`);
  } catch (error) {
    console.error('❌ Navigation test failed:', error.toString());
  }

  page.close();
}

/*export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
} */