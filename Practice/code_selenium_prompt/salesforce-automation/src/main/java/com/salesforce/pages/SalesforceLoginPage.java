package com.salesforce.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

public class SalesforceLoginPage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    @FindBy(xpath = "//input[@id='username']")
    private WebElement usernameInput;

    @FindBy(xpath = "//input[@id='password']")
    private WebElement passwordInput;

    @FindBy(xpath = "//input[@id='Login']")
    private WebElement loginButton;

    @FindBy(xpath = "//input[@id='rememberUn']")
    private WebElement rememberMeCheckbox;

    @FindBy(xpath = "//div[@id='error']")
    private WebElement errorMessage;

    public SalesforceLoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        PageFactory.initElements(driver, this);
    }

    public void enterUsername(String username) throws Exception {
        try {
            wait.until(ExpectedConditions.visibilityOf(usernameInput));
            usernameInput.clear();
            usernameInput.sendKeys(username);
        } catch (Exception e) {
            throw new Exception("Failed to enter username: " + e.getMessage(), e);
        }
    }

    public void enterPassword(String password) throws Exception {
        try {
            wait.until(ExpectedConditions.visibilityOf(passwordInput));
            passwordInput.clear();
            passwordInput.sendKeys(password);
        } catch (Exception e) {
            throw new Exception("Failed to enter password: " + e.getMessage(), e);
        }
    }

    public void clickLogin() throws Exception {
        try {
            wait.until(ExpectedConditions.elementToBeClickable(loginButton));
            loginButton.click();
        } catch (Exception e) {
            throw new Exception("Failed to click login button: " + e.getMessage(), e);
        }
    }

    public void toggleRememberMe() throws Exception {
        try {
            wait.until(ExpectedConditions.elementToBeClickable(rememberMeCheckbox));
            rememberMeCheckbox.click();
        } catch (Exception e) {
            throw new Exception("Failed to toggle Remember Me checkbox: " + e.getMessage(), e);
        }
    }

    public boolean isRememberMeChecked() throws Exception {
        try {
            wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[@id='rememberUn']")));
            return rememberMeCheckbox.isSelected();
        } catch (Exception e) {
            throw new Exception("Failed to verify Remember Me checkbox state: " + e.getMessage(), e);
        }
    }

    public String getErrorMessage() throws Exception {
        try {
            wait.until(ExpectedConditions.visibilityOf(errorMessage));
            return errorMessage.getText();
        } catch (Exception e) {
            throw new Exception("Failed to retrieve error message: " + e.getMessage(), e);
        }
    }

    public SalesforceHomePage doLogin(String username, String password) throws Exception {
        enterUsername(username);
        enterPassword(password);
        clickLogin();
        return new SalesforceHomePage(driver);
    }
}
