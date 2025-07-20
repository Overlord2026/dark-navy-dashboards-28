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
      resetTestData(): Chainable<void>
      verifyMultiTenantIsolation(tenantId?: string): Chainable<void>
      completeAdvisorInviteFlow(prospectEmail: string, advisorEmail: string): Chainable<void>
      completeProspectInviteFlow(inviteToken: string): Chainable<void>
      completeRIAAdvisorFlow(inviteToken: string): Chainable<void>
      verifyEmailNotification(emailType: string, recipient: string): Chainable<void>
      waitForInviteEmail(email: string): Chainable<string>
      extractMagicLinkFromEmail(emailContent: string): Chainable<string>
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

// Test Data Reset Command
Cypress.Commands.add('resetTestData', () => {
  cy.log('Initiating test data reset...');
  
  // Login as superadmin to perform reset
  cy.loginAsScenario('superadmin');
  cy.visit('/admin-portal');
  
  // Navigate to system health or test data section
  cy.get('[data-testid="reset-test-data-button"]', { timeout: 10000 })
    .should('be.visible')
    .click();
  
  // Confirm reset action
  cy.get('[data-testid="confirm-reset-button"]')
    .should('be.visible')
    .click();
  
  // Wait for reset completion
  cy.get('[data-testid="reset-success-message"]', { timeout: 30000 })
    .should('be.visible')
    .and('contain', 'Test data reset completed');
  
  cy.log('Test data reset completed successfully');
});

// Multi-Tenant Isolation Verification
Cypress.Commands.add('verifyMultiTenantIsolation', (tenantId?: string) => {
  cy.log('Verifying multi-tenant data isolation...');
  
  // Get current user's tenant context
  cy.window().its('localStorage').then((localStorage) => {
    const userProfile = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}');
    const currentTenantId = tenantId || userProfile.user?.tenant_id;
    
    if (!currentTenantId) {
      throw new Error('No tenant ID found for isolation test');
    }
    
    // Verify user can only see their tenant's data
    cy.request({
      method: 'GET',
      url: '/api/test-tenant-isolation',
      headers: {
        'Authorization': `Bearer ${userProfile.access_token}`
      },
      body: { tenantId: currentTenantId }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.isolationVerified).to.be.true;
      expect(response.body.accessibleTenants).to.have.length(1);
      expect(response.body.accessibleTenants[0]).to.eq(currentTenantId);
    });
  });
});

// Complete Advisor Invite Flow
Cypress.Commands.add('completeAdvisorInviteFlow', (prospectEmail: string, advisorEmail: string) => {
  cy.log(`Starting advisor invite flow: ${advisorEmail} inviting ${prospectEmail}`);
  
  // Step 1: Login as advisor and send invite
  cy.loginAsScenario('senior_advisor');
  cy.visit('/advisor-dashboard');
  
  // Open invite prospect modal
  cy.get('[data-testid="invite-prospect-button"]').click();
  
  // Fill invite form
  cy.get('[data-testid="prospect-email-input"]').type(prospectEmail);
  cy.get('[data-testid="prospect-first-name-input"]').type('Test');
  cy.get('[data-testid="prospect-last-name-input"]').type('Prospect');
  cy.get('[data-testid="client-segment-select"]').select('premium');
  cy.get('[data-testid="personal-note-textarea"]').type('Welcome to our platform!');
  
  // Send invitation
  cy.get('[data-testid="send-invitation-button"]').click();
  
  // Verify success message
  cy.get('[data-testid="invitation-success-message"]')
    .should('be.visible')
    .and('contain', 'Invitation sent successfully');
  
  // Step 2: Extract magic link from email
  cy.waitForInviteEmail(prospectEmail).then((emailContent) => {
    cy.extractMagicLinkFromEmail(emailContent).then((magicLink) => {
      // Step 3: Complete prospect onboarding
      cy.completeProspectInviteFlow(magicLink);
    });
  });
});

// Complete Prospect Invite Flow
Cypress.Commands.add('completeProspectInviteFlow', (magicLink: string) => {
  cy.log(`Completing prospect onboarding with magic link: ${magicLink}`);
  
  // Visit magic link
  cy.visit(magicLink);
  
  // Should be on invite redemption page
  cy.url().should('include', '/invite/');
  
  // Fill onboarding form
  cy.get('[data-testid="prospect-password-input"]').type('NewPassword123!');
  cy.get('[data-testid="confirm-password-input"]').type('NewPassword123!');
  cy.get('[data-testid="phone-input"]').type('(555) 123-4567');
  cy.get('[data-testid="complete-onboarding-button"]').click();
  
  // Verify successful onboarding
  cy.url().should('include', '/client-dashboard');
  cy.get('[data-testid="welcome-message"]')
    .should('be.visible')
    .and('contain', 'Welcome to Boutique Family Office');
});

// Complete RIA-Advisor Flow
Cypress.Commands.add('completeRIAAdvisorFlow', (inviteToken: string) => {
  cy.log(`Completing RIA advisor onboarding with token: ${inviteToken}`);
  
  // Visit advisor invite link
  cy.visit(`/advisor-invite/${inviteToken}`);
  
  // Should be on advisor invite redemption page
  cy.url().should('include', '/advisor-invite/');
  
  // Fill advisor onboarding form
  cy.get('[data-testid="advisor-password-input"]').type('AdvisorPass123!');
  cy.get('[data-testid="confirm-password-input"]').type('AdvisorPass123!');
  cy.get('[data-testid="phone-input"]').type('(555) 987-6543');
  cy.get('[data-testid="license-number-input"]').type('ADV-12345');
  cy.get('[data-testid="accept-compliance-checkbox"]').check();
  cy.get('[data-testid="complete-advisor-setup-button"]').click();
  
  // Verify successful advisor setup
  cy.url().should('include', '/advisor-dashboard');
  cy.get('[data-testid="advisor-welcome-message"]')
    .should('be.visible')
    .and('contain', 'Welcome to your advisor dashboard');
});

// Wait for and retrieve invite email
Cypress.Commands.add('waitForInviteEmail', (email: string) => {
  cy.log(`Waiting for invite email to: ${email}`);
  
  // Poll for email using test email service or mock
  return cy.wrap(null).then(() => {
    return new Cypress.Promise((resolve) => {
      // In a real implementation, this would poll a test email service
      // For now, we'll simulate with a timeout and mock email content
      setTimeout(() => {
        const mockEmailContent = `
          <html>
            <body>
              <h1>You're Invited!</h1>
              <p>Click the link below to accept your invitation:</p>
              <a href="http://localhost:3000/invite/mock-token-123">Accept Invitation</a>
            </body>
          </html>
        `;
        resolve(mockEmailContent);
      }, 2000);
    });
  });
});

// Extract magic link from email content
Cypress.Commands.add('extractMagicLinkFromEmail', (emailContent: string) => {
  const linkRegex = /href="([^"]*\/invite\/[^"]*)"/;
  const match = emailContent.match(linkRegex);
  
  if (!match || !match[1]) {
    throw new Error('Could not extract magic link from email content');
  }
  
  return cy.wrap(match[1]);
});

// Verify email notification
Cypress.Commands.add('verifyEmailNotification', (emailType: string, recipient: string) => {
  cy.log(`Verifying ${emailType} email notification to: ${recipient}`);
  
  // This would integrate with a test email service in a real implementation
  cy.request({
    method: 'GET',
    url: `/api/test-emails/${emailType}/${encodeURIComponent(recipient)}`,
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.emailSent).to.be.true;
    expect(response.body.recipient).to.eq(recipient);
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
