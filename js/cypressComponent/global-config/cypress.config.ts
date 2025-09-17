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
      /**
             * configurationOverrides allows users to override the org-wide settings
             * configured in the axe account.
             *
             * Notes:
             *  1. If you do not wish to override a specific field, simply omit it from this object.
             *  2. If you lack permission to override a particular field, the configuration will not proceed.
             *  3. For more details on using global configurations, visit:
             *     https://docs.deque.com/developer-hub/2/en/dh-global-configuration
             *  4. For more information on the configurationOverrides object, see:
             *     https://docs.deque.com/developer-hub/2/en/dh-api-reference#configurationoverrides-interface
             */
            configurationOverrides: {
              accessibilityStandard: 'WCAG 2.2 AAA', // Defines the accessibility standard to apply during axe-core scans
              axeCoreVersion: '4.10.2', // Specifies the version of axe-core to use
              bestPractices: true, // Enables or disables axe-core best practice rules
              experimentalRules: true // Enables or disables experimental axe-core rules
                }
              },
    defaultCommandTimeout: 30000, // Set default command timeout to 30 seconds

    // Component testing configuration
    component: {
      devServer: {
        framework: "next", // Use Next.js as the framework
        bundler: "webpack", // Use webpack as the bundler
      },
      specPattern: "**/Button.cy.{ts,tsx}", // Pattern for component test files
      supportFile: "cypress/support/component.ts", // Support file for component tests
    },
  }),
});