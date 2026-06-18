package com.deque.watcher_examples.playwright;

import java.nio.file.Paths;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.deque.axe_core.commons.AxeWatcherOptions;
import com.deque.axe_core.playwright.AxeWatcherPage;
import com.deque.axe_core.playwright.AxeWatcherPlaywright;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.ElementHandle;
import com.microsoft.playwright.Playwright;


@DisplayName("Multipage Test")
class MultiPageTest {

    static Playwright playwright;
    static BrowserContext browserContext;
    static AxeWatcherPage page;

    @BeforeAll
    static void setup() {
        String apiKey = "test-api-key";
        String projectId = "test-project-id";
        String serverUrl = "https://axe.deque.com";

        AxeWatcherPlaywright axeWatcher =
            new AxeWatcherPlaywright(
                    new AxeWatcherOptions()
                            .setApiKey(apiKey)
                            .setProjectId(projectId)
                            .setServerUrl(serverUrl));

        BrowserType.LaunchPersistentContextOptions launchOptions =
            axeWatcher.configure(
                new BrowserType.LaunchPersistentContextOptions()
                        .setHeadless(true)
                        .setChannel("chromium")
                        .setArgs(List.of("--no-sandbox", "--disable-dev-shm-usage")));

        playwright = Playwright.create();
        browserContext = playwright.chromium().launchPersistentContext(Paths.get(""), launchOptions);
        page = axeWatcher.wrapPage(browserContext.newPage());
    }

    @AfterAll
    static void teardown() {
        browserContext.close();
        playwright.close();
    }

    @AfterEach
    void tearDown() {
        // Flush axe-watcher results after each test.
        page.axeWatcher().flush();
    }

    @Nested
    @DisplayName("Homepage")
    class HomepageTests {
        @BeforeEach
        void visit() {
            page.navigate("https://the-internet.herokuapp.com");
        }

        @Test
        @DisplayName("should contain a list of links")
        void shouldContainAListOfLinksTest() {
            assertTrue(page.locator("ul li a").count() >= 20);
        }

        @Test
        @DisplayName("should contain a link to the login page")
        void shouldContainALinkToTheLoginPageTest() {
            ElementHandle loginLink = page.querySelector("ul li a[href='/login']");
            assertNotNull(loginLink);
        }
    }

    @Nested
    @DisplayName("Login page")
    class LoginPageTests {

        @BeforeEach
        void visit() {
            page.navigate("https://the-internet.herokuapp.com/login");
        }

        @Test
        @DisplayName("should contain a username input")
        void shouldContainAUsernameInputTest() {
            ElementHandle usernameInput = page.querySelector("#username");
            assertNotNull(usernameInput);
        }

        @Test
        @DisplayName("should contain a password input")
        void shouldContainAPasswordInputTest() {
            ElementHandle passwordInput = page.querySelector("#password");
            assertNotNull(passwordInput);
        }

        @Test
        @DisplayName("should contain a submit button")
        void shouldContainASubmitButton() {
            ElementHandle submitButton = page.querySelector("button[type='submit']");
            assertNotNull(submitButton);
        }

        @Test
        @DisplayName("entering credentials and submitting the form should login")
        void shouldLoginTest() {
            page.locator("#username").fill("tomsmith");
            page.locator("#password").fill("SuperSecretPassword!");

            page.locator("button[type='submit']").click();

            ElementHandle element = page.waitForSelector("#flash");
            assertNotNull(element);
        }
    }

    @Nested
    @DisplayName("Forgot password page")
    class MultiPageForgotPasswordTest {

        @BeforeEach
        void visit() {
            page.navigate("https://the-internet.herokuapp.com/forgot_password");
        }

        @Test
        @DisplayName("should contain an email input")
        void shouldContainAnEmailInputTest() {
            ElementHandle input = page.querySelector("#email");
            assertNotNull(input);
        }

        @Test
        @DisplayName("should contain a submit button")
        void shouldContainASubmitButtonTest() {
            ElementHandle button = page.querySelector("button[type='submit']");
            assertNotNull(button);
        }
    }
}
