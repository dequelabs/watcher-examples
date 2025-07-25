/**
 * Cypress Configuration File with axe-core Accessibility Integration (Latest axe-core)
 *
 * This configuration extends Cypress with axe-core accessibility testing
 * using the @axe-core/watcher package. It supports both component and end-to-end (e2e) testing.
 * 
 * Key Features:
 * - Integrates axe-core for automated accessibility checks.
 * - Supports both component and e2e testing modes.
 * - Allows customization of axe-core rules and standards.
 * - configurationOverrides for latest axe-core settings such as accessibility standards, version, and rules.
 */

import { defineConfig } from "cypress";
import { cypressConfig } from "@axe-core/watcher";
import webpackConfig from "../webpack.config.js";

// Get your configuration from environment variables.
const { API_KEY, SERVER_URL = 'https://axe.deque.com' } = process.env

export default defineConfig({
  // Spread in the axe-core watcher Cypress config
  ...cypressConfig({
    axe: {
      apiKey: API_KEY,
      serverURL: SERVER_URL,
      testingTypes: ['component', 'e2e'],
    },
    defaultCommandTimeout: 30000, // Increase default command timeout to 30 seconds

    // Component testing configuration
    component: {
      devServer: {
        framework: "next", // Use Next.js as the framework
        bundler: "webpack", // Use webpack as the bundler
        webpackConfig
      },
      specPattern: "**/Button.cy.{ts,tsx}", // Pattern for component test files
      supportFile: "cypress/support/component.ts", // Support file for component tests
    },
 
  }),
});
