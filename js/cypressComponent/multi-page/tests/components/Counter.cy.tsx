import React from 'react';
import Counter from './Counter';
import '@axe-core/watcher/dist/cypressCommands'

// Cypress test suite for the Counter component
describe('Counter Component', () => {
    // Test: Counter renders with default props
    it('renders with default props', () => {
        cy.mount(<Counter />);
        cy.get('[data-testid="counter-component"]').should('exist'); // Assert the Counter exists in the DOM
        cy.get('[data-testid="counter-value"]').should('have.text', '0'); // Assert the default value is 0
    });

    // Test: Counter renders with custom initial value and label
    it('renders with custom initial value and label', () => {
        cy.mount(<Counter initialValue={10} label="Custom Counter" />);
        cy.contains('Custom Counter').should('exist'); // Assert the custom label is rendered
        cy.get('[data-testid="counter-value"]').should('have.text', '10'); // Assert the initial value is 10
    });

    // Test: Increment button increases the counter value
    it('increments value when increment button is clicked', () => {
        cy.mount(<Counter initialValue={5} />);
        cy.get('[data-testid="counter-value"]').should('have.text', '5');
        cy.contains('Increment').click(); // Click the increment button
        cy.get('[data-testid="counter-value"]').should('have.text', '6'); // Assert the value increased
    });

    // Test: Decrement button decreases the counter value
    it('decrements value when decrement button is clicked', () => {
        cy.mount(<Counter initialValue={5} />);
        cy.get('[data-testid="counter-value"]').should('have.text', '5');
        cy.contains('Decrement').click(); // Click the decrement button
        cy.get('[data-testid="counter-value"]').should('have.text', '4'); // Assert the value decreased
    });

    // Test: Focus and blur events on the first button
    it('triggers focus/blur on button', () => {
         cy.mount(<Counter />);
         cy.get('[data-testid="button-component"]').first().focus().should('have.focus'); // Focus the button
         cy.get('[data-testid="button-component"]').first().blur().should('not.have.focus'); // Blur the button
    });

    // Test: Mouse enter event on the first button
    it('triggers mouse enter via trigger()', () => {
          cy.mount(<Counter />);
          cy.get('[data-testid="button-component"]').first().trigger('mouseenter'); // Trigger mouseenter event
    });
});