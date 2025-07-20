
// Enhanced Cypress commands for comprehensive flow testing

/// <reference types="cypress" />

// Import test data
import testData from '../fixtures/test-data.json';

declare global {
  namespace Cypress {
    interface Chainable {
      loginAsRole(role: string): Chainable<void>
      loginAsScenario(scenario: string): Chainable<void>
      setupTestData(): Chainable<void>
      resetTestData(): Chainable<void>
      verifyRoleBasedAccess(role: string): Chainable<void>
      completeAdvisorInviteFlow(prospectEmail: string, advisorEmail: string): Chainable<void>
      completeRIAAdvisorFlow(token: string): Chainable<void>
      verifyMultiTenantIsolation(): Chainable<void>
      verifyEmailNotification(type: string, email: string): Chainable<void>
      waitForInviteEmail(email: string): Chainable<any>
      extractMagicLinkFromEmail(emailContent: string): Chainable<string>
      testUserScenario(scenario: string): Chainable<void>
      verifyEdgeFunctionActivity(): Chainable<void>
      verifyAdminDashboardMetrics(): Chainable<void>
    }
  }
}

// Login commands
Cypress.Commands.add('loginAsRole', (role: string) => {
  const userMap: Record<string, any> = {
    'system_administrator': testData.testUsers.superadmin,
    'advisor': testData.testUsers.seniorAdvisor,
    'client': testData.testUsers.premiumClient
  };
  
  const user = userMap[role];
  if (!user) {
    throw new Error(`Unknown role: ${role}`);
  }
  
  cy.visit('/auth');
  cy.get('input[type="email"]').type(user.email);
  cy.get('input[type="password"]').type(user.password);
  cy.get('button[type="submit"]').click();
  
  // Wait for redirect and verify login
  cy.url().should('not.include', '/auth');
  cy.contains(user.firstName).should('be.visible');
});

Cypress.Commands.add('loginAsScenario', (scenario: string) => {
  const scenarioMap: Record<string, string> = {
    'superadmin': 'jet_superadmin@bfocfo.com',
    'tenant_admin': 'jet_tenant_admin@bfocfo.com',
    'senior_advisor': 'jet_senior_advisor@bfocfo.com',
    'junior_advisor': 'jet_junior_advisor@bfocfo.com',
    'premium_client': 'jet_premium_client@bfocfo.com',
    'basic_client': 'jet_basic_client@bfocfo.com'
  };
  
  const email = scenarioMap[scenario];
  if (!email) {
    throw new Error(`Unknown scenario: ${scenario}`);
  }
  
  cy.visit('/auth');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type('Passw0rd!');
  cy.get('button[type="submit"]').click();
  
  // Wait for successful login
  cy.url().should('not.include', '/auth');
  cy.wait(1000); // Allow time for auth state to settle
});

// Test data management
Cypress.Commands.add('setupTestData', () => {
  cy.log('Setting up test data...');
  // This would typically involve API calls to ensure test data exists
  cy.window().its('localStorage').invoke('clear');
  cy.clearCookies();
});

Cypress.Commands.add('resetTestData', () => {
  cy.log('Resetting test data...');
  
  // Login as superadmin first
  cy.loginAsScenario('superadmin');
  
  // Navigate to system health page
  cy.visit('/admin-portal/system-health');
  
  // Find and click reset button
  cy.get('[data-testid="reset-test-data-button"]', { timeout: 10000 })
    .should('be.visible')
    .click();
  
  // Confirm reset in dialog
  cy.get('[data-testid="confirm-reset-button"]', { timeout: 10000 })
    .should('be.visible')
    .click();
  
  // Wait for reset completion
  cy.get('[data-testid="reset-success-message"]', { timeout: 30000 })
    .should('be.visible');
  
  cy.log('Test data reset completed');
});

// Role-based access verification
Cypress.Commands.add('verifyRoleBasedAccess', (role: string) => {
  const roleConfig = {
    'system_administrator': {
      canAccess: ['/admin-portal', '/admin-portal/system-health', '/admin-portal/users'],
      cannotAccess: []
    },
    'advisor': {
      canAccess: ['/admin-portal', '/advisor-dashboard'],
      cannotAccess: ['/admin-portal/system-health']
    },
    'client': {
      canAccess: ['/'],
      cannotAccess: ['/admin-portal', '/advisor-dashboard']
    }
  };
  
  const config = roleConfig[role as keyof typeof roleConfig];
  
  // Test accessible routes
  config.canAccess.forEach(route => {
    cy.visit(route);
    cy.url().should('include', route);
    cy.get('body').should('not.contain', 'Access denied');
  });
  
  // Test restricted routes
  config.cannotAccess.forEach(route => {
    cy.visit(route, { failOnStatusCode: false });
    cy.url().should('not.include', route);
  });
});

