import React from 'react';
import Button from './Button';
import '@axe-core/watcher/dist/cypressCommands'


// Cypress test suite for the Button component
describe('Button Component', () => {
        it('renders correctly with default props', () => {
        cy.axeWatcherStart();
        cy.mount(<Button label="Click me" />); // Mount the Button component
        cy.axeWatcherAnalyze();
        // Assert the button text and existence
        cy.get('[data-testid="button-component"]').should('have.text', 'Click me');
        cy.get('[data-testid="button-component"]').should('exist');
        cy.axeWatcherAnalyze();
        // Check button styles (instead of classes)
        cy.get('[data-testid="button-component"]').should('have.css', 'background-color', 'rgb(229, 231, 235)'); // Equivalent to bg-gray-200
        cy.get('[data-testid="button-component"]').should('have.css', 'color', 'rgb(156, 163, 175)'); // Equivalent to text-gray-400
        cy.axeWatcherStop();
    });

});


