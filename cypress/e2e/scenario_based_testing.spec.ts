describe('Comprehensive Scenario-Based E2E Testing', () => {
  beforeEach(() => {
    cy.setupTestData();
  });

  // Test all user scenarios systematically
  const allScenarios: TestUserScenario[] = [
    'superadmin', 'readonly_admin', 'tenant_admin',
    'senior_advisor', 'junior_advisor', 'referral_advisor', 'recruiting_advisor',
    'new_client', 'premium_client', 'basic_client', 'inactive_client', 'trial_client'
  ];

  describe('User Authentication & Role Verification', () => {
    allScenarios.forEach((scenario) => {
      it(`should authenticate and verify ${scenario} user`, () => {
        cy.testUserScenario(scenario);
        cy.screenshot(`authenticated-${scenario}`);
      });
    });
  });

  describe('Permission-Based Access Control', () => {
    it('should allow superadmin full system access', () => {
      cy.loginAsScenario('superadmin');
      cy.visit('/admin-portal');
      cy.get('[data-testid="system-health"]').should('be.visible');
      cy.get('[data-testid="user-management"]').should('be.visible');
      cy.get('[data-testid="kpi-dashboard"]').should('be.visible');
    });

    it('should restrict readonly admin permissions', () => {
      cy.loginAsScenario('readonly_admin');
      cy.visit('/admin-portal');
      cy.get('[data-testid="system-health"]').should('be.visible');
      // Should not see user management or write operations
      cy.get('[data-testid="user-management"]').should('not.exist');
    });

    it('should allow senior advisor full client management', () => {
      cy.loginAsScenario('senior_advisor');
      cy.visit('/');
      cy.get('[data-testid="client-list"]').should('be.visible');
      cy.get('[data-testid="add-client-btn"]').should('be.visible');
      cy.get('[data-testid="portfolio-management"]').should('be.visible');
    });

    it('should restrict junior advisor permissions', () => {
      cy.loginAsScenario('junior_advisor');
      cy.visit('/');
      cy.get('[data-testid="client-list"]').should('be.visible');
      // Should not see add client or full portfolio management
      cy.get('[data-testid="add-client-btn"]').should('not.exist');
    });

    it('should show appropriate client dashboard for premium client', () => {
      cy.loginAsScenario('premium_client');
      cy.visit('/');
      cy.get('[data-testid="premium-features"]').should('be.visible');
      cy.get('[data-testid="health-premium"]').should('be.visible');
      cy.get('[data-testid="portfolio-view"]').should('be.visible');
    });

    it('should show limited features for basic client', () => {
      cy.loginAsScenario('basic_client');
      cy.visit('/');
      cy.get('[data-testid="basic-features"]').should('be.visible');
      // Should not see premium features
      cy.get('[data-testid="premium-features"]').should('not.exist');
      cy.get('[data-testid="health-premium"]').should('not.exist');
    });
  });

  describe('Client Lifecycle & Onboarding', () => {
    it('should show onboarding flow for new client', () => {
      cy.loginAsScenario('new_client');
      cy.visit('/');
      cy.get('[data-testid="onboarding-wizard"]').should('be.visible');
      cy.get('[data-testid="prospect-status"]').should('contain.text', 'prospect');
    });

    it('should show trial limitations for trial client', () => {
      cy.loginAsScenario('trial_client');
      cy.visit('/');
      cy.get('[data-testid="trial-banner"]').should('be.visible');
      cy.get('[data-testid="upgrade-prompt"]').should('be.visible');
    });

    it('should show reactivation flow for inactive client', () => {
      cy.loginAsScenario('inactive_client');
      cy.visit('/');
      cy.get('[data-testid="reactivation-notice"]').should('be.visible');
      cy.get('[data-testid="contact-advisor"]').should('be.visible');
    });
  });

  describe('Advisor-Client Relationships', () => {
    it('should show advisor their assigned clients', () => {
      cy.loginAsScenario('senior_advisor');
      cy.visit('/clients');
      
      // Should see their assigned clients
      cy.get('[data-testid="client-card"]').should('have.length.at.least', 3);
      cy.get('[data-testid="client-card"]').should('contain.text', 'Jet Premium');
      cy.get('[data-testid="client-card"]').should('contain.text', 'Jet New');
    });

    it('should allow advisor to view client portfolio', () => {
      cy.loginAsScenario('senior_advisor');
      cy.visit('/clients');
      cy.get('[data-testid="client-card"]').first().click();
      cy.get('[data-testid="portfolio-details"]').should('be.visible');
      cy.get('[data-testid="fee-analysis"]').should('be.visible');
    });
  });

  describe('Referral System Testing', () => {
    it('should allow referral advisor to create referrals', () => {
      cy.loginAsScenario('referral_advisor');
      cy.visit('/referrals');
      cy.get('[data-testid="create-referral-btn"]').should('be.visible');
      cy.get('[data-testid="referral-dashboard"]').should('be.visible');
      cy.get('[data-testid="commission-tracker"]').should('be.visible');
    });

    it('should show recruiting dashboard for recruiting advisor', () => {
      cy.loginAsScenario('recruiting_advisor');
      cy.visit('/team');
      cy.get('[data-testid="recruiting-dashboard"]').should('be.visible');
      cy.get('[data-testid="advisor-recruitment"]').should('be.visible');
      cy.get('[data-testid="team-management"]').should('be.visible');
    });
  });

  describe('Data Integrity & Performance', () => {
    it('should load all user types within performance thresholds', () => {
      allScenarios.forEach((scenario) => {
        const startTime = Date.now();
        cy.loginAsScenario(scenario);
        cy.visit('/');
        cy.get('[data-testid="main-content"]').should('be.visible');
        
        cy.then(() => {
          const loadTime = Date.now() - startTime;
          expect(loadTime).to.be.lessThan(5000); // 5 second threshold
        });
      });
    });

    it('should verify test data relationships', () => {
      cy.loginAsScenario('senior_advisor');
      cy.visit('/clients');
      
      // Verify advisor sees their assigned clients
      cy.get('[data-testid="client-count"]').should('contain.text', '4'); // Should see 4 assigned clients
      
      // Verify client segments are displayed correctly
      cy.get('[data-testid="premium-client-badge"]').should('be.visible');
      cy.get('[data-testid="basic-client-badge"]').should('be.visible');
    });
  });

  describe('Cross-User Integration Testing', () => {
    it('should test advisor-client communication flow', () => {
      // First as advisor: send message to client
      cy.loginAsScenario('senior_advisor');
      cy.visit('/clients');
      cy.get('[data-testid="client-card"]').first().click();
      cy.get('[data-testid="send-message-btn"]').click();
      cy.get('[data-testid="message-input"]').type('Test message from advisor');
      cy.get('[data-testid="send-btn"]').click();
      
      // Then as client: verify message received
      cy.loginAsScenario('premium_client');
      cy.visit('/messages');
      cy.get('[data-testid="message-item"]').should('contain.text', 'Test message from advisor');
    });

    it('should test multi-tenant isolation', () => {
      cy.loginAsScenario('tenant_admin');
      cy.visit('/admin-portal');
      
      // Verify tenant admin only sees their tenant data
      cy.get('[data-testid="tenant-users"]').should('be.visible');
      cy.get('[data-testid="tenant-data"]').should('not.contain.text', 'other-tenant');
    });
  });

  describe('Error Handling & Edge Cases', () => {
    it('should handle inactive user login gracefully', () => {
      cy.loginAsScenario('inactive_client');
      cy.visit('/restricted-page');
      cy.get('[data-testid="access-denied"]').should('be.visible');
      cy.get('[data-testid="contact-support"]').should('be.visible');
    });

    it('should handle permission escalation attempts', () => {
      cy.loginAsScenario('basic_client');
      cy.request({
        url: '/api/admin/users',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403); // Forbidden
      });
    });
  });
});

// Type declaration for the test scenarios
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