import IframeComponent from './IframeComponent';
import '@axe-core/watcher/dist/cypressCommands';
import React from 'react';

describe('IframeComponent Tests', () => {
    // Test: Renders with default props and checks iframe existence and content
    it('renders correctly with default props', () => {
        cy.mount(<IframeComponent />);
        cy.get('[data-testid="iframe-container"]').should('exist'); // Assert container exists
        cy.get('[data-testid="test-iframe"]').should('exist'); // Assert iframe exists
        cy.axeWatcherAnalyze(); // Run accessibility analysis

        // Check that the iframe has some content
        cy.get('[data-testid="test-iframe"]')
            .its('0.contentDocument.body')
            .should('not.be.empty');
    });

    // Test: Mounts with custom content and checks for that content inside the iframe
    it('Validate the page whether able to scan iframes', () => {
        cy.mount(<IframeComponent content="<div id='test-content'>Content in iframe</div>" />);

        // Assert the custom content exists inside the iframe
        cy.get('[data-testid="test-iframe"]')
            .its('0.contentDocument.body')
            .find('#test-content')
            .should('exist')
            .and('have.text', 'Content in iframe');

        // Wait for any console logs (not an assertion, just for observation)
        cy.wait(1000); // Give time for the message to process
    });

    // Test: Loads iframe, checks content, and runs axe accessibility analysis
    it('loads iframe (no suppressioandn)', () => {
        cy.mount(<IframeComponent title="Test Iframe" />);

        cy.get('[data-testid="test-iframe"]')
            .should('exist')
            .then(($iframe) => {
                const iframe = $iframe[0] as HTMLIFrameElement;
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

                // Linsten to iframe content loaded
                cy.wrap(iframeDoc?.body).should('contain.text', 'Hello from iframe');
            });

        // Run axe analysis — iframe should be included and not suppressed
        cy.axeWatcherAnalyze();

        // Confirm main container exists
        cy.get('[data-testid="iframe-container"]').should('exist');
    });

    // Clean up after each test by flushing axe-core watcher results
    afterEach(() => {
        cy.axeWatcherFlush();
    });
});