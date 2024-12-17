import { browser } from 'k6/browser';
import { sleep } from 'k6';

export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    checks: ['rate==1.0'],
  },
};

export default async function () {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {

    await page.goto("http://localhost:4000");

    await page.locator('a[href="/about"]').click();

    sleep(1);

    await page.locator('a[href="/"]').click();

  } finally {

    await page.close();

  }
}
