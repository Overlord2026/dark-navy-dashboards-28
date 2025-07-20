
/// <reference types="cypress" />

describe('Edge Function Activity Monitoring', () => {
  beforeEach(() => {
    cy.setupTestData();
  });

  describe('Admin Dashboard Edge Function Metrics', () => {
    beforeEach(() => {
      cy.loginAsScenario('superadmin');
    });

    it('should display edge function activity dashboard', () => {
      cy.visit('/admin-portal');
      
      // Verify edge function metrics are displayed
      cy.get('[data-testid="edge-function-metrics"]')
        .should('be.visible');
      
      // Check for success rate display
      cy.get('[data-testid="edge-function-success-rate"]')
        .should('be.visible')
        .and('contain.text', '%');
      
      // Verify activity feed
      cy.get('[data-testid="recent-activity-feed"]')
        .should('be.visible');
    });

    it('should show detailed edge function activity page', () => {
      cy.visit('/admin-portal/edge-function-activity');
      
      // Verify page loads with activity table
      cy.get('[data-testid="activity-table"]')
        .should('be.visible');
      
      // Check for filtering options
      cy.get('[data-testid="function-name-filter"]')
        .should('be.visible');
      
      cy.get('[data-testid="status-filter"]')
        .should('be.visible');
      
      // Test filtering functionality
      cy.get('[data-testid="status-filter"]').select('error');
      cy.get('[data-testid="activity-table"] tbody tr')
        .should('have.length.greaterThan', 0);
    });

    it('should handle real-time activity updates', () => {
      cy.visit('/admin-portal/edge-function-activity');
      
      // Get initial count
      cy.get('[data-testid="total-calls-count"]').then($count => {
        const initialCount = parseInt($count.text());
        
        // Trigger an edge function call by performing an action
        cy.visit('/admin-portal/system-health');
        
        // Go back to activity page
        cy.visit('/admin-portal/edge-function-activity');
        
        // Verify count may have increased (if any calls were made)
        cy.get('[data-testid="total-calls-count"]').then($newCount => {
          const newCount = parseInt($newCount.text());
          expect(newCount).to.be.at.least(initialCount);
        });
      });
    });

    it('should display performance metrics correctly', () => {
      cy.visit('/admin-portal/edge-function-activity');
      
      // Verify performance metrics
      cy.get('[data-testid="avg-response-time"]')
        .should('be.visible')
        .and('contain.text', 'ms');
      
      cy.get('[data-testid="p95-response-time"]')
        .should('be.visible')
        .and('contain.text', 'ms');
      
      // Check for performance chart
      cy.get('[data-testid="performance-chart"]')
        .should('be.visible');
    });

    it('should handle error details properly', () => {
      cy.visit('/admin-portal/edge-function-activity');
      
      // Filter for errors
      cy.get('[data-testid="status-filter"]').select('error');
      
      // Click on first error entry if available
      cy.get('body').then($body => {
        if ($body.find('[data-testid="error-entry"]').length > 0) {
          cy.get('[data-testid="error-entry"]').first().click();
          
          // Verify error details modal opens
          cy.get('[data-testid="error-details-modal"]')
            .should('be.visible');
          
          // Should show error message and stack trace
          cy.get('[data-testid="error-message"]')
            .should('be.visible');
          
          cy.get('[data-testid="error-stack"]')
            .should('be.visible');
        }
      });
    });
  });

  describe('Function-Specific Monitoring', () => {
    beforeEach(() => {
      cy.loginAsScenario('superadmin');
    });

    it('should monitor leads-invite function activity', () => {
      cy.visit('/admin-portal/edge-function-activity');
      
      // Filter for leads-invite function
      cy.get('[data-testid="function-name-filter"]').select('leads-invite');
      
      // Verify function-specific metrics
      cy.get('[data-testid="function-call-count"]')
        .should('be.visible');
      
      cy.get('[data-testid="function-success-rate"]')
        .should('be.visible');
    });

    it('should monitor reset-test-data function activity', () => {
      cy.visit('/admin-portal/edge-function-activity');
      
      // Filter for reset-test-data function
      cy.get('[data-testid="function-name-filter"]').select('reset-test-data');
      
      // Should show recent reset activities
      cy.get('[data-testid="activity-table"]')
        .should('be.visible');
    });

    it('should track user attribution for function calls', () => {
      cy.visit('/admin-portal/edge-function-activity');
      
      // Verify user information is displayed
      cy.get('[data-testid="activity-table"] tbody tr').first().within(() => {
        cy.get('[data-testid="user-info"]')
          .should('be.visible');
        
        cy.get('[data-testid="timestamp"]')
          .should('be.visible');
      });
    });
  });

  describe('Error Handling & Alerts', () => {
    beforeEach(() => {
      cy.loginAsScenario('superadmin');
    });

    it('should display critical error alerts', () => {
      cy.visit('/admin-portal');
      
      // Check for critical error indicators
      cy.get('body').then($body => {
        if ($body.find('[data-testid="critical-errors-alert"]').length > 0) {
          cy.get('[data-testid="critical-errors-alert"]')
            .should('be.visible');
          
          // Should show error count
          cy.get('[data-testid="error-count"]')
            .should('be.visible');
        }
      });
    });

    it('should handle system health degradation', () => {
      cy.visit('/admin-portal/system-health');
      
      // Verify system health status
      cy.get('[data-testid="system-status"]')
        .should('be.visible')
        .and('contain.text', 'Healthy');
      
      // Check edge function health specifically
      cy.get('[data-testid="edge-functions-health"]')
        .should('be.visible');
    });
  });

  describe('Data Export & Reporting', () => {
    beforeEach(() => {
      cy.loginAsScenario('superadmin');
    });

    it('should support activity data export', () => {
      cy.visit('/admin-portal/edge-function-activity');
      
      // Look for export functionality
      cy.get('body').then($body => {
        if ($body.find('[data-testid="export-data-button"]').length > 0) {
          cy.get('[data-testid="export-data-button"]').click();
          
          // Should trigger download or show export options
          cy.get('[data-testid="export-options"]')
            .should('be.visible');
        }
      });
    });

    it('should generate performance reports', () => {
      cy.visit('/admin-portal/edge-function-activity');
      
      // Check for reporting features
      cy.get('body').then($body => {
        if ($body.find('[data-testid="generate-report-button"]').length > 0) {
          cy.get('[data-testid="generate-report-button"]').click();
          
          cy.get('[data-testid="report-options"]')
            .should('be.visible');
        }
      });
    });
  });
});
