# **SOAR ASSESSMENT [k6 Load Testing]**

This project uses **k6** to perform load and stress testing on a server endpoint. The goal is to evaluate the server's ability to handle a maximum of 100 concurrent users. The test scripts are designed to generate varying levels of traffic and report key performance metrics. The project is integrated with GitHub Actions for automated execution as part of the CI/CD pipeline.

---

## **Project Structure**

```bash
my-k6-project/
│
├── scripts/
│   ├── main_test.js          # Main test for both load and stress test
│   └── bdd.js        # Advanced stress test using BDD
│
├── .github/
│   └── workflows/
│       └── main.yml   # GitHub Actions workflow for running k6 tests
├── README.md                 # Project documentation (this file)
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
git clone https://github.com/rhydwharn/soar_k6.git
cd soar_k6
```

	2.	Run the tests locally:
```bash
k6 run scripts/main_test.js
```
## **GitHub Actions Integration**

The project is integrated with GitHub Actions to run k6 tests automatically in the CI/CD pipeline.

Sample GitHub Actions Workflow
```yaml
name: k6 Performance Tests

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  performance-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Install k6
        run: |
          sudo apt update
          sudo apt install -y gnupg software-properties-common ca-certificates curl
          curl -fsSL https://dl.k6.io/key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/k6-archive-keyring.gpg
          echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list > /dev/null
          sudo apt update
          sudo apt install -y k6

      - name: Run k6 Tests
        run: |
          k6 run scripts/main_test.js --out json=k6-results.json
          k6 run scripts/bdd.js --out json=k6-results.json

      - name: Upload Test Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: k6-results
          path: k6-results.json
```
