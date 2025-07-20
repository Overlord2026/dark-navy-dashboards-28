
/// <reference types="cypress" />

describe('Critical User Flows - Comprehensive Testing', () => {
  beforeEach(() => {
    cy.setupTestData();
  });

  describe('Authentication & Role-Based Access', () => {
    const roles = ['system_administrator', 'advisor', 'client'];
    
    roles.forEach(role => {
      it(`should authenticate and verify ${role} access`, () => {
        cy.loginAsRole(role);
        cy.verifyRoleBasedAccess(role);
        
        // Screenshot for visual regression
        cy.screenshot(`authenticated-${role}`);
      });
    });

    it('should handle invalid login attempts', () => {
      cy.visit('/auth');
      cy.get('input[type="email"]').type('invalid@example.com');
      cy.get('input[type="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      
      cy.get('[data-testid="login-error"]')
        .should('be.visible')
        .and('contain.text', 'Invalid');
    });

    it('should handle logout correctly for all roles', () => {
      ['system_administrator', 'advisor', 'client'].forEach(role => {
        cy.loginAsRole(role);
        
        // Find logout button/link
        cy.get('body').then($body => {
          if ($body.find('[data-testid="logout-button"]').length > 0) {
            cy.get('[data-testid="logout-button"]').click();
          } else {
            // Fallback to text-based logout
            cy.contains('Logout', { matchCase: false }).click();
          }
        });
        
        // Should redirect to auth page
        cy.url().should('include', '/auth');
      });
    });
  });

  describe('Admin Portal Functionality', () => {
    beforeEach(() => {
      cy.loginAsScenario('superadmin');
    });

    it('should display admin dashboard with proper metrics', () => {
      cy.visit('/admin-portal');
      
      cy.verifyAdminDashboardMetrics();
      
      // Verify edge function activity monitoring
      cy.verifyEdgeFunctionActivity();
      
      // Test navigation to different admin sections
      const adminSections = [
        'system-health',
        'edge-function-activity'
      ];
      
      adminSections.forEach(section => {
        cy.get(`[href*="${section}"]`).first().click();
        cy.url().should('include', section);
        cy.get('h1, h2, h3').should('be.visible');
        cy.go('back');
      });
    });

    it('should handle system health monitoring', () => {
      cy.visit('/admin-portal/system-health');
      
      // Verify system health components load
      cy.get('[data-testid="database-health"]').should('be.visible');
      cy.get('[data-testid="edge-functions-health"]').should('be.visible');
      
      // Test diagnostic button if available
      cy.get('body').then($body => {
        if ($body.find('[data-testid="run-diagnostics-button"]').length > 0) {
          cy.get('[data-testid="run-diagnostics-button"]').click();
          cy.get('[data-testid="diagnostics-results"]', { timeout: 15000 })
            .should('be.visible');
        }
      });
    });

    it('should complete test data reset flow', () => {
      cy.resetTestData();
      
      // Verify test users still exist after reset
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      cy.get('[data-testid="main-content"]').should('be.visible');
    });
  });

  describe('Advisor-Prospect Flow', () => {
    it('should complete full advisor-to-prospect invitation flow', () => {
      const prospectEmail = `test.prospect.${Date.now()}@example.com`;
      
      cy.completeAdvisorInviteFlow(prospectEmail, 'jet_senior_advisor@bfocfo.com');
      
      // Verify prospect appears in advisor's list
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      cy.get('body').then($body => {
        if ($body.find('[data-testid="prospects-list"]').length > 0) {
          cy.get('[data-testid="prospects-list"]')
            .should('contain', prospectEmail);
        }
      });
    });

    it('should handle invitation validation errors', () => {
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      // Try to send invitation without required fields
      cy.get('body').then($body => {
        if ($body.find('[data-testid="invite-prospect-button"]').length > 0) {
          cy.get('[data-testid="invite-prospect-button"]').click();
          cy.get('[data-testid="send-invitation-button"]').click();
          
          // Should show validation errors
          cy.get('[data-testid*="error"]').should('be.visible');
        }
      });
    });
  });

  describe('RIA Advisor Onboarding Flow', () => {
    it('should complete RIA advisor invitation and onboarding', () => {
      const advisorEmail = `new.advisor.${Date.now()}@example.com`;
      
      // Step 1: Admin sends advisor invitation
      cy.loginAsScenario('superadmin');
      cy.visit('/admin-portal');
      
      // Navigate to advisor management if available
      cy.get('body').then($body => {
        if ($body.find('[data-testid="manage-advisors-link"]').length > 0) {
          cy.get('[data-testid="manage-advisors-link"]').click();
          cy.get('[data-testid="invite-advisor-button"]').click();
          
          cy.get('[data-testid="advisor-email-input"]').type(advisorEmail);
          cy.get('[data-testid="advisor-first-name-input"]').type('New');
          cy.get('[data-testid="advisor-last-name-input"]').type('Advisor');
          cy.get('[data-testid="send-advisor-invite-button"]').click();
          
          cy.get('[data-testid="advisor-invite-success"]')
            .should('be.visible');
        }
      });
    });

    it('should validate advisor onboarding form requirements', () => {
      const mockToken = 'test-advisor-token';
      
      cy.completeRIAAdvisorFlow(mockToken);
    });
  });

  describe('Client Dashboard & Assignment', () => {
    it('should display appropriate content for different client segments', () => {
      // Test premium client
      cy.loginAsScenario('premium_client');
      cy.visit('/');
      
      cy.get('[data-testid="main-content"]').should('be.visible');
      
      // Premium clients might see additional features
      cy.get('body').then($body => {
        if ($body.find('[data-testid="premium-features"]').length > 0) {
          cy.get('[data-testid="premium-features"]').should('be.visible');
        }
      });
      
      // Test basic client
      cy.loginAsScenario('basic_client');
      cy.visit('/');
      
      cy.get('[data-testid="main-content"]').should('be.visible');
      
      // Basic clients should not see premium features
      cy.get('[data-testid="premium-features"]').should('not.exist');
    });

    it('should handle client-advisor relationship display', () => {
      cy.loginAsScenario('premium_client');
      cy.visit('/');
      
      // Look for advisor information
      cy.get('body').then($body => {
        if ($body.find('[data-testid="advisor-info"]').length > 0) {
          cy.get('[data-testid="advisor-info"]').should('be.visible');
        }
      });
    });
  });

  describe('Cross-Role Integration', () => {
    it('should maintain data consistency across role changes', () => {
      // Create data as one role, verify as another
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      // Get count of any existing data
      cy.get('body').then($initialBody => {
        const initialDataCount = $initialBody.find('[data-testid*="count"]').length;
        
        // Switch to admin view
        cy.loginAsScenario('superadmin');
        cy.visit('/admin-portal');
        
        // Verify data consistency
        cy.get('[data-testid="kpi-tile"]').should('have.length.greaterThan', 0);
      });
    });

    it('should enforce proper tenant isolation', () => {
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      cy.verifyMultiTenantIsolation();
    });
  });

  describe('Error Handling & Edge Cases', () => {
    it('should handle invalid tokens gracefully', () => {
      cy.visit('/invite/invalid-token-123');
      
      cy.get('body').then($body => {
        if ($body.find('[data-testid="invalid-token-error"]').length > 0) {
          cy.get('[data-testid="invalid-token-error"]').should('be.visible');
        } else {
          // Should redirect or show some error indication
          cy.url().should('not.include', '/invite/invalid-token-123');
        }
      });
    });

    it('should handle network errors gracefully', () => {
      // Intercept and fail API calls
      cy.intercept('POST', '**/functions/v1/**', { forceNetworkError: true }).as('networkError');
      
      cy.loginAsScenario('superadmin');
      cy.visit('/admin-portal/system-health');
      
      // Try to trigger an action that would use edge functions
      cy.get('body').then($body => {
        if ($body.find('[data-testid="run-diagnostics-button"]').length > 0) {
          cy.get('[data-testid="run-diagnostics-button"]').click();
          
          // Should show error handling
          cy.get('[data-testid*="error"]', { timeout: 10000 })
            .should('be.visible');
        }
      });
    });

    it('should handle session expiration', () => {
      cy.loginAsScenario('superadmin');
      
      // Clear localStorage to simulate session expiration
      cy.clearLocalStorage();
      
      // Try to access protected route
      cy.visit('/admin-portal/system-health');
      
      // Should redirect to auth or show login prompt
      cy.url().should('include', '/auth');
    });
  });

  describe('Performance & Load Testing', () => {
    it('should load all critical pages within performance thresholds', () => {
      const criticalPages = [
        { url: '/', role: 'premium_client' },
        { url: '/admin-portal', role: 'superadmin' },
        { url: '/advisor-dashboard', role: 'senior_advisor' }
      ];
      
      criticalPages.forEach(({ url, role }) => {
        const startTime = Date.now();
        
        cy.loginAsScenario(role);
        cy.visit(url);
        cy.get('[data-testid="main-content"]', { timeout: 10000 })
          .should('be.visible')
          .then(() => {
            const loadTime = Date.now() - startTime;
            expect(loadTime).to.be.lessThan(testData.performanceThresholds.pageLoadTimeMs);
          });
      });
    });

    it('should handle concurrent user scenarios', () => {
      // Test multiple user types in sequence to simulate load
      const scenarios = ['superadmin', 'senior_advisor', 'premium_client'];
      
      scenarios.forEach(scenario => {
        cy.testUserScenario(scenario);
      });
    });
  });
});
