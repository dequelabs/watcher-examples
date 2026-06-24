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
  Manual mode.

  Setting setAutoAnalyze(false) starts axe Watcher with automatic analysis paused. You then control
  exactly when scans happen through the controller returned by page.axeWatcher():

    - analyze() — scan the current page state now, regardless of whether analysis is paused.
    - start()   — resume automatic analysis.
    - stop()    — pause automatic analysis.
*/
@DisplayName("My Login Application")
class ManualModeTest {

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
                        .setServerUrl(serverUrl())
                        .setAutoAnalyze(false))
                .enableDebugLogger();

        // configure() merges the axe Watcher extension flags into the launch options. It must be
        // called before launching the persistent context — Chromium only loads extensions when
        // launched via a persistent context.
        BrowserType.LaunchPersistentContextOptions launchOptions =
            axeWatcher.configure(browserOptions());

        playwright = Playwright.create();
        // An empty path tells Playwright to use a temporary profile directory.
        context = playwright.chromium().launchPersistentContext(Paths.get(""), launchOptions);

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
                /*
                  Let's count the page states. Auto-analysis starts disabled, so nothing is
                  analyzed until we ask for it.

                  We navigate to the page,
                  then analyze it manually. (+1)
                  We fill out the form,
                  then resume automatic analysis.
                  We click the button,
                  triggering an automatic analysis. (+1)
                  We confirm the success element appears.
                  We pause automatic analysis,
                  then analyze the logged-in state manually. (+1)

                  So we expect a total of 3 page states.
                */
                page.navigate("https://the-internet.herokuapp.com/login");
                page.axeWatcher().analyze();

                page.locator("#username").fill("tomsmith");
                page.locator("#password").fill("SuperSecretPassword!");
                page.axeWatcher().start();

                page.locator("button[type='submit']").click();

                assertNotNull(page.waitForSelector("#flash"));

                page.axeWatcher().stop();
                page.axeWatcher().analyze();
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
