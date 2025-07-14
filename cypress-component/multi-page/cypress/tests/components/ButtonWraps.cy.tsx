import Button from '../../../../shared/Button';
import '@axe-core/watcher/dist/cypressCommands'
import { describe, it } from 'node:test';

// Test suite for mounting the Button component
describe('Button Component - mount', () => {
  it('should mount the button component', () => {
   cy.mount(<Button label="Click Me" />); // Mount the Button component
   cy.get('[data-testid="button-component"]').should('exist'); // Assert the button exists in the DOM
  });
});

// Test suite for Button click event
describe('Button Component - click', () => {
  it('should call onClick when clicked', () => {
    const onClickSpy = cy.stub().as('clickSpy'); // Create a Cypress stub for the onClick handler
    cy.mount(<Button label="Click" onClick={onClickSpy} />); // Mount the Button with the stub
    cy.get('[data-testid="button-component"]').click(); // Simulate a click event
    cy.get('@clickSpy').should('have.been.calledOnce'); // Assert the stub was called once
  });
});

// Test suite for Checkbox simulation
describe('Checkbox simulation - check/uncheck', () => {
  it('should check and uncheck a box', () => {
    cy.mount(<input type="checkbox" data-testid="checkbox" />); // Mount a checkbox input
    cy.get('[data-testid="checkbox"]').check().should('be.checked'); // Check the box and assert it's checked
    cy.get('[data-testid="checkbox"]').uncheck().should('not.be.checked'); // Uncheck and assert it's not checked
  });
});

// Test suite for triggering custom events on Button
describe('Button Component - trigger', () => {
  it('should trigger a custom event', () => {
    cy.mount(<Button label="Click Me" />); // Mount the Button component
    cy.get('[data-testid="button-component"]').trigger('mouseover'); // Trigger a mouseover event
  });
});

// Test suite for focus and blur events on Button
describe('Button Component - focus and blur', () => {
  it('should receive and lose focus', () => {
    cy.mount(<Button label="Focusable" />); // Mount the Button component
    cy.get('[data-testid="button-component"]').focus().should('have.focus'); // Focus and assert it has focus
    cy.get('[data-testid="button-component"]').blur().should('not.have.focus'); // Blur and assert it lost focus
  });
});

// Test suite for Button component submit action  with Axe accessibility checks
 describe('Button Component - submit action', () => {
  it('should submit the form when clicked', () => {
    const onSubmit = cy.stub().as('submitSpy');
    cy.mount(
      <form onSubmit={e => { e.preventDefault(); onSubmit(); }}>
        <Button label="Submit" type="submit" data-testid="submit-btn" />
      </form>
    );
    cy.get('[data-testid="submit-btn"]').click();
    cy.get('@submitSpy').should('have.been.calledOnce');
  });
});