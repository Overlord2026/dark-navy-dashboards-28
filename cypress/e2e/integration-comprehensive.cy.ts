
describe('Comprehensive Integration Tests', () => {
  beforeEach(() => {
    cy.resetTestData();
  });

  describe('End-to-End User Journeys', () => {
    it('should complete full advisor-prospect-client lifecycle', () => {
      const prospectEmail = 'lifecycle.test@example.com';
      const advisorEmail = 'jet_senior_advisor@bfocfo.com';
      
      // Step 1: Advisor invites prospect
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      cy.get('[data-testid="invite-prospect-button"]').click();
      cy.get('[data-testid="prospect-email-input"]').type(prospectEmail);
      cy.get('[data-testid="prospect-first-name-input"]').type('Lifecycle');
      cy.get('[data-testid="prospect-last-name-input"]').type('Test');
      cy.get('[data-testid="client-segment-select"]').select('premium');
      cy.get('[data-testid="send-invitation-button"]').click();
      
      // Verify invitation created
      cy.get('[data-testid="invitation-success-message"]').should('be.visible');
      
      // Step 2: Prospect redeems invitation
      cy.waitForInviteEmail(prospectEmail).then((emailContent) => {
        cy.extractMagicLinkFromEmail(emailContent).then((magicLink) => {
          cy.visit(magicLink);
          
          // Complete onboarding
          cy.get('[data-testid="prospect-password-input"]').type('NewClient123!');
          cy.get('[data-testid="confirm-password-input"]').type('NewClient123!');
          cy.get('[data-testid="phone-input"]').type('(555) 111-2222');
          cy.get('[data-testid="complete-onboarding-button"]').click();
          
          // Should be redirected to client dashboard
          cy.url().should('include', '/client-dashboard');
        });
      });
      
      // Step 3: Verify advisor-client relationship established
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      cy.get('[data-testid="clients-list"]')
        .should('contain', prospectEmail)
        .and('contain', 'Active');
      
      // Step 4: Client can access advisor-provided resources
      cy.loginAs('client'); // Login as the new client
      cy.visit('/client-dashboard');
      
      cy.get('[data-testid="advisor-info"]')
        .should('contain', 'Senior Advisor');
      
      cy.get('[data-testid="available-resources"]')
        .should('be.visible')
        .and('have.length.greaterThan', 0);
    });

    it('should handle multi-step advisor onboarding and client assignment', () => {
      const newAdvisorEmail = 'comprehensive.advisor@example.com';
      
      // Step 1: Admin invites advisor
      cy.loginAsScenario('tenant_admin');
      cy.visit('/admin-portal');
      
      cy.get('[data-testid="manage-advisors-link"]').click();
      cy.get('[data-testid="invite-advisor-button"]').click();
      
      cy.get('[data-testid="advisor-email-input"]').type(newAdvisorEmail);
      cy.get('[data-testid="advisor-first-name-input"]').type('Comprehensive');
      cy.get('[data-testid="advisor-last-name-input"]').type('Advisor');
      cy.get('[data-testid="advisor-role-select"]').select('senior_advisor');
      cy.get('[data-testid="client-segments-select"]').select(['premium', 'executive']);
      cy.get('[data-testid="send-advisor-invite-button"]').click();
      
      // Step 2: Advisor completes onboarding
      const mockToken = 'comprehensive-advisor-token';
      cy.completeRIAAdvisorFlow(mockToken);
      
      // Step 3: Verify advisor has access to assigned segments
      cy.get('[data-testid="assigned-segments"]')
        .should('contain', 'Premium')
        .and('contain', 'Executive');
      
      // Step 4: Advisor can invite prospects
      cy.get('[data-testid="invite-prospect-button"]').should('be.visible');
      
      // Step 5: Admin can verify advisor setup
      cy.loginAsScenario('tenant_admin');
      cy.visit('/admin-portal/users');
      
      cy.get('[data-testid="advisors-list"]')
        .should('contain', newAdvisorEmail)
        .and('contain', 'Active');
    });
  });

  describe('Error Recovery and Graceful Degradation', () => {
    it('should handle email service failures gracefully', () => {
      // Mock email service failure
      cy.intercept('POST', '**/functions/v1/leads-invite', {
        statusCode: 500,
        body: { error: 'Email service unavailable' }
      }).as('emailFailure');
      
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      cy.get('[data-testid="invite-prospect-button"]').click();
      cy.get('[data-testid="prospect-email-input"]').type('email.failure@example.com');
      cy.get('[data-testid="prospect-first-name-input"]').type('Email');
      cy.get('[data-testid="prospect-last-name-input"]').type('Failure');
      cy.get('[data-testid="send-invitation-button"]').click();
      
      cy.wait('@emailFailure');
      
      // Verify graceful error handling
      cy.get('[data-testid="email-error-message"]')
        .should('be.visible')
        .and('contain', 'invitation could not be sent');
      
      cy.get('[data-testid="retry-invitation-button"]')
        .should('be.visible');
    });

    it('should handle database connection issues', () => {
      // Mock database connection failure
      cy.intercept('GET', '**/rest/v1/**', {
        statusCode: 503,
        body: { error: 'Database temporarily unavailable' }
      }).as('dbFailure');
      
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      // Verify graceful degradation
      cy.get('[data-testid="connection-error-banner"]')
        .should('be.visible')
        .and('contain', 'temporarily unavailable');
      
      cy.get('[data-testid="retry-connection-button"]')
        .should('be.visible');
    });

    it('should handle authentication token expiration', () => {
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      // Mock token expiration
      cy.window().then((win) => {
        win.localStorage.removeItem('supabase.auth.token');
      });
      
      // Try to perform authenticated action
      cy.get('[data-testid="invite-prospect-button"]').click();
      
      // Should redirect to auth page
      cy.url().should('include', '/auth');
      
      // Verify login prompt
      cy.get('[data-testid="session-expired-message"]')
        .should('be.visible');
    });
  });

  describe('Performance and Load Testing', () => {
    it('should handle multiple concurrent invitations', () => {
      const invitations = [
        'concurrent1@example.com',
        'concurrent2@example.com',
        'concurrent3@example.com'
      ];
      
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      // Send multiple invitations rapidly
      invitations.forEach((email, index) => {
        cy.get('[data-testid="invite-prospect-button"]').click();
        cy.get('[data-testid="prospect-email-input"]').clear().type(email);
        cy.get('[data-testid="prospect-first-name-input"]').clear().type(`Concurrent${index + 1}`);
        cy.get('[data-testid="prospect-last-name-input"]').clear().type('Test');
        cy.get('[data-testid="send-invitation-button"]').click();
        
        cy.get('[data-testid="invitation-success-message"]').should('be.visible');
        cy.get('[data-testid="close-modal-button"]').click();
      });
      
      // Verify all invitations were processed
      cy.get('[data-testid="prospects-list"]').within(() => {
        invitations.forEach(email => {
          cy.should('contain', email);
        });
      });
    });

    it('should maintain performance with large datasets', () => {
      // This would require seeding large amounts of test data
      cy.loginAsScenario('senior_advisor');
      
      const startTime = Date.now();
      cy.visit('/advisor-dashboard');
      
      // Wait for page to load with large dataset
      cy.get('[data-testid="dashboard-loaded"]').should('be.visible');
      
      cy.then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(10000); // 10 second threshold
      });
      
      // Verify pagination or virtual scrolling works
      cy.get('[data-testid="clients-list"]').should('be.visible');
      
      // Test search performance
      const searchStart = Date.now();
      cy.get('[data-testid="search-input"]').type('premium');
      cy.get('[data-testid="search-results"]').should('be.visible');
      
      cy.then(() => {
        const searchTime = Date.now() - searchStart;
        expect(searchTime).to.be.lessThan(3000); // 3 second search threshold
      });
    });
  });

  describe('Data Synchronization', () => {
    it('should sync prospect status updates across sessions', () => {
      const prospectEmail = 'sync.test@example.com';
      
      // Advisor 1 invites prospect
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      cy.get('[data-testid="invite-prospect-button"]').click();
      cy.get('[data-testid="prospect-email-input"]').type(prospectEmail);
      cy.get('[data-testid="prospect-first-name-input"]').type('Sync');
      cy.get('[data-testid="prospect-last-name-input"]').type('Test');
      cy.get('[data-testid="send-invitation-button"]').click();
      
      // Verify initial status
      cy.get('[data-testid="prospects-list"]')
        .should('contain', prospectEmail)
        .and('contain', 'Invited');
      
      // Simulate prospect accepting invitation (would trigger status update)
      cy.waitForInviteEmail(prospectEmail).then((emailContent) => {
        cy.extractMagicLinkFromEmail(emailContent).then((magicLink) => {
          cy.completeProspectInviteFlow(magicLink);
          
          // Check that status updated in advisor's view
          cy.loginAsScenario('senior_advisor');
          cy.visit('/advisor-dashboard');
          
          cy.get('[data-testid="prospects-list"]')
            .should('contain', prospectEmail)
            .and('contain', 'Active');
        });
      });
    });

    it('should maintain data consistency during concurrent updates', () => {
      // This test would require more complex setup with multiple browser contexts
      // For now, we'll test sequential updates to the same record
      
      cy.loginAsScenario('tenant_admin');
      cy.visit('/admin-portal/users');
      
      // Get a user record
      cy.get('[data-user-id]').first().then(($el) => {
        const userId = $el.attr('data-user-id');
        
        // Update user role
        cy.get(`[data-user-id="${userId}"] [data-testid="edit-user-button"]`).click();
        cy.get('[data-testid="user-role-select"]').select('senior_advisor');
        cy.get('[data-testid="save-user-button"]').click();
        
        // Verify update persisted
        cy.get(`[data-user-id="${userId}"]`)
          .should('contain', 'Senior Advisor');
        
        // Refresh page and verify consistency
        cy.reload();
        cy.get(`[data-user-id="${userId}"]`)
          .should('contain', 'Senior Advisor');
      });
    });
  });
});
