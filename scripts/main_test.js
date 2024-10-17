import http from 'k6/http';
import { sleep, check } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metric to track failed requests
let errorRate = new Rate('errors');

// Configuration
export const options = {
    // Stages for load and stress testing
    stages: [
        // Ramp-up to 50 virtual users within 2mins
        { duration: '2m', target: 50 },   
        // Stay at 50 users virtual users another 2mins
        { duration: '2m', target: 50 },   
        // Ramp-up to 100 virtual users after 4mins
        { duration: '2m', target: 100 },  
        // Stay at 100 virtual users for another 2mins
        { duration: '2m', target: 100 },  
        // Ramp-up to 150 users (stress the application beyond limit for another 2mins)
        { duration: '2m', target: 150 },  
        // Keep the spike at 150 virtual users for another 2mins
        { duration: '2m', target: 150 },  
        // Ramp-down to 0 virtual users
        { duration: '4m', target: 0 },    
    ],
    thresholds: {
        'http_req_duration': ['p(95)<500'], // 95% of requests should be below 500ms
        'errors': ['rate<0.1'],             // Error rate should be less than 10%
    },
};

// Base URL
const BASE_URL = 'https://reqres.in/api/users'; 

export default function () {
    // GET request on BASE URL
    let res = http.get(BASE_URL);

    // Assert the response status is 200
    let success = check(res, {
        'status is 200': (r) => r.status === 200,
    });

    // Record the error rate if there are any error
    errorRate.add(!success);

    // Pause for 1 second between iterations
    sleep(1);
}