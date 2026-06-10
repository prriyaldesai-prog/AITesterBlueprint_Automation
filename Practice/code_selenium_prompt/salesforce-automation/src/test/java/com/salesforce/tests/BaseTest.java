package com.salesforce.tests;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import java.time.Duration;

public class BaseTest {
    protected WebDriver driver;

    @BeforeMethod
    public void setUp() throws Exception {
        try {
            ChromeOptions options = new ChromeOptions();
            options.addArguments("--headless=new");
            options.addArguments("--disable-gpu");
            options.addArguments("--window-size=1920,1080");
            options.addArguments("--no-sandbox");
            options.addArguments("--disable-dev-shm-usage");

            driver = new ChromeDriver(options);
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
            driver.manage().window().maximize();
            driver.get("https://login.salesforce.com/?locale=in");
        } catch (Exception e) {
            throw new Exception("WebDriver setup failed: " + e.getMessage(), e);
        }
    }

    @AfterMethod
    public void tearDown() throws Exception {
        try {
            if (driver != null) {
                driver.quit();
            }
        } catch (Exception e) {
            throw new Exception("WebDriver teardown failed: " + e.getMessage(), e);
        }
    }
}
