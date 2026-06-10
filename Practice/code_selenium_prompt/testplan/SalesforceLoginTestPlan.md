# Test Plan: Salesforce.com Login Automation

## 1. Document Control
* **Project Name**: Salesforce CRM Login Automation
* **Version**: 1.0.0
* **Author**: QA Automation Specialist (15 Years Experience)
* **Date**: June 1, 2026

---

## 2. Objectives & Scope
### 2.1 Objectives
Define the test strategy, list test scenarios, and outline execution procedures for validating the Salesforce login functionality at `https://login.salesforce.com/?locale=in`. 
The framework is designed to verify both valid and invalid login scenarios in a robust, automated fashion using Selenium, Java, Maven, and TestNG.

### 2.2 Scope of Testing
* **In-Scope**:
  - UI Verification of the login screen.
  - Verification of Remember Me checkbox state.
  - Validation of error handling for incorrect credentials (username/password combo).
  - Validation of boundary/empty field submissions.
  - Automated execution via TestNG.
* **Out-of-Scope**:
  - Multi-Factor Authentication (MFA) bypass (treated as a successful login indicator or transition to the OTP screen).
  - Password reset flows ("Forgot Your Password?").
  - Third-party social logins (Google, custom domains).

---

## 3. Test Environment & Specifications
* **Base URL**: `https://login.salesforce.com/?locale=in`
* **Programming Language**: Java 17
* **Testing Framework**: TestNG (7.9.0)
* **Web Automation Tool**: Selenium WebDriver (4.18.0)
* **Build Automation Tool**: Maven
* **Target Browsers**: Google Chrome (Headless / Headful)

---

## 4. Test Strategy & Architecture
The framework leverages the **Page Object Model (POM)** pattern powered by Selenium's **PageFactory** utility.
* **Locator Policy**: Strict adherence to XPath-only locators. Use of ID, Name, CSS selectors, or other locator strategies is prohibited in the code elements.
* **Synchronization**: Avoidance of `Thread.sleep()`. All dynamic elements are managed using `WebDriverWait` (Explicit Waits).
* **Exception Handling**: Every interaction in the POM is enclosed in standard try-catch blocks with detailed console output logging for robustness.
* **Configuration Management**: A `pom.xml` handles dependency resolution automatically.

---

## 5. Test Cases Matrix

| Test Case ID | Test Case Name | Pre-conditions | Test Steps | Input Data | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_LGN_001** | Valid Login Test | Browser is open; user is on Salesforce login page. | 1. Enter valid username.<br>2. Enter valid password.<br>3. Click "Log In" button. | Username: `test_user@salesforce.com`<br>Password: `ValidPass123!` | User transitions to home page or prompt for verification code (MFA) page. |
| **TC_LGN_002** | Invalid Login - Bad PW | Browser is open; user is on Salesforce login page. | 1. Enter valid username.<br>2. Enter invalid password.<br>3. Click "Log In" button. | Username: `test_user@salesforce.com`<br>Password: `WrongPass1` | Error message displayed: *"Please check your username and password..."* |
| **TC_LGN_003** | Invalid Login - Bad User | Browser is open; user is on Salesforce login page. | 1. Enter invalid username format.<br>2. Enter password.<br>3. Click "Log In" button. | Username: `invalid_user_format`<br>Password: `ValidPass123!` | Error message displayed: *"Please check your username and password..."* |
| **TC_LGN_004** | Invalid Login - Empty Fields | Browser is open; user is on Salesforce login page. | 1. Leave username and password blank.<br>2. Click "Log In" button. | Username: `""`<br>Password: `""` | Page rejects submit or displays appropriate validation error. |
| **TC_LGN_005** | Remember Me Verification | Browser is open; user is on Salesforce login page. | 1. Click "Remember Me" checkbox.<br>2. Verify state is checked.<br>3. Uncheck to verify toggle works. | Checkbox action | Checkbox state changes from unchecked to checked and back successfully. |

---

## 6. Execution Instructions
1. Clone or copy the project files to your local workspace.
2. Ensure Java 17 and Maven are installed and configured on your system PATH.
3. To run all tests, open the terminal in the project folder (`Practice/salesforce-automation`) and execute:
   ```bash
   mvn clean test
   ```
4. View generated TestNG reports in the `target/surefire-reports` directory.
