import http from 'k6/http';
import { sleep, group, check } from 'k6';
import { Trend, Rate } from 'k6/metrics';


let pageLoadTime = new Trend('page_load_time');
let errorRate = new Rate('errors');

// Configuration 
export const options = {
    scenarios: {
        user_journey: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                // Ramp-up [Start with 20 Virtual Users in first 1min]
                { duration: '1m', target: 20 },   
                // Ramp-up [Increase to 50 Virtual users after 1min]
                { duration: '3m', target: 50 },  
                // Ramp-up [Increase to 100 users after 4mins]
                { duration: '3m', target: 100 },   
                // Ramp-down [Decrease Virtual users to 50 after 7mins]
                { duration: '2m', target: 50 },  
                // Ramp-down [Decrease Virtual users to 0 after 9mins]
                { duration: '1m', target: 0 },    
            ],
            gracefulRampDown: '30s',
        },
    },
    thresholds: {
        'page_load_time': ['p(95)<800'], // 95% below 800ms
        'errors': ['rate<0.05'],         // Error rate below 5%
    },
};

// Base URL
const BASE_URL = 'https://reqres.in'; // Replace with your actual base URL

export default function () {
    group('User Journey: Home to Login to Dashboard', function () {
        // Step 1: Visit Base URL
        let homeRes = http.get(`${BASE_URL}`);
        pageLoadTime.add(homeRes.timings.duration);

        let homeSuccess = check(homeRes, {
            'Base URL is reachable and status code is 200 OK': (r) => r.status === 200,
        });

        errorRate.add(!homeSuccess);

        sleep(1);
        // Step 2: Login
        let payload = JSON.stringify({
            username: 'eve.holt@reqres.in',
            password: 'cityslicka',
        });

        let loginPostRes = http.post(`${BASE_URL}/api/login`, payload, {
            headers: { 'Content-Type': 'application/json' },
        });

        pageLoadTime.add(loginPostRes.timings.duration);

        let loginPostSuccess = check(loginPostRes, {
            'Login response status code is 200': (r) => r.status === 200,
            'Login successful': (r) => r.json('token') !== '',
        });

        errorRate.add(!loginPostSuccess);

        sleep(1);
    });
}