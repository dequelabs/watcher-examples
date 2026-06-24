package com.deque.watcher_examples.playwright;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.deque.axe_core.commons.AxeWatcherOptions;
import com.deque.axe_core.playwright.AxeWatcherPage;
import com.deque.axe_core.playwright.AxeWatcherPlaywright;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.ElementHandle;
import com.microsoft.playwright.Playwright;
import java.nio.file.Paths;
import java.util.Arrays;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

/*
  Driving one instrumented page across the pages of an application.

  A single wrapped Page is launched once for the whole class and reused as the suite navigates
  between the home, login, and forgot-password pages. axe Watcher analyzes each page automatically;
  flushing after every test uploads the page states captured along the way. The @Nested classes
  group the assertions by the page under test.
*/
@DisplayName("My Multi-page Application")
class MultiPageTest {

    static Playwright playwright;
    static BrowserContext browserContext;
    static AxeWatcherPage page;

    @BeforeAll
    static void setUp() {
        AxeWatcherPlaywright axeWatcher =
            new AxeWatcherPlaywright(
                    new AxeWatcherOptions()
                        .setApiKey(System.getenv("API_KEY"))
                        .setProjectId(System.getenv("PROJECT_ID"))
                        .setServerUrl(serverUrl()))
                .enableDebugLogger();

        // configure() merges the axe Watcher extension flags into the launch options. It must be
        // called before launching the persistent context — Chromium only loads extensions when
        // launched via a persistent context.
        BrowserType.LaunchPersistentContextOptions launchOptions =
            axeWatcher.configure(browserOptions());

        playwright = Playwright.create();

        // An empty path tells Playwright to use a temporary profile directory.
        browserContext =
            playwright.chromium().launchPersistentContext(Paths.get(""), launchOptions);
        page = axeWatcher.wrapPage(browserContext.newPage());
    }

    @AfterAll
    static void tearDown() {
        browserContext.close();
        playwright.close();
    }

    @AfterEach
    void flush() {
        // Results are only uploaded when you flush — do it after every test.
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
            // count() does not auto-wait, so wait for the link list to render before counting.
            page.locator("ul li a").first().waitFor();
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
        void shouldContainASubmitButtonTest() {
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
    class ForgotPasswordTests {
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

    private static String serverUrl() {
        String serverUrl = System.getenv("SERVER_URL");
        return serverUrl != null ? serverUrl : "https://axe.deque.com";
    }

    private static BrowserType.LaunchPersistentContextOptions browserOptions() {
        /*
          axe Watcher's browser extension loads only in a headed browser or Chromium's "new"
          headless mode — never Chromium's classic/default headless mode. We run headless here
          (with a Chromium-based channel, selected below, which new-headless requires) so the
          example works in CI; call setHeadless(false) to watch the run in a visible window.
          "--no-sandbox" lets Chromium run as root in CI and isn't needed for local headed runs.
        */
        BrowserType.LaunchPersistentContextOptions options =
            new BrowserType.LaunchPersistentContextOptions()
                .setHeadless(true)
                .setArgs(Arrays.asList("--no-sandbox"));

        // In CI we point Playwright at the Chrome installed on the runner (CHROME_BIN). Locally,
        // without CHROME_BIN, Playwright falls back to its bundled Chromium — install it with
        // `mvn exec:java -Dexec.mainClass=com.microsoft.playwright.CLI -Dexec.args="install chromium"`.
        String chromeBin = System.getenv("CHROME_BIN");
        if (chromeBin != null) {
            options.setChannel("chrome").setExecutablePath(Paths.get(chromeBin));
        } else {
            options.setChannel("chromium");
        }

        return options;
    }
}
