import React from 'react';
import Button from './Button';
import '@axe-core/watcher/dist/cypressCommands'

// Cypress test suite for the Button component
describe('Button Component', () => {

    // C130006: Verify zero findings in scan results when no Analyze() API is called
    it('C130006 Verify zero findings in scan results when no Analyze() API is called', () => {
        cy.mount(<Button label="Click me" />);
        cy.get('[data-testid="button-component"]').should('have.text', 'Click me');
        // No Analyze called, so expect zero findings
       
    });

    // C130007: Verify scan results when watcherStart() API is invoked before page is rendered
    //expected to have 11 issues 2 pagestates
    it('C130007 Verify scan results when watcherStart() API is invoked before page is rendered', () => {
        cy.axeWatcherStart();
        cy.mount(<Button label="Click me" />);
        cy.axeWatcherAnalyze();
       
    });

    // C130008: Verify zero findings in scan results when watcherStart() & Stop() API are invoked before page is rendered
    // 0 findlings
    it('C130008 Verify zero findings in scan results when watcherStart() & Stop() API are invoked before page is rendered', () => {
        cy.axeWatcherStart();
        cy.axeWatcherStop();
        cy.mount(<Button label="Click me" />);
        
    });

    // C130009: Verify Analyze call in between multiple start and stop calls
    it('C130009 Verify Analyze call in between multiple start and stop calls', () => {
        cy.axeWatcherStart();
        cy.mount(<Button label="Click me" />);
        cy.axeWatcherAnalyze();
        cy.axeWatcherStop();
        cy.axeWatcherStart();
        cy.axeWatcherAnalyze();
        cy.axeWatcherStop();
        
    });

    // C130010: Verify x number of pagestates in scan results for Analyze() API invoked x number of times
    it('C130010 Verify x number of pagestates in scan results for Analyze() API invoked x number of times', () => {
        cy.axeWatcherStart();
        cy.mount(<Button label="Click me" />);
        cy.axeWatcherAnalyze();
        cy.axeWatcherAnalyze();
        cy.axeWatcherAnalyze();
        
    });

    // C130011: Verify x number of pagestates in scan results for start() and stop() APIs invoked x number of times
    it('C130011 Verify x number of pagestates in scan results for start() and stop() APIs invoked x number of times', () => {
        cy.mount(<Button label="Click me" />);
        cy.axeWatcherStart();
        cy.axeWatcherAnalyze();
        cy.axeWatcherStop();
        cy.axeWatcherStart();
        cy.axeWatcherAnalyze();
        cy.axeWatcherStop();
        
    });

    // // C130012: Verify Scan results when tests run in parallel mode using buildID
    // it.only('C130012 Verify Scan results when tests run in parallel mode using buildID', () => {
    //     // Simulate parallel mode by setting a buildID (if supported by your watcher)
    //     cy.axeWatcherStart({ buildID: 'parallel-build-1' });
    //     cy.mount(<Button label="Click me" />);
    //     cy.axeWatcherAnalyze();
        
    // });

    // Clean up after each test by flushing axe-core watcher results
    afterEach(() => {
        cy.axeWatcherFlush();
    });
});