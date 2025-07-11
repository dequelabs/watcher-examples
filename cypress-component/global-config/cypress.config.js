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
import path from "path";

const axeApiKey = process.env.AXE_API_KEY || "";
const axeServerURL = process.env.AXE_SERVER_URL || "https://axe.dequelabs.com/";


export default defineConfig({
  // Spread in the axe-core watcher Cypress config
  ...cypressConfig({
    axe: {
      apiKey: API_KEY,
      serverURL: SERVER_URL,
      testingTypes: ['component', 'e2e'],
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
    defaultCommandTimeout: 30000, // Increase default command timeout to 30 seconds

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


 