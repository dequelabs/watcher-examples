import React from 'react';
import InteractiveForm from '../../../../shared/InteractiveForm';
import { describe, it } from 'node:test';
// Test suite for type & Clear action on InteractiveFormEvents component
describe('InteractiveForm Component Tests', () => {
  it('C130146 - should type and clear required input', () => {
    cy.mount(<InteractiveForm />);
    cy.get('[data-testid="name-input"]')
      .type('Cypress')
      .should('have.value', 'Cypress')
      .clear()
      .should('have.value', '');
  });
 // Test suite for dropdown action on InteractiveFormEvents component
  it('should select an option from dropdown', () => {
    cy.mount(<InteractiveForm />);
    cy.get('[data-testid="select-input"]')
      .select('banana')
      .should('have.value', 'banana');
  });
// Test suite for double-click action on InteractiveFormEvents component
  it('should fire double-click event', () => {
    cy.mount(<InteractiveForm />);
    cy.get('[data-testid="scroll-target"]').dblclick();
    cy.get('[data-testid="dblclick-message"]').should('contain', 'Double-clicked!');
  });
// Test suite for scrollToView action on InteractiveFormEvents component
  it('should scroll element into view', () => {
    cy.mount(<InteractiveForm />);
    cy.get('[data-testid="scroll-target"]').scrollIntoView().should('be.visible');
  });
 // Test suite for rerendering action on InteractiveFormEvents component
  it('should support rerendering with new content', () => {
    const RerenderWrapper = () => {
      const [show, setShow] = React.useState(true);
      return (
        <div>
          <button onClick={() => setShow((prev) => !prev)} data-testid="toggle">Toggle</button>
          {show && <InteractiveForm />}
        </div>
      );
    };

    cy.mount(<RerenderWrapper />);
    cy.get('[data-testid="form-container"]').should('exist');

    // Trigger rerender
    cy.get('[data-testid="toggle"]').click();
    cy.get('[data-testid="form-container"]').should('not.exist');
    cy.get('[data-testid="toggle"]').click();
    cy.get('[data-testid="form-container"]').should('exist');
  });
 // Test suite for unmount the InteractiveFormEvents component
  it('should unmount successfully', () => {
    const Wrapper = ({ visible }: { visible: boolean }) => (
      <div>{visible ? <InteractiveForm /> : null}</div>
    );

    cy.mount(<Wrapper visible={true} />);
    cy.get('[data-testid="form-container"]').should('exist');

    // Unmount by rerendering with `visible={false}`
    cy.mount(<Wrapper visible={false} />);
    cy.get('[data-testid="form-container"]').should('not.exist');
  });
});