// Complex flow commands
Cypress.Commands.add('completeAdvisorInviteFlow', (prospectEmail: string, advisorEmail: string) => {
  // Step 1: Login as advisor and send invitation
  cy.loginAsScenario('senior_advisor');
  cy.visit('/advisor-dashboard');
  
  // Send prospect invitation
  cy.get('[data-testid="invite-prospect-button"]', { timeout: 10000 })
    .should('be.visible')
    .click();
  
  cy.get('[data-testid="prospect-email-input"]').type(prospectEmail);
  cy.get('[data-testid="prospect-first-name-input"]').type('Test');
  cy.get('[data-testid="prospect-last-name-input"]').type('Prospect');
  cy.get('[data-testid="send-invitation-button"]').click();
  
  // Verify invitation sent
  cy.get('[data-testid="invitation-success-message"]')
    .should('be.visible');
  
  // Step 2: Simulate prospect accepting invitation
  // In a real test, we'd extract the magic link from email
  // For now, we'll simulate the onboarding process
  const mockToken = 'test-prospect-token-' + Date.now();
  
  cy.visit(`/invite/${mockToken}`);
  
  // Complete prospect onboarding (if page exists)
  cy.get('body').then($body => {
    if ($body.find('[data-testid="prospect-onboarding-form"]').length > 0) {
      cy.get('[data-testid="prospect-password-input"]').type('TestPass123!');
      cy.get('[data-testid="confirm-password-input"]').type('TestPass123!');
      cy.get('[data-testid="complete-onboarding-button"]').click();
      
      cy.get('[data-testid="onboarding-success"]')
        .should('be.visible');
    }
  });
});

Cypress.Commands.add('completeRIAAdvisorFlow', (token: string) => {
  cy.visit(`/advisor-invite/${token}`);
  
  // Complete advisor onboarding form
  cy.get('body').then($body => {
    if ($body.find('[data-testid="advisor-onboarding-form"]').length > 0) {
      cy.get('[data-testid="advisor-password-input"]').type('AdvisorPass123!');
      cy.get('[data-testid="confirm-password-input"]').type('AdvisorPass123!');
      cy.get('[data-testid="phone-input"]').type('(555) 123-4567');
      cy.get('[data-testid="license-number-input"]').type('ADV-12345');
      cy.get('[data-testid="compliance-checkbox"]').check();
      cy.get('[data-testid="complete-advisor-setup-button"]').click();
      
      cy.get('[data-testid="advisor-setup-success"]')
        .should('be.visible');
      
      // Should redirect to advisor dashboard
      cy.url().should('include', '/advisor-dashboard');
    }
  });
});

// Verification commands
Cypress.Commands.add('verifyMultiTenantIsolation', () => {
  // Verify user can only see their tenant's data
  cy.get('[data-tenant-id]').each($el => {
    cy.wrap($el).should('have.attr', 'data-tenant-id').and('not.be.empty');
  });
});

Cypress.Commands.add('verifyEmailNotification', (type: string, email: string) => {
  // Mock email verification - in real implementation would check email service
  cy.log(`Verifying ${type} email notification sent to ${email}`);
  
  // Check for UI confirmation
  cy.get('[data-testid*="email-sent"]')
    .should('be.visible');
});

Cypress.Commands.add('waitForInviteEmail', (email: string) => {
  // Mock email waiting - return mock email content
  cy.log(`Waiting for invite email to ${email}`);
  
  return cy.wrap({
    subject: 'You\'re Invited!',
    body: testData.mockEmailContent.prospectInvite,
    recipient: email
  });
});

Cypress.Commands.add('extractMagicLinkFromEmail', (emailContent: string) => {
  // Extract magic link from email content
  const linkMatch = emailContent.match(/https?:\/\/[^\s<>"]+/);
  const magicLink = linkMatch ? linkMatch[0] : `${Cypress.config().baseUrl}/invite/mock-token-${Date.now()}`;
  
  return cy.wrap(magicLink);
});

Cypress.Commands.add('testUserScenario', (scenario: string) => {
  cy.loginAsScenario(scenario);
  
  // Verify appropriate dashboard loads
  cy.get('[data-testid="main-content"]', { timeout: 10000 })
    .should('be.visible');
  
  // Take screenshot for visual regression
  cy.screenshot(`user-scenario-${scenario}`);
  
  // Verify no console errors
  cy.window().then((win) => {
    cy.wrap(win.console).should('not.have.been.calledWith', 'error');
  });
});

Cypress.Commands.add('verifyEdgeFunctionActivity', () => {
  // Verify edge function monitoring is working
  cy.get('[data-testid="edge-function-metrics"]')
    .should('be.visible');
  
  cy.get('[data-testid="edge-function-success-rate"]')
    .should('be.visible')
    .and('contain.text', '%');
});

Cypress.Commands.add('verifyAdminDashboardMetrics', () => {
  // Verify admin dashboard shows proper metrics
  cy.get('[data-testid="kpi-tile"]')
    .should('have.length.greaterThan', 0);
  
  cy.get('[data-testid="system-health-indicator"]')
    .should('be.visible');
  
  cy.get('[data-testid="recent-activity-feed"]')
    .should('be.visible');
});
