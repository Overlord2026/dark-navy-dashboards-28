/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import '@testing-library/cypress/add-commands'
import 'cypress-real-events/support'

declare global {
  namespace Cypress {
    interface Chainable {
      loginAs(role: 'system_administrator' | 'advisor' | 'client'): Chainable<void>
      seedTestData(): Chainable<void>
    }
  }
}

// Custom command for programmatic login
Cypress.Commands.add('loginAs', (role: 'system_administrator' | 'advisor' | 'client') => {
  const credentials = {
    system_administrator: { email: 'founder@bfocfo.com', password: 'Passw0rd!' },
    advisor: { email: 'advisor_test@bfocfo.com', password: 'Passw0rd!' },
    client: { email: 'client_test@bfocfo.com', password: 'Passw0rd!' }
  }[role];

  cy.session(role, () => {
    cy.visit('/auth');
    
    // Fill login form
    cy.get('input[type="email"]').type(credentials.email);
    cy.get('input[type="password"]').type(credentials.password);
    cy.get('button[type="submit"]').contains('Sign In').click();
    
    // Wait for successful login redirect
    cy.url().should('not.include', '/auth');
    cy.wait(2000); // Allow time for auth state to settle
  });
});

// Custom command for seeding test data
Cypress.Commands.add('seedTestData', () => {
  // This would typically make API calls to seed test data
  // For now, we'll rely on the SQL seed script
  cy.log('Test data seeding - handled by SQL scripts');
});
