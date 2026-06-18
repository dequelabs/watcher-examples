package com.deque.watcher_examples.playwright;

import java.nio.file.Paths;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.AfterEach;
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


@DisplayName("My Login Application")
class ManualModeTest {

    String apiKey = "test-api-key";
    String projectId = "test-project-id";
    String serverUrl = "https://axe.deque.com";

    Playwright playwright;
    BrowserContext browserContext;
    AxeWatcherPage page;

    @BeforeEach
    void setUp() {
        AxeWatcherPlaywright axeWatcher =
            new AxeWatcherPlaywright(
                    new AxeWatcherOptions()
                            .setApiKey(apiKey)
                            .setProjectId(projectId)
                            .setServerUrl(serverUrl)
                            // Disable automatic analysis.
                            .setAutoAnalyze(false))
                .enableDebugLogger();

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

    @AfterEach
    void tearDown() {
        // Flush axe-watcher results after each test.
        page.axeWatcher().flush();
        browserContext.close();
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
                page.navigate("https://the-internet.herokuapp.com/login");
                // Analyze after navigating to the page.
                page.axeWatcher().analyze();

                page.locator("#username").fill("tomsmith");
                page.locator("#password").fill("SuperSecretPassword!");
                // Start automatic axe analysis.
                page.axeWatcher().start();

                page.locator("button[type='submit']").click();

                ElementHandle element = page.waitForSelector("#flash");
                assertNotNull(element);

                // Stop automatic axe analysis.
                page.axeWatcher().stop();
                // Analyze after logging in.
                page.axeWatcher().analyze();
            }
        }
    }
}
