package com.deque.watcher_examples.selenium;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import com.deque.axe_core.commons.AxeWatcherOptions;
import com.deque.axe_core.selenium.AxeWatcher;
import com.deque.axe_core.selenium.AxeWatcherDriver;


@DisplayName("My Login Application")
class ManualModeTest {

    WebDriver driver;
    String apiKey = "test-api-key";
    String projectId = "test-project-id";
    String serverUrl = "https://axe.deque.com";

    @BeforeEach
    void setUp() {
        AxeWatcher axeWatcher =
            new AxeWatcher(
                    new AxeWatcherOptions()
                        .setApiKey(apiKey)
                        .setProjectId(projectId)
                        .setServerUrl(serverUrl)
                        .setAutoAnalyze(false)
                )
                .enableDebugLogger();

        ChromeOptions chromeOptions =
            axeWatcher.configure(new ChromeOptions().addArguments(
                "--headless=new", 
                "--no-sandbox"));
        /* 
          If the version of Chrome that Selenium will use is Google Chrome >= 139,
          you must specify the path to a Chromium or Google Chrome for Testing binary instead. 
          Chrome versions can be installed and managed using @puppeteer/browsers.
          */
        // chromeOptions.setBinary("/path/to/Chromium/or/Google Chrome for Testing");
        driver = axeWatcher.wrapDriver(new ChromeDriver(chromeOptions));
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(2));
    }

    @AfterEach
    void tearDown() {
        ((AxeWatcherDriver) driver).axeWatcher().flush();
        driver.quit();
    }

    @Nested
    @DisplayName("Login")
    class LoginTests {
        @Nested
        @DisplayName("with valid credentials")
        class ShouldLoginTests {
            @Test
            @DisplayName("should login")
            void shouldLoginTest() {
                /*
                    Let's calculate the number of page states.
                    Auto-analyze is false, so it will not analyze automatically.

                    We navigate to the page,
                    then manually analyze it. (+1)
                    We fill out the form,
                    then turn on auto-analysis.
                    We click the button, 
                    causing an auto-analysis (+1),
                    then assure the element appears.
                    We turn off auto-analysis,
                    then analyze manually (+1).
                    
                    So, we expect the total number of page states to be 3.
                */
                driver.get("https://the-internet.herokuapp.com/login");
                // Analyze after navigating to the page.
                ((AxeWatcherDriver) driver).axeWatcher().analyze();

                WebElement usernameInput = driver.findElement(By.id("username"));
                WebElement passwordInput = driver.findElement(By.id("password"));
                WebElement submitButton = driver.findElement(By.cssSelector("button[type='submit']"));

                usernameInput.sendKeys("tomsmith");
                passwordInput.sendKeys("SuperSecretPassword!");
                // Start automatic axe analysis.
                ((AxeWatcherDriver) driver).axeWatcher().start();

                submitButton.click();

                WebElement element = driver.findElement(By.id("flash"));
                assertNotNull(element);

                // Stop automatic axe analysis.
                ((AxeWatcherDriver) driver).axeWatcher().stop();
                // Analyze after logging in.
                ((AxeWatcherDriver) driver).axeWatcher().analyze();
            }
        }
    }
}