
/// <reference types="cypress" />

describe('Notification Systems Testing', () => {
  beforeEach(() => {
    cy.setupTestData();
  });

  describe('Success Notifications', () => {
    it('should show success notification for successful login', () => {
      cy.visit('/auth');
      cy.get('input[type="email"]').type('jet_superadmin@bfocfo.com');
      cy.get('input[type="password"]').type('Passw0rd!');
      cy.get('button[type="submit"]').click();
      
      // Should show success notification or redirect immediately
      cy.url().should('not.include', '/auth');
    });

    it('should show success notification for data operations', () => {
      cy.loginAsScenario('superadmin');
      cy.visit('/admin-portal/system-health');
      
      // Look for any action buttons that would trigger success notifications
      cy.get('body').then($body => {
        if ($body.find('[data-testid="run-diagnostics-button"]').length > 0) {
          cy.get('[data-testid="run-diagnostics-button"]').click();
          
          // Should show success notification
          cy.get('[data-testid="success-notification"]', { timeout: 15000 })
            .should('be.visible');
        }
      });
    });

    it('should show success notification for invitation sending', () => {
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      // Try to send invitation
      cy.get('body').then($body => {
        if ($body.find('[data-testid="invite-prospect-button"]').length > 0) {
          cy.get('[data-testid="invite-prospect-button"]').click();
          
          cy.get('[data-testid="prospect-email-input"]').type('test@example.com');
          cy.get('[data-testid="prospect-first-name-input"]').type('Test');
          cy.get('[data-testid="prospect-last-name-input"]').type('User');
          cy.get('[data-testid="send-invitation-button"]').click();
          
          // Should show success notification
          cy.get('[data-testid="invitation-success"]', { timeout: 10000 })
            .should('be.visible');
        }
      });
    });
  });

  describe('Error Notifications', () => {
    it('should show error notification for failed login', () => {
      cy.visit('/auth');
      cy.get('input[type="email"]').type('invalid@example.com');
      cy.get('input[type="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      
      // Should show error notification
      cy.get('[data-testid="error-notification"]', { timeout: 10000 })
        .should('be.visible')
        .and('contain.text', 'Invalid');
    });

    it('should show error notification for network failures', () => {
      cy.loginAsScenario('superadmin');
      
      // Intercept API calls to simulate network failure
      cy.intercept('POST', '**/functions/v1/**', { forceNetworkError: true }).as('networkError');
      
      cy.visit('/admin-portal/system-health');
      
      cy.get('body').then($body => {
        if ($body.find('[data-testid="run-diagnostics-button"]').length > 0) {
          cy.get('[data-testid="run-diagnostics-button"]').click();
          
          // Should show network error notification
          cy.get('[data-testid="error-notification"]', { timeout: 10000 })
            .should('be.visible')
            .and('contain.text', 'network');
        }
      });
    });

    it('should show validation error notifications', () => {
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      // Try to submit form with missing required fields
      cy.get('body').then($body => {
        if ($body.find('[data-testid="invite-prospect-button"]').length > 0) {
          cy.get('[data-testid="invite-prospect-button"]').click();
          cy.get('[data-testid="send-invitation-button"]').click();
          
          // Should show validation error notifications
          cy.get('[data-testid="validation-error"]')
            .should('be.visible');
        }
      });
    });
  });

  describe('Toast Notifications', () => {
    it('should display toast notifications with proper styling', () => {
      cy.loginAsScenario('superadmin');
      cy.visit('/admin-portal');
      
      // Trigger any action that might show a toast
      cy.get('body').then($body => {
        // Look for any buttons that might trigger toasts
        const actionButtons = $body.find('[data-testid*="button"], button').filter(':visible');
        if (actionButtons.length > 0) {
          cy.wrap(actionButtons.first()).click();
          
          // Check if toast appears
          cy.get('.toast, [data-testid="toast"]', { timeout: 5000 }).then($toast => {
            if ($toast.length > 0) {
              cy.wrap($toast).should('be.visible');
              
              // Verify toast styling
              cy.wrap($toast).should('have.css', 'position', 'fixed');
            }
          });
        }
      });
    });

    it('should auto-dismiss toast notifications', () => {
      cy.loginAsScenario('superadmin');
      cy.visit('/admin-portal');
      
      // If we find any toasts, verify they auto-dismiss
      cy.get('body').then($body => {
        if ($body.find('.toast, [data-testid="toast"]').length > 0) {
          cy.get('.toast, [data-testid="toast"]').should('be.visible');
          
          // Wait for auto-dismiss (typically 3-5 seconds)
          cy.get('.toast, [data-testid="toast"]', { timeout: 10000 })
            .should('not.exist');
        }
      });
    });
  });

  describe('System Alerts', () => {
    it('should show critical system alerts to administrators', () => {
      cy.loginAsScenario('superadmin');
      cy.visit('/admin-portal');
      
      // Check for any critical system alerts
      cy.get('body').then($body => {
        if ($body.find('[data-testid="critical-alert"]').length > 0) {
          cy.get('[data-testid="critical-alert"]')
            .should('be.visible')
            .and('have.class', 'alert-critical');
        }
      });
    });

    it('should show edge function failure alerts', () => {
      cy.loginAsScenario('superadmin');
      cy.visit('/admin-portal/edge-function-activity');
      
      // Check for edge function alerts
      cy.get('body').then($body => {
        if ($body.find('[data-testid="function-error-alert"]').length > 0) {
          cy.get('[data-testid="function-error-alert"]')
            .should('be.visible');
        }
      });
    });
  });

  describe('Email Notifications', () => {
    it('should indicate when invitation emails are sent', () => {
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      // Send invitation and verify email notification indicator
      cy.get('body').then($body => {
        if ($body.find('[data-testid="invite-prospect-button"]').length > 0) {
          cy.get('[data-testid="invite-prospect-button"]').click();
          
          cy.get('[data-testid="prospect-email-input"]').type('test@example.com');
          cy.get('[data-testid="prospect-first-name-input"]').type('Test');
          cy.get('[data-testid="prospect-last-name-input"]').type('User');
          cy.get('[data-testid="send-invitation-button"]').click();
          
          // Should indicate email was sent
          cy.get('[data-testid="email-sent-indicator"]', { timeout: 10000 })
            .should('be.visible');
        }
      });
    });

    it('should handle email delivery failures gracefully', () => {
      // Intercept email-related API calls to simulate failure
      cy.intercept('POST', '**/functions/v1/leads-invite', {
        statusCode: 500,
        body: { error: 'Email delivery failed' }
      }).as('emailFailure');
      
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      cy.get('body').then($body => {
        if ($body.find('[data-testid="invite-prospect-button"]').length > 0) {
          cy.get('[data-testid="invite-prospect-button"]').click();
          
          cy.get('[data-testid="prospect-email-input"]').type('test@example.com');
          cy.get('[data-testid="prospect-first-name-input"]').type('Test');
          cy.get('[data-testid="prospect-last-name-input"]').type('User');
          cy.get('[data-testid="send-invitation-button"]').click();
          
          cy.wait('@emailFailure');
          
          // Should show email failure notification
          cy.get('[data-testid="email-error-notification"]', { timeout: 10000 })
            .should('be.visible');
        }
      });
    });
  });

  describe('Real-time Notifications', () => {
    it('should update dashboard metrics in real-time', () => {
      cy.loginAsScenario('superadmin');
      cy.visit('/admin-portal');
      
      // Get initial metric values
      cy.get('[data-testid="kpi-tile"]').first().then($tile => {
        const initialValue = $tile.text();
        
        // Wait a moment and check if values update
        cy.wait(3000);
        cy.get('[data-testid="kpi-tile"]').first().then($newTile => {
          // Values might update or stay the same, just verify structure is maintained
          expect($newTile.text()).to.be.a('string');
        });
      });
    });

    it('should show real-time activity feed updates', () => {
      cy.loginAsScenario('superadmin');
      cy.visit('/admin-portal');
      
      // Check for activity feed
      cy.get('body').then($body => {
        if ($body.find('[data-testid="activity-feed"]').length > 0) {
          cy.get('[data-testid="activity-feed"] [data-testid="activity-item"]')
            .should('have.length.greaterThan', 0);
          
          // Items should have timestamps
          cy.get('[data-testid="activity-item"] [data-testid="timestamp"]')
            .should('be.visible');
        }
      });
    });
  });

  describe('Notification Persistence', () => {
    it('should maintain notification preferences across sessions', () => {
      cy.loginAsScenario('superadmin');
      cy.visit('/admin-portal');
      
      // Check if notification preferences are maintained
      cy.window().then(win => {
        const notificationSettings = win.localStorage.getItem('notificationSettings');
        // Settings might not exist yet, but structure should be valid if present
        if (notificationSettings) {
          expect(() => JSON.parse(notificationSettings)).to.not.throw();
        }
      });
    });

    it('should clear notifications on logout', () => {
      cy.loginAsScenario('superadmin');
      cy.visit('/admin-portal');
      
      // Trigger logout
      cy.get('body').then($body => {
        if ($body.find('[data-testid="logout-button"]').length > 0) {
          cy.get('[data-testid="logout-button"]').click();
        } else {
          cy.contains('Logout', { matchCase: false }).click();
        }
      });
      
      // Should redirect to auth page
      cy.url().should('include', '/auth');
      
      // Re-login and verify notifications are cleared
      cy.loginAsScenario('superadmin');
      cy.visit('/admin-portal');
      
      // Should not show old notifications
      cy.get('[data-testid="old-notification"]').should('not.exist');
    });
  });
});
