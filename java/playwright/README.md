# axe Watcher — Playwright Java examples

Runnable [JUnit 5](https://junit.org/junit5/) projects showing how to add accessibility analysis to
a [Playwright Java](https://playwright.dev/java/) test suite with
[`@axe-core/watcher`](https://central.sonatype.com/artifact/com.deque.axe_core/watcher). axe Watcher
wraps your Playwright `Page` (or `BrowserContext`) so scans run automatically as your existing
end-to-end tests drive the browser, then uploads the results to
[axe Developer Hub](https://docs.deque.com/developer-hub).

| Example                                  | Scenario         | What it shows                                                                     |
| ---------------------------------------- | ---------------- | --------------------------------------------------------------------------------- |
| [`basic`](./basic)                       | Auto analysis    | The default mode — wrap the page and every interaction is analyzed automatically. |
| [`manual-mode`](./manual-mode)           | Manual mode      | `setAutoAnalyze(false)` plus `analyze()` / `start()` / `stop()` to control scans. |
| [`context-wrapping`](./context-wrapping) | Context wrapping | `wrapContext()` so every page opened from one `BrowserContext` is instrumented.   |
| [`multi-page`](./multi-page)             | Multi-page       | Reuse one wrapped page across several pages, flushing after each test.            |

## Prerequisites

- **Java 11 or newer.** The axe Watcher integration itself supports Java 8+; these example projects
  target Java 11 source compatibility and are tested on Java 17 in CI.
- **[Maven](https://maven.apache.org/).** Each example is a standalone Maven project.
- **A Chromium-based browser.** axe Watcher loads a browser extension, which Chromium only supports
  when launched via a persistent context using [Chrome for
  Testing](https://developer.chrome.com/blog/chrome-for-testing), Playwright's bundled Chromium, or
  a Microsoft Edge channel. Recent branded Google Chrome releases (139+) restrict the
  `--load-extension` flag axe Watcher relies on, so prefer Chrome for Testing or Chromium.
- **An axe Developer Hub API key and project ID.**
  - [Create an API key](https://axe.deque.com/settings)
  - [Create a project ID](https://axe.deque.com/axe-watcher/projects)

## Running an example

1. Provide your credentials as environment variables. `SERVER_URL` is optional and defaults to
   `https://axe.deque.com`; set it to target a different axe Developer Hub instance.

   ```sh
   export API_KEY="YOUR API KEY"
   export PROJECT_ID="YOUR PROJECT ID"
   # export SERVER_URL="https://axe.yourcompany.com"
   ```

2. Change into the example you want to run:

   ```sh
   cd basic
   ```

3. (Local runs only.) Install Playwright's bundled Chromium once. Skip this if you instead set
   `CHROME_BIN` to a Chrome for Testing (or Chromium) binary — the examples will launch that, which
   is how they run in CI.

   ```sh
   mvn exec:java -Dexec.mainClass=com.microsoft.playwright.CLI -Dexec.args="install chromium"
   ```

4. Run the tests:

   ```sh
   mvn test
   ```

5. Open your project in [axe Developer Hub](https://docs.deque.com/developer-hub) to review the
   captured page states and issues.

## Notes

- **Headless mode.** The examples run in Chromium's "new" headless mode (`setHeadless(true)` with a
  Chromium-based channel) so they work in CI. axe Watcher's extension cannot load in Chromium's
  classic/default headless mode, so `configure()` rejects a plain `--headless` argument, an
  `--incognito` argument, or `setHeadless(true)` without a supported channel. Call
  `setHeadless(false)` to watch a run in a visible window.
- **Always `flush()`.** Results are only uploaded when you flush. The examples call
  `page.axeWatcher().flush()` in an `@AfterEach` hook (the `context-wrapping` example relies on
  `BrowserContext.close()`, which flushes every tracked page).
- **Attributing scans to a test.** To trace a violation back to the test that produced it, call
  `page.axeWatcher().setTestContext(testFilePath, testLocation)` — typically from a `@BeforeEach`
  hook using JUnit 5's `TestInfo`.

For the full API and configuration reference, see the
[`@axe-core/watcher` Java documentation](https://central.sonatype.com/artifact/com.deque.axe_core/watcher).
