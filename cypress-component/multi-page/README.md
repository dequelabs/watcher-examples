# Cypress Component Testing: Multi-page Example

This folder demonstrates Cypress component testing using a real React component (`Button.tsx`, `Counter.tsx`, `InteractiveForm.tsx` etc.,) and accessibility analysis with axe-core watcher.

## How to run
1. Ensure you have Node.js and npm installed.
2. Run `npm install` in this directory.
3. Run `npx cypress open --component` to launch Cypress component testing UI.
4. Select and run tests from the UI (e.g., `cypress/tests/components/*.cy.tsx`).

## Accessibility Integration
- axe-core watcher is integrated via `@axe-core/watcher`.
- Accessibility results are flushed after each test using `cy.axeWatcherFlush()` (see `support/component.ts`).

## File Structure
- `package.json`: Cypress, React, axe-core watcher, and related dependencies.
- `cypress.config.js`: Cypress configuration for component tests and axe-core watcher integration.
- `cypress/support/component.ts`: Cypress support file for custom commands and global hooks.
- `cypress/tests/components/*.tsx`: Example React component.
- `cypress/tests/components/*.cy.tsx`: Cypress test for the Button component.


## Notes

- Accessibility results are automatically sent to axe watcher after each test.
