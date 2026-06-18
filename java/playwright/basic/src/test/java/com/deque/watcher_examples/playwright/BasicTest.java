package com.deque.watcher_examples.playwright;

import java.nio.file.Paths;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
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
class BasicTest {

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
                    new AxeWatcherOptions().setApiKey(apiKey).setProjectId(projectId).setServerUrl(serverUrl))
                .enableDebugLogger();

        BrowserType.LaunchPersistentContextOptions launchOptions =
            axeWatcher.configure(
                new BrowserType.LaunchPersistentContextOptions()
                        .setHeadless(true)
                        .setChannel("chromium")
                        .setArgs(List.of("--no-sandbox", "--disable-dev-shm-usage")));

        playwright = Playwright.create();
        // An empty user-data dir lets Playwright create a fresh temporary profile.
        browserContext = playwright.chromium().launchPersistentContext(Paths.get(""), launchOptions);
        page = axeWatcher.wrapPage(browserContext.newPage());
    }

    @AfterEach
    void tearDown() {
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
                page.navigate("https://the-internet.herokuapp.com/login");

                page.locator("#username").fill("tomsmith");
                page.locator("#password").fill("SuperSecretPassword!");

                page.locator("button[type='submit']").click();

                ElementHandle element = page.waitForSelector("#flash");
                assertNotNull(element);
            }
        }
    }
}
