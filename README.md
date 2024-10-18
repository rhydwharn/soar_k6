# **SOAR ASSESSMENT [k6 Load Testing]**

This project uses **k6** to perform load and stress testing on a server endpoint. The goal is to evaluate the server's ability to handle a maximum of 100 concurrent users. The test scripts are designed to generate varying levels of traffic and report key performance metrics. The project is integrated with GitHub Actions for automated execution as part of the CI/CD pipeline.

---

## **Project Structure**

```bash
my-k6-project/
│
├── scripts/
│   ├── load_test.js          # Basic load test simulating 100 users
│   └── stress_test.js        # Advanced stress test for higher loads
│
├── data/
│   ├── test_data.json        # Sample data used in the tests
│   └── ...                   # Additional data files
│
├── .github/
│   └── workflows/
│       └── k6_pipeline.yml   # GitHub Actions workflow for running k6 tests
├── k6config.json             # k6 configuration file for stages and thresholds
├── README.md                 # Project documentation (this file)
└── LICENSE                   # License file
```
**Prerequisites**

	1.	k6 installed on your local machine (if running tests locally):
	•	macOS: brew install k6
	•	Windows: choco install k6
	•	Docker: docker pull grafana/k6
	2.	GitHub Actions set up for CI/CD pipeline execution.
 
**Installation**

	1.	Clone the repository:
```bash
git clone https://github.com/your-username/my-k6-project.git
cd my-k6-project
```

	2.	Run the tests locally:
```bash
k6 run scripts/load_test.js
```
## **GitHub Actions Integration**

The project is integrated with GitHub Actions to run k6 tests automatically in the CI/CD pipeline.

Sample GitHub Actions Workflow
```yaml
name: k6 Load Test

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  load_test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      
      - name: Install k6
        run: |
          sudo apt update
          sudo apt install -y k6

      - name: Run k6 load test
        run: |
          k6 run scripts/load_test.js

      - name: Upload Results
        uses: actions/upload-artifact@v2
        with:
          name: load-test-results
          path: ./results/
```
