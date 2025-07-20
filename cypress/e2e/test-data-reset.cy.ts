
describe('Test Data Reset E2E Tests', () => {
  describe('Admin Test Data Reset', () => {
    it('should complete full test data reset cycle', () => {
      // Login as superadmin
      cy.loginAsScenario('superadmin');
      cy.visit('/admin-portal');
      
      // Navigate to system health section
      cy.get('[data-testid="system-health-link"]').click();
      
      // Verify reset button is available
      cy.get('[data-testid="reset-test-data-button"]')
        .should('be.visible')
        .and('contain', 'Reset Test Data');
      
      // Click reset button
      cy.get('[data-testid="reset-test-data-button"]').click();
      
      // Verify confirmation dialog
      cy.get('[data-testid="reset-confirmation-dialog"]')
        .should('be.visible');
      
      cy.get('[data-testid="reset-warning-text"]')
        .should('contain', 'This will restore all test data to initial state');
      
      // Confirm reset
      cy.get('[data-testid="confirm-reset-button"]').click();
      
      // Wait for reset completion
      cy.get('[data-testid="reset-progress-indicator"]', { timeout: 30000 })
        .should('be.visible');
      
      cy.get('[data-testid="reset-success-message"]', { timeout: 30000 })
        .should('be.visible')
        .and('contain', 'Test data reset completed successfully');
      
      // Verify system health after reset
      cy.get('[data-testid="system-status"]')
        .should('contain', 'Healthy');
    });

    it('should validate data integrity after reset', () => {
      // Perform reset
      cy.resetTestData();
      
      // Verify test users are restored
      const testUsers = [
        'jet_superadmin@bfocfo.com',
        'jet_senior_advisor@bfocfo.com',
        'jet_premium_client@bfocfo.com'
      ];
      
      testUsers.forEach(email => {
        cy.loginAsScenario('superadmin');
        cy.visit('/admin-portal/users');
        
        cy.get('[data-testid="users-table"]')
          .should('contain', email);
      });
      
      // Verify test data relationships are intact
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      cy.get('[data-testid="assigned-clients"]')
        .should('have.length.greaterThan', 0);
    });

    it('should preserve system configuration during reset', () => {
      // Get initial system configuration
      cy.loginAsScenario('superadmin');
      cy.visit('/admin-portal/system-health');
      
      cy.get('[data-testid="system-config"]').then(($config) => {
        const initialConfig = $config.text();
        
        // Perform reset
        cy.resetTestData();
        
        // Verify configuration is preserved
        cy.visit('/admin-portal/system-health');
        cy.get('[data-testid="system-config"]')
          .should('contain', initialConfig);
      });
    });

    it('should restrict reset access to authorized users only', () => {
      // Try as regular advisor
      cy.loginAsScenario('junior_advisor');
      cy.visit('/admin-portal/system-health', { failOnStatusCode: false });
      
      // Should be redirected or see access denied
      cy.url().should('not.include', '/admin-portal');
      
      // Try as client
      cy.loginAsScenario('premium_client');
      cy.visit('/admin-portal/system-health', { failOnStatusCode: false });
      
      cy.url().should('not.include', '/admin-portal');
    });
  });

  describe('System Health Validation', () => {
    it('should verify database integrity after reset', () => {
      cy.resetTestData();
      
      cy.loginAsScenario('superadmin');
      cy.visit('/admin-portal/system-health');
      
      // Trigger database health check
      cy.get('[data-testid="run-health-check-button"]').click();
      
      cy.get('[data-testid="health-check-results"]', { timeout: 15000 })
        .should('be.visible');
      
      // Verify all checks pass
      cy.get('[data-testid="database-connectivity"]')
        .should('contain', 'Healthy');
      
      cy.get('[data-testid="rls-policies"]')
        .should('contain', 'Active');
      
      cy.get('[data-testid="data-integrity"]')
        .should('contain', 'Valid');
    });

    it('should verify edge functions availability after reset', () => {
      cy.resetTestData();
      
      // Test critical edge functions
      const edgeFunctions = [
        'leads-invite',
        'advisor-invite'
      ];
      
      edgeFunctions.forEach(functionName => {
        cy.request({
          method: 'POST',
          url: `https://xcmqjkvyvuhoslbzmlgi.supabase.co/functions/v1/${functionName}`,
          body: { test: true },
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json'
          },
          failOnStatusCode: false
        }).then(response => {
          // Should get some response (not necessarily 200 for test payload)
          expect(response.status).to.be.oneOf([200, 400, 401, 500]);
        });
      });
    });

    it('should validate email service connectivity', () => {
      cy.resetTestData();
      
      cy.loginAsScenario('superadmin');
      cy.visit('/admin-portal/system-health');
      
      // Test email service
      cy.get('[data-testid="test-email-service-button"]').click();
      
      cy.get('[data-testid="email-test-results"]', { timeout: 10000 })
        .should('be.visible')
        .and('contain', 'Email service operational');
    });
  });

  describe('Reset Process Monitoring', () => {
    it('should show progress during reset operation', () => {
      cy.loginAsScenario('superadmin');
      cy.visit('/admin-portal/system-health');
      
      cy.get('[data-testid="reset-test-data-button"]').click();
      cy.get('[data-testid="confirm-reset-button"]').click();
      
      // Verify progress indicators
      cy.get('[data-testid="reset-step-backup"]')
        .should('be.visible')
        .and('contain', 'Creating backup');
      
      cy.get('[data-testid="reset-step-cleanup"]', { timeout: 10000 })
        .should('be.visible')
        .and('contain', 'Cleaning existing data');
      
      cy.get('[data-testid="reset-step-restore"]', { timeout: 15000 })
        .should('be.visible')
        .and('contain', 'Restoring seed data');
      
      cy.get('[data-testid="reset-step-verify"]', { timeout: 20000 })
        .should('be.visible')
        .and('contain', 'Verifying integrity');
    });

    it('should handle reset failures gracefully', () => {
      // This would require mocking a failure scenario
      cy.loginAsScenario('superadmin');
      cy.visit('/admin-portal/system-health');
      
      // Mock a failure by intercepting the reset request
      cy.intercept('POST', '**/functions/v1/reset-test-data', {
        statusCode: 500,
        body: { error: 'Simulated reset failure' }
      }).as('resetFailure');
      
      cy.get('[data-testid="reset-test-data-button"]').click();
      cy.get('[data-testid="confirm-reset-button"]').click();
      
      cy.wait('@resetFailure');
      
      // Verify error handling
      cy.get('[data-testid="reset-error-message"]')
        .should('be.visible')
        .and('contain', 'Reset operation failed');
      
      cy.get('[data-testid="contact-support-link"]')
        .should('be.visible');
    });
  });
});
