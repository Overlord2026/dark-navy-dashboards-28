
describe('Advisor Invite Flow E2E Tests', () => {
  beforeEach(() => {
    // Reset test data before each test
    cy.resetTestData();
  });

  describe('Complete Advisor-to-Prospect Invite Flow', () => {
    it('should complete full advisor invite prospect flow', () => {
      const prospectEmail = 'test.prospect@example.com';
      const advisorEmail = 'jet_senior_advisor@bfocfo.com';

      // Execute complete flow
      cy.completeAdvisorInviteFlow(prospectEmail, advisorEmail);
      
      // Verify prospect is now in advisor's client list
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      cy.get('[data-testid="prospects-list"]')
        .should('contain', prospectEmail)
        .and('contain', 'Active');
    });

    it('should handle invite form validation errors', () => {
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      // Open invite modal
      cy.get('[data-testid="invite-prospect-button"]').click();
      
      // Try to send without required fields
      cy.get('[data-testid="send-invitation-button"]').click();
      
      // Verify validation errors
      cy.get('[data-testid="email-error"]')
        .should('be.visible')
        .and('contain', 'Email is required');
      
      cy.get('[data-testid="first-name-error"]')
        .should('be.visible')
        .and('contain', 'First name is required');
    });

    it('should prevent duplicate invitations', () => {
      const duplicateEmail = 'duplicate.prospect@example.com';
      
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      // Send first invitation
      cy.get('[data-testid="invite-prospect-button"]').click();
      cy.get('[data-testid="prospect-email-input"]').type(duplicateEmail);
      cy.get('[data-testid="prospect-first-name-input"]').type('Duplicate');
      cy.get('[data-testid="prospect-last-name-input"]').type('Test');
      cy.get('[data-testid="send-invitation-button"]').click();
      
      cy.get('[data-testid="invitation-success-message"]').should('be.visible');
      
      // Try to send duplicate invitation
      cy.get('[data-testid="invite-prospect-button"]').click();
      cy.get('[data-testid="prospect-email-input"]').type(duplicateEmail);
      cy.get('[data-testid="prospect-first-name-input"]').type('Duplicate');
      cy.get('[data-testid="prospect-last-name-input"]').type('Test');
      cy.get('[data-testid="send-invitation-button"]').click();
      
      // Verify duplicate error
      cy.get('[data-testid="duplicate-invitation-error"]')
        .should('be.visible')
        .and('contain', 'already been invited');
    });

    it('should handle expired magic links', () => {
      // This would require mocking or manipulating the token expiration
      const expiredToken = 'expired-token-123';
      
      cy.visit(`/invite/${expiredToken}`);
      
      cy.get('[data-testid="expired-link-message"]')
        .should('be.visible')
        .and('contain', 'invitation link has expired');
      
      cy.get('[data-testid="request-new-invite-button"]')
        .should('be.visible');
    });
  });

  describe('Prospect Onboarding Validation', () => {
    it('should validate password requirements', () => {
      const mockToken = 'valid-test-token';
      
      cy.visit(`/invite/${mockToken}`);
      
      // Try weak password
      cy.get('[data-testid="prospect-password-input"]').type('weak');
      cy.get('[data-testid="complete-onboarding-button"]').click();
      
      cy.get('[data-testid="password-strength-error"]')
        .should('be.visible')
        .and('contain', 'Password must be at least 8 characters');
    });

    it('should require password confirmation match', () => {
      const mockToken = 'valid-test-token';
      
      cy.visit(`/invite/${mockToken}`);
      
      cy.get('[data-testid="prospect-password-input"]').type('StrongPass123!');
      cy.get('[data-testid="confirm-password-input"]').type('DifferentPass123!');
      cy.get('[data-testid="complete-onboarding-button"]').click();
      
      cy.get('[data-testid="password-mismatch-error"]')
        .should('be.visible')
        .and('contain', 'Passwords do not match');
    });
  });

  describe('Email Integration Tests', () => {
    it('should send invitation email with correct content', () => {
      const prospectEmail = 'email.test@example.com';
      
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      // Send invitation
      cy.get('[data-testid="invite-prospect-button"]').click();
      cy.get('[data-testid="prospect-email-input"]').type(prospectEmail);
      cy.get('[data-testid="prospect-first-name-input"]').type('Email');
      cy.get('[data-testid="prospect-last-name-input"]').type('Test');
      cy.get('[data-testid="personal-note-textarea"]').type('Custom welcome message');
      cy.get('[data-testid="send-invitation-button"]').click();
      
      // Verify email was sent
      cy.verifyEmailNotification('prospect_invitation', prospectEmail);
    });
  });

  describe('Multi-Tenant Invite Isolation', () => {
    it('should isolate invites by tenant', () => {
      // Login as advisor from tenant A
      cy.loginAsScenario('senior_advisor'); // Assume this is tenant A
      cy.visit('/advisor-dashboard');
      
      // Verify multi-tenant isolation
      cy.verifyMultiTenantIsolation();
      
      // Verify can only see own tenant's prospects
      cy.get('[data-testid="prospects-list"]').within(() => {
        cy.get('[data-tenant-id]').each(($el) => {
          // All prospects should belong to current user's tenant
          expect($el).to.have.attr('data-tenant-id').that.is.not.empty;
        });
      });
    });
  });
});
