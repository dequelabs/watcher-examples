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
class BasicTest {

    WebDriver driver;
    String apiKey = "test-api-key";
    String serverUrl = "https://axe.deque.com";

    @BeforeEach
    void setUp() {
        AxeWatcher axeWatcher =
            new AxeWatcher(
                    new AxeWatcherOptions().setApiKey(apiKey).setServerUrl(serverUrl))
                .enableDebugLogger();

        ChromeOptions chromeOptions =
            axeWatcher.configure(new ChromeOptions().addArguments("--headless=new", "--no-sandbox"));
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
                driver.get("https://the-internet.herokuapp.com/login");

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
    }
}