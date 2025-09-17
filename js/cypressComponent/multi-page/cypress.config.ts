// Cypress configuration file for enabling axe-core watcher with autoAnalyze mode.
// This config is used to run component tests with automatic accessibility analysis enabled.
// C130003, C130005, C130015

import { defineConfig } from "cypress";
import { cypressConfig } from "@axe-core/watcher";
//import path from "path";

// Read API key and server URL from environment variables for security and flexibility
const axeApiKey = process.env.AXE_API_KEY || "7d5e2679-a936-4eb9-aaee-f2e4b91890c1";
const axeServerURL = process.env.AXE_SERVER_URL || "https://axe-qa.dequelabs.com/";

export default defineConfig({
  // Merge in the axe-core watcher Cypress config
  ...cypressConfig({
    axe: {
      apiKey: axeApiKey, // API key for axe-core cloud integration
      testingTypes: ['component', 'e2e'], // Enable both component and e2e testing
      serverURL: axeServerURL, // axe-core cloud server URL
     },
    defaultCommandTimeout: 30000, // Set default command timeout to 30 seconds

    // Component testing configuration
    component: {
      devServer: {
        framework: "next", // Use Next.js as the framework
        bundler: "webpack", // Use webpack as the bundler
      },
      specPattern: "**/*.cy.{ts,tsx}", // Pattern for component test files
      supportFile: "cypress/support/component.ts", // Support file for component tests
    },
  }),
});