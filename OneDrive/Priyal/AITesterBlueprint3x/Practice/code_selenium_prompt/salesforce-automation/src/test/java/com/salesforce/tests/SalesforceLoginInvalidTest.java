package com.salesforce.tests;

import com.salesforce.pages.SalesforceLoginPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class SalesforceLoginInvalidTest extends BaseTest {

    @Test(priority = 1)
    public void testLoginWithInvalidCredentials() throws Exception {
        try {
            SalesforceLoginPage loginPage = new SalesforceLoginPage(driver);
            loginPage.doLogin("invalid_user@test.com", "wrong_pwd_123");

            String expectedError = "Please check your username and password. If you still can't log in, contact your Salesforce administrator.";
            String actualError = loginPage.getErrorMessage();

            Assert.assertTrue(actualError.contains(expectedError), 
                "Error message did not match. Actual: " + actualError);
        } catch (Exception e) {
            Assert.fail("Invalid credentials test failed: " + e.getMessage());
        }
    }

    @Test(priority = 2)
    public void testLoginWithEmptyCredentials() throws Exception {
        try {
            SalesforceLoginPage loginPage = new SalesforceLoginPage(driver);
            loginPage.doLogin("", "");

            String expectedError = "Please check your username and password. If you still can't log in, contact your Salesforce administrator.";
            String actualError = loginPage.getErrorMessage();

            Assert.assertTrue(actualError.contains(expectedError), 
                "Error message did not match for empty fields. Actual: " + actualError);
        } catch (Exception e) {
            Assert.fail("Empty credentials test failed: " + e.getMessage());
        }
    }
}
