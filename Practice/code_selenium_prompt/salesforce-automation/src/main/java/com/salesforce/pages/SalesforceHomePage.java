package com.salesforce.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

public class SalesforceHomePage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    @FindBy(xpath = "//div[@class='slds-icon-waffle_container' or contains(@class,'slds-icon-waffle')]")
    private WebElement appLauncher;

    @FindBy(xpath = "//button[contains(@class,'userProfile') or contains(@class,'profile-card-trigger')]")
    private WebElement userProfileButton;

    public SalesforceHomePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        PageFactory.initElements(driver, this);
    }

    public boolean isDashboardLoaded() throws Exception {
        try {
            wait.until(ExpectedConditions.visibilityOf(appLauncher));
            return appLauncher.isDisplayed();
        } catch (Exception e) {
            throw new Exception("Home page dashboard failed to load: " + e.getMessage(), e);
        }
    }

    public void openProfileMenu() throws Exception {
        try {
            wait.until(ExpectedConditions.elementToBeClickable(userProfileButton));
            userProfileButton.click();
        } catch (Exception e) {
            throw new Exception("Failed to click user profile menu button: " + e.getMessage(), e);
        }
    }
}
