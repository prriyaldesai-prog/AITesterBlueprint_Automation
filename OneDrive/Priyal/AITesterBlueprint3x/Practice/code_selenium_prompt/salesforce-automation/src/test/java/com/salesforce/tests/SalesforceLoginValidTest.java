package com.salesforce.tests;

import com.salesforce.pages.SalesforceLoginPage;
import com.salesforce.pages.SalesforceHomePage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class SalesforceLoginValidTest extends BaseTest {

    @Test
    public void testValidLoginFlow() throws Exception {
        try {
            SalesforceLoginPage loginPage = new SalesforceLoginPage(driver);
            
            // Toggle Remember Me checkbox to verify UI state action
            loginPage.toggleRememberMe();
            Assert.assertTrue(loginPage.isRememberMeChecked(), "Remember Me checkbox should be checked");
            
            loginPage.toggleRememberMe();
            Assert.assertFalse(loginPage.isRememberMeChecked(), "Remember Me checkbox should be unchecked");

            // Perform login attempt with credentials
            // In a real pipeline, these would be retrieved from config or environment variables
            SalesforceHomePage homePage = loginPage.doLogin("valid_enterprise_user@salesforce.com", "ValidSecurePass123!");

            // In typical enterprise Salesforce environments, a verification/MFA page is triggered.
            // We verify that the credentials did not display a login validation error.
            String currentUrl = driver.getCurrentUrl();
            boolean isRedirected = currentUrl.contains("VerificationPage") || currentUrl.contains("home");
            
            Assert.assertTrue(isRedirected, "Should redirect to Verification Page or Home Page. Current URL: " + currentUrl);
        } catch (Exception e) {
            Assert.fail("Valid login test case failed: " + e.getMessage());
        }
    }
}
