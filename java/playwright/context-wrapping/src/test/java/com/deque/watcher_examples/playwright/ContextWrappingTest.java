package com.deque.watcher_examples.playwright;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.deque.axe_core.commons.AxeWatcherOptions;
import com.deque.axe_core.playwright.AxeWatcherBrowserContext;
import com.deque.axe_core.playwright.AxeWatcherPage;
import com.deque.axe_core.playwright.AxeWatcherPlaywright;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Playwright;
import java.nio.file.Paths;
import java.util.Arrays;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/*
  Wrapping a BrowserContext.

  When a test opens several pages, wrap the BrowserContext once with wrapContext() instead of
  calling wrapPage() for each page. Every page created from a wrapped context (via newPage()) is
  automatically instrumented, and closing the context flushes results for every page it opened.
*/
@DisplayName("My Multi-page Application")
class ContextWrappingTest {

    Playwright playwright;
    AxeWatcherBrowserContext context;

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

        // wrapContext() requires configure() to have run first. An empty path tells Playwright to
        // use a temporary profile directory.
        context =
            axeWatcher.wrapContext(
                playwright.chromium().launchPersistentContext(Paths.get(""), launchOptions));
    }

    @AfterEach
    void tearDown() {
        // Closing the wrapped context flushes results for every page opened from it.
        context.close();
        playwright.close();
    }

    @Test
    @DisplayName("analyzes every page opened from the wrapped context")
    void analyzesEveryPageTest() {
        // Pages from a wrapped context are already instrumented — no per-page wrapPage() call.
        AxeWatcherPage homePage = (AxeWatcherPage) context.newPage();
        homePage.navigate("https://the-internet.herokuapp.com");
        // count() does not auto-wait, so wait for the link list to render before counting.
        homePage.locator("ul li a").first().waitFor();
        int linkCount = homePage.locator("ul li a").count();
        assertTrue(linkCount >= 20, "expected the home page link list to load, got " + linkCount);

        // A second page opened from the same context is instrumented too.
        AxeWatcherPage loginPage = (AxeWatcherPage) context.newPage();
        loginPage.navigate("https://the-internet.herokuapp.com/login");

        loginPage.locator("#username").fill("tomsmith");
        loginPage.locator("#password").fill("SuperSecretPassword!");
        loginPage.locator("button[type='submit']").click();

        assertNotNull(loginPage.waitForSelector("#flash"));
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
