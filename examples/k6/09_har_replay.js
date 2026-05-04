import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000';

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<3000'],
  },
};

function getAndCheck(path, name) {
  const response = http.get(`${BASE_URL}${path}`, {
    tags: { name },
  });

  check(response, {
    [`${name} status is 200`]: (r) => r.status === 200,
  });
}

export default function () {
  group('HAR replay: WebSiteRecording', () => {
    // Step 1 - Home page load
    getAndCheck('/', 'home-initial');
    sleep(1);

    // Step 2 - Form submit navigation with input "Da form"
    getAndCheck('/result?input=Da%20form', 'result-da-form');
    sleep(1);

    // Step 3 - Navigate back to home
    getAndCheck('/', 'home-after-first-result');
    sleep(1);

    // Step 4 - Second submit navigation with input "Input"
    getAndCheck('/result?input=Input', 'result-input');
    sleep(1);

    // Step 5 - Navigate back to home
    getAndCheck('/', 'home-after-second-result');
    sleep(1);

    // Step 6 - Navigate to about page
    getAndCheck('/about', 'about-page');
    sleep(1);

    // Step 7 - Navigate back to home from about page
    getAndCheck('/', 'home-final');
  });
}
