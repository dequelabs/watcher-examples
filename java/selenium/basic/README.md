## 🧪 Watcher Examples: Selenium JUnit

This project demonstrates how to run accessibility tests using [axe DevTools](https://axe.deque.com/) with Selenium and TestNG. It supports dynamic configuration of Chrome and ChromeDriver versions and paths for cross-platform compatibility (macOS, Windows, Linux).

---

### 📦 Project Structure

```
src/
├── main/
│   └── java/                # Application code (if any)
├── test/
│   ├── java/                # Test classes
│   │   └── com.deque.watcher_examples/
│   │       └── BasicTest.java
│   └── resources/
│       └── test-config.properties
```

---

### ⚙️ Configuration

All configurable options are stored in `src/test/resources/test-config.properties`.

#### 🔧 `test-config.properties`

```properties
chrome.version=140
chromedriver.version=140
```

These values are used to dynamically build paths to the Chrome binary and ChromeDriver executable based on your operating system's home directory.

#### 🛠️ Paths (Resolved Automatically)

- **Chrome binary**:  
  `${user.home}/chrome4testing/${chrome.version}/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`

- **ChromeDriver binary**:  
  `${user.home}/chromedriver/${chromedriver.version}/chromedriver`

> You can customize these paths in the utility class `TestConfigLoader.java` if your directory structure differs.

---

### 🚀 Running Tests

#### Maven

```bash
mvn clean test
```

Make sure your `pom.xml` includes the correct TestNG and Surefire plugin configuration to run both JUnit and TestNG tests.

---

### 🧰 Dependencies

- [Selenium WebDriver](https://www.selenium.dev/)
- [axe DevTools for Java](https://docs.deque.com/devtools-java/)
- SLF4J (for logging)

---

### 📖 Documentation

- [axe DevTools for Web](https://docs.deque.com/devtools-web/)
- [axe DevTools for Java](https://docs.deque.com/devtools-java/)
- [Selenium Troubleshooting](https://www.selenium.dev/documentation/webdriver/troubleshooting/errors/driver_location/)
