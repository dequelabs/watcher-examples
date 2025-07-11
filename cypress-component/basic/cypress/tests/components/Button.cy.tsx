import React from 'react';
import Button from './Button';
import '@axe-core/watcher/dist/cypressCommands'
import { mount } from '@cypress/react';

describe('Button Component', () => {
    // Test: Button renders correctly with default props and passes accessibility analysis
    it('renders correctly with default props', () => {
        mount(<Button label="Click me" />); // Mount the Button component
        // Assert the button text and existence
        cy.get('[data-testid="button-component"]').should('have.text', 'Click me');
        cy.get('[data-testid="button-component"]').should('exist');
        // Check button styles (instead of classes)
        cy.get('[data-testid="button-component"]').should('have.css', 'background-color', 'rgb(229, 231, 235)'); // Equivalent to bg-gray-200
        cy.get('[data-testid="button-component"]').should('have.css', 'color', 'rgb(156, 163, 175)'); // Equivalent to text-gray-400
    });

});  