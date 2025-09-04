package com.deque.watcher_examples.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class TestConfigLoader {

    private static final String CONFIG_FILE = "test-config.properties";
    private static Properties props;

    static {
        props = new Properties();
        try (InputStream input = TestConfigLoader.class.getClassLoader().getResourceAsStream(CONFIG_FILE)) {
            if (input == null) {
                throw new RuntimeException("Config file not found: " + CONFIG_FILE);
            }
            props.load(input);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load config file", e);
        }
    }

    public static String getChromeBinaryPath() {
        String userHome = System.getProperty("user.home");
        String version = props.getProperty("chrome.version");
        return userHome + "/chrome4testing/" + version
                + "/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";
    }

    public static String getChromeDriverPath() {
        String userHome = System.getProperty("user.home");
        String version = props.getProperty("chromedriver.version");
        return userHome + "/chromedriver/" + version + "/chromedriver";
    }

    public static String getProperty(String key) {
        return props.getProperty(key);
    }
}