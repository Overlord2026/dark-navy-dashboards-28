
describe('RIA-Advisor Invite Flow E2E Tests', () => {
  beforeEach(() => {
    cy.resetTestData();
  });

  describe('Admin Invites Advisor Flow', () => {
    it('should complete full RIA-advisor invite flow', () => {
      const newAdvisorEmail = 'new.advisor@example.com';
      
      // Step 1: Admin sends advisor invitation
      cy.loginAsScenario('tenant_admin');
      cy.visit('/admin-portal');
      
      // Navigate to advisor management
      cy.get('[data-testid="manage-advisors-link"]').click();
      cy.get('[data-testid="invite-advisor-button"]').click();
      
      // Fill advisor invitation form
      cy.get('[data-testid="advisor-email-input"]').type(newAdvisorEmail);
      cy.get('[data-testid="advisor-first-name-input"]').type('New');
      cy.get('[data-testid="advisor-last-name-input"]').type('Advisor');
      cy.get('[data-testid="advisor-role-select"]').select('senior_advisor');
      cy.get('[data-testid="client-segments-select"]').select(['premium', 'executive']);
      cy.get('[data-testid="send-advisor-invite-button"]').click();
      
      // Verify invitation sent
      cy.get('[data-testid="advisor-invite-success"]')
        .should('be.visible')
        .and('contain', 'Advisor invitation sent');
      
      // Step 2: Extract invitation token and complete advisor onboarding
      cy.waitForInviteEmail(newAdvisorEmail).then((emailContent) => {
        cy.extractMagicLinkFromEmail(emailContent).then((inviteLink) => {
          const token = inviteLink.split('/advisor-invite/')[1];
          cy.completeRIAAdvisorFlow(token);
        });
      });
      
      // Step 3: Verify advisor is active in system
      cy.loginAsScenario('tenant_admin');
      cy.visit('/admin-portal/users');
      
      cy.get('[data-testid="advisors-list"]')
        .should('contain', newAdvisorEmail)
        .and('contain', 'Active');
    });

    it('should validate advisor role permissions after onboarding', () => {
      const advisorEmail = 'permissions.test@example.com';
      
      // Admin invites advisor with specific role
      cy.loginAsScenario('tenant_admin');
      cy.visit('/admin-portal');
      
      cy.get('[data-testid="manage-advisors-link"]').click();
      cy.get('[data-testid="invite-advisor-button"]').click();
      
      cy.get('[data-testid="advisor-email-input"]').type(advisorEmail);
      cy.get('[data-testid="advisor-first-name-input"]').type('Permission');
      cy.get('[data-testid="advisor-last-name-input"]').type('Test');
      cy.get('[data-testid="advisor-role-select"]').select('junior_advisor');
      cy.get('[data-testid="send-advisor-invite-button"]').click();
      
      // Complete advisor onboarding (simplified)
      const mockToken = 'permissions-test-token';
      cy.completeRIAAdvisorFlow(mockToken);
      
      // Verify advisor has correct permissions
      cy.url().should('include', '/advisor-dashboard');
      
      // Junior advisor should not have admin access
      cy.get('[data-testid="admin-portal-link"]').should('not.exist');
      
      // Should have limited client segment access
      cy.get('[data-testid="client-segments"]').within(() => {
        cy.get('[data-segment="premium"]').should('not.exist');
        cy.get('[data-segment="basic"]').should('be.visible');
      });
    });

    it('should prevent duplicate advisor invitations', () => {
      const duplicateEmail = 'duplicate.advisor@example.com';
      
      cy.loginAsScenario('tenant_admin');
      cy.visit('/admin-portal');
      
      // Send first invitation
      cy.get('[data-testid="manage-advisors-link"]').click();
      cy.get('[data-testid="invite-advisor-button"]').click();
      
      cy.get('[data-testid="advisor-email-input"]').type(duplicateEmail);
      cy.get('[data-testid="advisor-first-name-input"]').type('Duplicate');
      cy.get('[data-testid="advisor-last-name-input"]').type('Advisor');
      cy.get('[data-testid="advisor-role-select"]').select('senior_advisor');
      cy.get('[data-testid="send-advisor-invite-button"]').click();
      
      cy.get('[data-testid="advisor-invite-success"]').should('be.visible');
      
      // Try duplicate invitation
      cy.get('[data-testid="invite-advisor-button"]').click();
      cy.get('[data-testid="advisor-email-input"]').type(duplicateEmail);
      cy.get('[data-testid="advisor-first-name-input"]').type('Duplicate');
      cy.get('[data-testid="advisor-last-name-input"]').type('Advisor');
      cy.get('[data-testid="advisor-role-select"]').select('senior_advisor');
      cy.get('[data-testid="send-advisor-invite-button"]').click();
      
      cy.get('[data-testid="duplicate-advisor-error"]')
        .should('be.visible')
        .and('contain', 'Advisor already invited or exists');
    });
  });

  describe('Advisor Onboarding Validation', () => {
    it('should require compliance acceptance', () => {
      const mockToken = 'compliance-test-token';
      
      cy.visit(`/advisor-invite/${mockToken}`);
      
      // Fill form without accepting compliance
      cy.get('[data-testid="advisor-password-input"]').type('CompliantPass123!');
      cy.get('[data-testid="confirm-password-input"]').type('CompliantPass123!');
      cy.get('[data-testid="phone-input"]').type('(555) 123-4567');
      cy.get('[data-testid="license-number-input"]').type('ADV-54321');
      
      // Try to complete without compliance checkbox
      cy.get('[data-testid="complete-advisor-setup-button"]').click();
      
      cy.get('[data-testid="compliance-required-error"]')
        .should('be.visible')
        .and('contain', 'must accept compliance requirements');
    });

    it('should validate license number format', () => {
      const mockToken = 'license-test-token';
      
      cy.visit(`/advisor-invite/${mockToken}`);
      
      // Try invalid license format
      cy.get('[data-testid="license-number-input"]').type('invalid-license');
      cy.get('[data-testid="complete-advisor-setup-button"]').click();
      
      cy.get('[data-testid="license-format-error"]')
        .should('be.visible')
        .and('contain', 'Invalid license number format');
    });
  });

  describe('Client Assignment Workflow', () => {
    it('should assign clients to new advisor based on segments', () => {
      const advisorEmail = 'segment.advisor@example.com';
      
      // Create advisor with specific segments
      cy.loginAsScenario('tenant_admin');
      cy.visit('/admin-portal');
      
      cy.get('[data-testid="manage-advisors-link"]').click();
      cy.get('[data-testid="invite-advisor-button"]').click();
      
      cy.get('[data-testid="advisor-email-input"]').type(advisorEmail);
      cy.get('[data-testid="advisor-first-name-input"]').type('Segment');
      cy.get('[data-testid="advisor-last-name-input"]').type('Advisor');
      cy.get('[data-testid="advisor-role-select"]').select('senior_advisor');
      cy.get('[data-testid="client-segments-select"]').select(['premium', 'executive']);
      cy.get('[data-testid="send-advisor-invite-button"]').click();
      
      // Complete advisor onboarding
      const mockToken = 'segment-test-token';
      cy.completeRIAAdvisorFlow(mockToken);
      
      // Verify advisor can see assigned segment clients
      cy.visit('/advisor-dashboard');
      
      cy.get('[data-testid="assigned-clients"]').within(() => {
        cy.get('[data-client-segment="premium"]').should('be.visible');
        cy.get('[data-client-segment="executive"]').should('be.visible');
        cy.get('[data-client-segment="basic"]').should('not.exist');
      });
    });
  });

  describe('Multi-Tenant Advisor Access', () => {
    it('should restrict advisor access to their tenant only', () => {
      const crossTenantEmail = 'cross.tenant@example.com';
      
      // Invite advisor to specific tenant
      cy.loginAsScenario('tenant_admin'); // Tenant A admin
      cy.visit('/admin-portal');
      
      cy.get('[data-testid="manage-advisors-link"]').click();
      cy.get('[data-testid="invite-advisor-button"]').click();
      
      cy.get('[data-testid="advisor-email-input"]').type(crossTenantEmail);
      cy.get('[data-testid="advisor-first-name-input"]').type('Cross');
      cy.get('[data-testid="advisor-last-name-input"]').type('Tenant');
      cy.get('[data-testid="advisor-role-select"]').select('senior_advisor');
      cy.get('[data-testid="send-advisor-invite-button"]').click();
      
      // Complete onboarding
      const mockToken = 'cross-tenant-token';
      cy.completeRIAAdvisorFlow(mockToken);
      
      // Verify multi-tenant isolation
      cy.verifyMultiTenantIsolation();
      
      // Advisor should only see clients from their tenant
      cy.get('[data-testid="client-list"]').within(() => {
        cy.get('[data-client-id]').each(($el) => {
          cy.wrap($el).should('have.attr', 'data-tenant-id');
        });
      });
    });
  });
});
