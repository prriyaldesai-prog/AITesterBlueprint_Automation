# Playwright API Context Testing Framework (RICE-POT)

This repository contains a professional, scalable API automation framework built using **Playwright**, **TypeScript**, and the **Page Object Model (POM)**. It is structured to simulate, automate, and test authentication/login endpoints for Amazon.in (`https://www.amazon.in/`) using a local mock server strategy.

---

## Original Prompt Context

Below is the prompt that defined the requirements and structure of this framework:

```text
My objective is : I need an entire playwright API context framework RICE POT framework, also take reference of skill.ms file attached here for ricepot. 

Role is to act as a 15 year QA automation engineer in API automation. 

Instructions: create API automation tests and take https://www.amazon.in/ application and includes all the different API tests that can be covered. Do not include any other functional tests or non functional tests, only API tests are requried.

Context: you can take reference of :https://www.amazon.in/ login page and create API tests for its login page.

Example: you can include tests like unauthorized access for protected endpoints, expired missing or incorrect tokens, rate limit, multiple API hits, body and responce parameters, tampering endpoints and https status codes,etc and also include security related testcases.

parameters: I need critical testcases,edge testcases , negative scenarios that are easy to understand in the framework, use typescript with playwright and use its framework.

output: I need output in table format also in another file you can attach it in the framework, but I want the entire API automation framework to be easy to understand, scalable , manageable and using page object model and data driven testing with reports and everything in framework should be included.

Tone: It should be created technically and create everything inside @[c:\Users\123\OneDrive\Priyal\AITesterBlueprint3x\Practice_playwright_API_context_framework] also create a readme.md seperate file inside this folder and also add this entire prompt there.
```

---

## Directory Structure

```text
Practice_playwright_API_context_framework/
├── docs/
│   └── TestCasesTable.md           # Full Markdown Matrix of all Test Cases
├── src/
│   ├── api/
│   │   ├── BaseAPI.ts              # Custom wrapper for Playwright APIRequestContext
│   │   └── AmazonAuthAPI.ts        # POM representing signin/token/profile endpoints
│   ├── data/
│   │   └── loginTestData.ts        # Data-driven test datasets (DDT)
│   ├── mock/
│   │   └── MockServer.ts           # Local Node.js mock HTTP server
│   ├── tests/
│   │   └── login.spec.ts           # Playwright Test Suite
│   └── utils/
│       ├── global-setup.ts         # Starts the Mock Server before runs
│       └── global-teardown.ts      # Shuts down the Mock Server post-runs
├── package.json                    # Project metadata and dependencies
├── playwright.config.ts            # Playwright execution configuration
├── tsconfig.json                   # TypeScript compiler configuration
└── README.md                       # Documentation & prompt (this file)
```

---

## Core Framework Design Patterns

### 1. Page Object Model (POM) for API
We treat REST/HTTP endpoints as pages. 
* [BaseAPI.ts](file:///c:/Users/123/OneDrive/Priyal/AITesterBlueprint3x/Practice_playwright_API_context_framework/src/api/BaseAPI.ts) provides a unified base class to execute HTTP requests (GET, POST, etc.) and implements central request/response logging so that test failures are immediately readable from terminal outputs and reports.
* [AmazonAuthAPI.ts](file:///c:/Users/123/OneDrive/Priyal/AITesterBlueprint3x/Practice_playwright_API_context_framework/src/api/AmazonAuthAPI.ts) inherits from `BaseAPI` and maps specific login endpoints (`/ap/signin`, `/ap/token`, `/ap/secure-profile`) to typed methods.

### 2. Local Mock Server Strategy
To test rate limiting, security tampering, header manipulation, and negative flows safely and deterministically without getting blocked by Amazon's security controls (WAF, CAPTCHAs) or breaching usage policies:
* We run a lightweight Node.js HTTP server ([MockServer.ts](file:///c:/Users/123/OneDrive/Priyal/AITesterBlueprint3x/Practice_playwright_API_context_framework/src/mock/MockServer.ts)) on port `3001` locally.
* The mock server simulates the API endpoints, processing, headers, token validity (expired vs. active), SQL injections, and stateful IP-based request counting (rate limiting).
* Integrated with Playwright using hooks: [global-setup.ts](file:///c:/Users/123/OneDrive/Priyal/AITesterBlueprint3x/Practice_playwright_API_context_framework/src/utils/global-setup.ts) and [global-teardown.ts](file:///c:/Users/123/OneDrive/Priyal/AITesterBlueprint3x/Practice_playwright_API_context_framework/src/utils/global-teardown.ts) guarantee the server runs in the background for the duration of the tests.

### 3. Data-Driven Testing (DDT)
Test data is kept separate from logic:
* [loginTestData.ts](file:///c:/Users/123/OneDrive/Priyal/AITesterBlueprint3x/Practice_playwright_API_context_framework/src/data/loginTestData.ts) holds arrays of invalid combinations, tampered bodies, SQL injection payloads, and token types.
* The test file loops dynamically over these scenarios, generating test cases programmatically.

---

## Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 2. Installation
Open your terminal inside this folder and run:
```bash
npm install
```
This installs Playwright Test, TypeScript, and standard types.

### 3. Running the Tests
To execute the suite:
```bash
npm test
```
The test suite starts the local server, runs all 16 test cases, asserts response codes, headers, and bodies, and shuts the server down.

### 4. Viewing the HTML Report
If a test fails or you want to check test execution logs:
```bash
npx playwright show-report
```

---

## Test Cases Documented
For the list of all 16 test cases covering negative scenarios, edge cases, rate limits, and security vulnerabilities, please refer to:
* **[TestCasesTable.md](file:///c:/Users/123/OneDrive/Priyal/AITesterBlueprint3x/Practice_playwright_API_context_framework/docs/TestCasesTable.md)**
