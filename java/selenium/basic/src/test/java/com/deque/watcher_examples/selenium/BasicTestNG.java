package com.deque.watcher_examples.selenium;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.testng.annotations.*;
import org.testng.Assert;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;

import com.deque.axe_core.commons.AxeWatcherOptions;
import com.deque.axe_core.selenium.AxeWatcher;
import com.deque.axe_core.selenium.AxeWatcherDriver;

import com.deque.watcher_examples.utils.TestConfigLoader;

@Test(groups = "login")
public class BasicTestNG {
    WebDriver driver;
    WebDriverWait wait;
    String apiKey = "c7c9fc08-fa56-4da3-b157-7855afd19a7c";
    String serverUrl = "https://axe.deque.com";

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        AxeWatcher axeWatcher = new AxeWatcher(
                new AxeWatcherOptions().setApiKey(apiKey).setServerUrl(serverUrl))
                .enableDebugLogger();

        String chromeBinaryPath = TestConfigLoader.getChromeBinaryPath();
        String chromeDriverPath = TestConfigLoader.getChromeDriverPath();

        // Disable password manager and leak detection
        Map<String, Object> prefs = new HashMap<>();
        prefs.put("credentials_enable_service", false);
        prefs.put("profile.password_manager_enabled", false);
        prefs.put("profile.password_manager_leak_detection", false);

        ChromeOptions chromeOptions = axeWatcher
                .configure(new ChromeOptions());
        chromeOptions.setBinary(chromeBinaryPath);
        chromeOptions.setExperimentalOption("prefs", prefs);

        System.setProperty("webdriver.chrome.driver", chromeDriverPath);

        // Force Chrome to use the closest available CDP version
        driver = axeWatcher.wrapDriver(new ChromeDriver(chromeOptions));
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(2));
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @Test(description = "Login with valid credentials", priority = 1)
    public void testLoginWithValidCredentials() {
        driver.get("https://the-internet.herokuapp.com/login");

        WebElement usernameInput = wait
                .until(ExpectedConditions.presenceOfElementLocated(By.id("username")));
        WebElement passwordInput = driver.findElement(By.id("password"));
        WebElement loginButton = driver.findElement(By.cssSelector("button[type='submit']"));

        // Verify form elements
        Assert.assertNotNull(usernameInput, "Username input must be present");
        Assert.assertNotNull(passwordInput, "Password input must be present");
        Assert.assertNotNull(loginButton, "Login button must be present");

        usernameInput.sendKeys("tomsmith");
        passwordInput.sendKeys("SuperSecretPassword!");
        loginButton.click();

        try {
            Alert alert = driver.switchTo().alert();
            alert.accept(); // or alert.dismiss();
        } catch (NoAlertPresentException e) {
            System.out.println("No alert to handle.");
        }

        WebElement flashMessage = wait
                .until(ExpectedConditions.presenceOfElementLocated(By.id("flash")));
        Assert.assertTrue(flashMessage.getText().contains("You logged into a secure area!"),
                "Login message should indicate success");

    }

    @Test(description = "Login with invalid credentials", priority = 2, dataProvider = "invalidUsernames")
    public void testLoginWithInvalidCredentials(String username) {
        driver.get("https://the-internet.herokuapp.com/login");

        WebElement usernameInput = wait
                .until(ExpectedConditions.presenceOfElementLocated(By.id("username")));
        WebElement passwordInput = driver.findElement(By.id("password"));
        WebElement loginButton = driver.findElement(By.cssSelector("button[type='submit']"));

        usernameInput.sendKeys(username);
        passwordInput.sendKeys("wrong!");
        loginButton.click();

        WebElement flashMessage = wait
                .until(ExpectedConditions.presenceOfElementLocated(By.id("flash")));
        Assert.assertTrue(flashMessage.getText().contains("Your username is invalid!"),
                "Login message should indicate invalid credentials");
    }

    @DataProvider(name = "invalidUsernames")
    public Object[][] getInvalidUsernames() {
        return new Object[][] {
                { "invalid" },
                { "wronguser" },
                { "badlogin" }
        };
    }

    @AfterMethod
    public void resetBrowserState() {
        driver.manage().deleteAllCookies();

        try {
            Alert alert = driver.switchTo().alert();
            alert.accept(); // or alert.dismiss();
        } catch (NoAlertPresentException e) {
            System.out.println("No alert to handle.");
        }

        driver.navigate().to("https://the-internet.herokuapp.com/login");
        System.out.println("Clearing local and session storage");
        ((JavascriptExecutor) driver).executeScript("window.localStorage.clear(); window.sessionStorage.clear();");
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        try {
            if (driver instanceof AxeWatcherDriver) {
                ((AxeWatcherDriver) driver).axeWatcher().flush();
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (driver != null) {
                driver.quit();
            }
        }
    }
}