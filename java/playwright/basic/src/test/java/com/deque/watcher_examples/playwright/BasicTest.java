package com.deque.watcher_examples.playwright;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.deque.axe_core.commons.AxeWatcherOptions;
import com.deque.axe_core.playwright.AxeWatcherPage;
import com.deque.axe_core.playwright.AxeWatcherPlaywright;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Playwright;
import java.nio.file.Paths;
import java.util.Arrays;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

/*
  Auto analysis (the default mode).

  Once the Playwright `Page` is wrapped with `wrapPage()`, axe Watcher analyzes each page state
  automatically: every wrapped interaction (navigation, click, fill, ...) triggers a scan, and the
  page is re-analyzed whenever the DOM changes. The rest of the test is plain Playwright Java.
*/
@DisplayName("My Login Application")
class BasicTest {

    Playwright playwright;
    BrowserContext context;
    AxeWatcherPage page;

    @BeforeEach
    void setUp() {
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
        context = playwright.chromium().launchPersistentContext(Paths.get(""), launchOptions);

        // Interactions on a wrapped page are analyzed automatically.
        page = axeWatcher.wrapPage(context.newPage());
    }

    @AfterEach
    void tearDown() {
        // Send the collected results to axe Developer Hub after each test.
        page.axeWatcher().flush();
        context.close();
        playwright.close();
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
                page.navigate("https://the-internet.herokuapp.com/login");

                page.locator("#username").fill("tomsmith");
                page.locator("#password").fill("SuperSecretPassword!");

                page.locator("button[type='submit']").click();

                assertNotNull(page.waitForSelector("#flash"));
            }
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
