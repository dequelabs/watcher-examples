# Cypress Component Testing: Global Config Example

This folder demonstrates Cypress component testing with a global axe-core watcher configuration for accessibility analysis.

## How to run
1. Ensure you have Node.js and npm installed.
2. Run `npm install` in this directory.
3. Run `npx cypress open --component` to launch Cypress component testing UI.
4. Select and run tests from the UI (e.g., `cypress/tests/components/Button.cy.tsx`).

## Global Accessibility Configuration
- axe-core watcher is integrated via `@axe-core/watcher` and configured globally in `cypress.config.js`.
- Accessibility results are flushed after each test using `cy.axeWatcherFlush()` (see `cypress/support/component.ts`).
- You can override global accessibility settings in the `axe` section of `cypress.config.js`.

## File Structure
- `package.json`: Cypress, React, axe-core watcher, and related dependencies.
- `cypress.config.js`: Cypress configuration for component tests and global axe-core watcher settings.
- `cypress/support/component.ts`: Cypress support file for custom commands and global hooks.
- `cypress/tests/components/Button.tsx`: Example React component.
- `cypress/tests/components/Button.cy.tsx`: Cypress test for the Button component.

## Example Test
The Button component is tested for rendering, styles, and accessibility:
```tsx
import React from 'react';
import Button from './Button';
import '@axe-core/watcher/dist/cypressCommands';
import { mount } from '@cypress/react';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    mount(<Button label="Click me" />);
    cy.get('[data-testid="button-component"]').should('have.text', 'Click me');
    cy.get('[data-testid="button-component"]').should('exist');
    cy.get('[data-testid="button-component"]').should('have.css', 'background-color', 'rgb(229, 231, 235)');
    cy.get('[data-testid="button-component"]').should('have.css', 'color', 'rgb(156, 163, 175)');
  });
});
```

## Notes
- You can copy more components from the hello-next repo and add tests in the `cypress/tests/components/` folder.
- Accessibility results are automatically sent to axe watcher after each test.
- Global configuration can be customized in `cypress.config.js`.
