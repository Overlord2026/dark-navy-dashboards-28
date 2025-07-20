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
      loginAsScenario(scenario: TestUserScenario): Chainable<void>
      testUserScenario(scenario: TestUserScenario): Chainable<void>
      verifyPermissions(expectedPermissions: string[]): Chainable<void>
      setupTestData(): Chainable<void>
      verifyUserRole(expectedRole: string): Chainable<void>
      verifyClientSegment(expectedSegment: string): Chainable<void>
    }
  }
}

type TestUserScenario = 
  | 'superadmin' 
  | 'readonly_admin' 
  | 'tenant_admin'
  | 'senior_advisor' 
  | 'junior_advisor' 
  | 'referral_advisor' 
  | 'recruiting_advisor'
  | 'new_client' 
  | 'premium_client' 
  | 'basic_client' 
  | 'inactive_client' 
  | 'trial_client';

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

// Enhanced scenario-based login command
Cypress.Commands.add('loginAsScenario', (scenario: TestUserScenario) => {
  const scenarioCredentials = {
    superadmin: { email: 'jet_superadmin@bfocfo.com', password: 'Passw0rd!' },
    readonly_admin: { email: 'jet_readonly_admin@bfocfo.com', password: 'Passw0rd!' },
    tenant_admin: { email: 'jet_tenant_admin@bfocfo.com', password: 'Passw0rd!' },
    senior_advisor: { email: 'jet_senior_advisor@bfocfo.com', password: 'Passw0rd!' },
    junior_advisor: { email: 'jet_junior_advisor@bfocfo.com', password: 'Passw0rd!' },
    referral_advisor: { email: 'jet_referral_advisor@bfocfo.com', password: 'Passw0rd!' },
    recruiting_advisor: { email: 'jet_recruiting_advisor@bfocfo.com', password: 'Passw0rd!' },
    new_client: { email: 'jet_new_client@bfocfo.com', password: 'Passw0rd!' },
    premium_client: { email: 'jet_premium_client@bfocfo.com', password: 'Passw0rd!' },
    basic_client: { email: 'jet_basic_client@bfocfo.com', password: 'Passw0rd!' },
    inactive_client: { email: 'jet_inactive_client@bfocfo.com', password: 'Passw0rd!' },
    trial_client: { email: 'jet_trial_client@bfocfo.com', password: 'Passw0rd!' }
  }[scenario];

  cy.session(scenario, () => {
    cy.visit('/auth');
    
    // Fill login form
    cy.get('input[type="email"]').type(scenarioCredentials.email);
    cy.get('input[type="password"]').type(scenarioCredentials.password);
    cy.get('button[type="submit"]').contains('Sign In').click();
    
    // Wait for successful login redirect
    cy.url().should('not.include', '/auth');
    cy.wait(2000); // Allow time for auth state to settle
  });
});

// Test specific user scenario and verify expected state
Cypress.Commands.add('testUserScenario', (scenario: TestUserScenario) => {
  const scenarioExpectations = {
    superadmin: { role: 'system_administrator', hasAdminAccess: true, segment: null },
    readonly_admin: { role: 'system_administrator', hasAdminAccess: true, segment: null },
    tenant_admin: { role: 'tenant_admin', hasAdminAccess: true, segment: null },
    senior_advisor: { role: 'advisor', hasAdminAccess: false, segment: null },
    junior_advisor: { role: 'advisor', hasAdminAccess: false, segment: null },
    referral_advisor: { role: 'advisor', hasAdminAccess: false, segment: null },
    recruiting_advisor: { role: 'advisor', hasAdminAccess: false, segment: null },
    new_client: { role: 'client', hasAdminAccess: false, segment: 'basic' },
    premium_client: { role: 'client', hasAdminAccess: false, segment: 'premium' },
    basic_client: { role: 'client', hasAdminAccess: false, segment: 'basic' },
    inactive_client: { role: 'client', hasAdminAccess: false, segment: 'basic' },
    trial_client: { role: 'client', hasAdminAccess: false, segment: 'trial' }
  }[scenario];

  cy.loginAsScenario(scenario);
  cy.visit('/');
  
  // Verify user role is displayed correctly
  cy.verifyUserRole(scenarioExpectations.role);
  
  // Verify client segment if applicable
  if (scenarioExpectations.segment) {
    cy.verifyClientSegment(scenarioExpectations.segment);
  }
  
  // Test admin access based on role
  if (scenarioExpectations.hasAdminAccess) {
    cy.get('[data-testid="admin-portal-link"]').should('be.visible');
  } else {
    cy.get('[data-testid="admin-portal-link"]').should('not.exist');
  }
});

// Verify user role is correctly displayed
Cypress.Commands.add('verifyUserRole', (expectedRole: string) => {
  // This assumes role is displayed somewhere in the UI
  cy.get('[data-testid="user-role"]').should('contain.text', expectedRole);
});

// Verify client segment for client users
Cypress.Commands.add('verifyClientSegment', (expectedSegment: string) => {
  // This assumes segment is displayed for client users
  cy.get('[data-testid="client-segment"]').should('contain.text', expectedSegment);
});

// Verify user permissions
Cypress.Commands.add('verifyPermissions', (expectedPermissions: string[]) => {
  expectedPermissions.forEach(permission => {
    // This would check for permission-specific UI elements
    cy.get(`[data-permission="${permission}"]`).should('be.visible');
  });
});

// Enhanced test data setup
Cypress.Commands.add('setupTestData', () => {
  // The test data is now pre-seeded via SQL migration
  // This command can be extended for dynamic test data setup
  cy.log('Comprehensive test data available from SQL seeding');
  
  // Optionally verify test data is present
  cy.request('GET', '/api/health-check').then((response) => {
    expect(response.status).to.eq(200);
  });
});
