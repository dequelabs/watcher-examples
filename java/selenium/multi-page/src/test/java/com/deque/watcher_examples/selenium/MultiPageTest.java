package com.deque.watcher_examples.selenium;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import org.openqa.selenium.By;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.deque.axe_core.selenium.AxeWatcher;
import com.deque.axe_core.selenium.AxeWatcherDriver;
import com.deque.axe_core.commons.AxeWatcherOptions;

@DisplayName("Multipage Test")
class MultiPageTest {

    static WebDriver driver;

    @BeforeAll
    static void setup() {
        String apiKey = "test-api-key";
        String serverUrl = "https://axe.deque.com";

        AxeWatcher axeWatcher =
            new AxeWatcher(
                    new AxeWatcherOptions()
                        .setApiKey(apiKey)
                        .setServerUrl(serverUrl)
                );

        ChromeOptions chromeOptions =
            axeWatcher.configure(new ChromeOptions().addArguments("--headless=new", "--no-sandbox"));
        /* 
          If the version of Chrome that Selenium will use is Google Chrome >= 139,
          you must specify the path to a Chromium or Google Chrome for Testing binary instead. 
          Chrome versions can be installed and managed using @puppeteer/browsers.
          */
        // chromeOptions.setBinary("/path/to/Chromium/or/Google Chrome for Testing");
        driver = axeWatcher.wrapDriver(new ChromeDriver(chromeOptions));
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(2));
    }

    @AfterAll
    static void teardown() {
        driver.quit();
    }

    @AfterEach
    void tearDown() {
        ((AxeWatcherDriver) driver).axeWatcher().flush();
    }

    @Nested
    @DisplayName("Homepage")
    class HomepageTests {
        @BeforeEach
        void visit() {
            driver.get("https://the-internet.herokuapp.com");
        }

        @Test
        @DisplayName("should contain a list of links")
        void shouldContainAListOfLinksTest() {
            List<WebElement> links = driver.findElements(By.cssSelector("ul li a"));
            assertTrue(links.size() >= 20);
        }

        @Test
        @DisplayName("should contain a link to the login page")
        void shouldContainALinkToTheLoginPageTest() {
            WebElement loginLink = driver.findElement(By.cssSelector("ul li a[href='/login']"));
            assertNotNull(loginLink);
        }
    }

    @Nested
    @DisplayName("Login page")
    class LoginPageTests {

        @BeforeEach
        void visit() {
            driver.get("https://the-internet.herokuapp.com/login");
        }

        @Test
        @DisplayName("should contain a username input")
        void shouldContainAUsernameInputTest() {
            WebElement usernameInput = driver.findElement(By.id("username"));
            assertNotNull(usernameInput);
        }

        @Test
        @DisplayName("should contain a password input")
        void shouldContainAPasswordInputTest() {
            WebElement passwordInput = driver.findElement(By.id("password"));
            assertNotNull(passwordInput);
        }

        @Test
        @DisplayName("should contain a submit button")
        void shouldContainASubmitButton() {
            WebElement submitButton = driver.findElement(By.cssSelector("button[type='submit']"));
            assertNotNull(submitButton);
        }
        
        @Test
        @DisplayName("entering credentials and submitting the form should login")
        void shouldLoginTest() {
            WebElement usernameInput = driver.findElement(By.id("username"));
            WebElement passwordInput = driver.findElement(By.id("password"));
            WebElement submitButton = driver.findElement(By.cssSelector("button[type='submit']"));

            usernameInput.sendKeys("tomsmith");
            passwordInput.sendKeys("SuperSecretPassword!");

            submitButton.click();

            WebElement element = driver.findElement(By.id("flash"));
            assertNotNull(element);
        }
    }

    @Nested
    @DisplayName("Forgot password page")
    class MultiPageForgotPasswordTest {

        @BeforeEach
        void visit() {
            driver.get("https://the-internet.herokuapp.com/forgot_password");
        }

        @Test
        @DisplayName("should contain an email input")
        public void shouldContainAnEmailInputTest() {
            WebElement input = driver.findElement(By.id("email"));
            assertNotNull(input);
        }

        @Test
        @DisplayName("should contain a submit button")
        public void shouldContainASubmitButtonTest() {
            WebElement button = driver.findElement(By.cssSelector("button[type='submit']"));
            assertNotNull(button);
        }
    }
}
