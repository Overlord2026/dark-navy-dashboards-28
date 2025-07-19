/// <reference types="cypress" />

describe('Full Navigation & UI Regression Test Suite', () => {
  const roles = ['system_administrator', 'advisor', 'client'] as const;

  // Navigation structure for testing
  const navigationItems = {
    system_administrator: [
      { path: '/admin-portal', label: 'Dashboard', hasSubItems: false },
      { path: '/admin-portal/users', label: 'Users & Advisors', hasSubItems: false },
      { path: '/admin-portal/clients', label: 'Clients & Prospects', hasSubItems: false },
      { path: '/admin-portal/tenants', label: 'Tenants', hasSubItems: false },
      { path: '/admin-portal/health', label: 'Health & LTC Module', hasSubItems: false },
      { path: '/admin-portal/billing', label: 'Billing & Licensing', hasSubItems: false },
      { path: '/admin-portal/referrals', label: 'Referrals & Overrides', hasSubItems: false },
      { path: '/admin-portal/compliance', label: 'Compliance & Audit', hasSubItems: false },
      { path: '/admin-portal/system-health', label: 'System Diagnostics', hasSubItems: false },
    ],
    advisor: [
      { path: '/admin-portal', label: 'Dashboard', hasSubItems: false },
      { path: '/admin-portal/clients', label: 'Clients & Prospects', hasSubItems: false },
      { path: '/admin-portal/referrals', label: 'Referrals & Overrides', hasSubItems: false },
    ],
    client: [
      { path: '/', label: 'Home', hasSubItems: false },
      // Add client-specific navigation items
    ]
  };

  roles.forEach(role => {
    context(`Role: ${role}`, () => {
      beforeEach(() => {
        cy.loginAs(role);
      });

      it('should load home page successfully', () => {
        cy.visit('/');
        cy.get('body').should('be.visible');
        
        // Verify user role is displayed correctly
        if (role !== 'client') {
          cy.contains(role.replace('_', ' '), { matchCase: false }).should('be.visible');
        }
      });

      it('should navigate to all accessible routes and verify page loads', () => {
        const navItems = navigationItems[role] || [];
        
        navItems.forEach(item => {
          cy.visit(item.path);
          cy.url().should('include', item.path);
          
          // Verify page has loaded with content
          cy.get('h1, h2, h3').first().should('be.visible');
          
          // Verify no error states
          cy.get('body').should('not.contain', 'Error');
          cy.get('body').should('not.contain', '404');
          
          // Take screenshot for visual regression
          cy.screenshot(`${role}-${item.path.replace(/\//g, '-')}`);
        });
      });

      if (role === 'system_administrator') {
        it('should verify admin-specific functionality', () => {
          // Test KPI tiles load with data
          cy.visit('/admin-portal');
          cy.get('[data-testid="kpi-tile"], .dashboard-card').should('have.length.greaterThan', 0);
          
          // Test system health page
          cy.visit('/admin-portal/system-health');
          cy.contains('Database Health').should('be.visible');
          cy.contains('Edge Functions').should('be.visible');
          cy.contains('Storage & Backups').should('be.visible');
          
          // Test diagnostic button
          cy.contains('Run Full System Diagnostics').should('be.visible');
          
          // Test accordion functionality
          cy.get('[data-state="closed"]').first().click();
          cy.get('[data-state="open"]').should('exist');
        });

        it('should verify admin portal navigation', () => {
          cy.visit('/admin-portal');
          
          // Test sidebar navigation
          const adminNavItems = [
            'Dashboard',
            'Users & Advisors', 
            'Clients & Prospects',
            'Health & LTC Module',
            'Billing & Licensing',
            'Referrals & Overrides',
            'Compliance & Audit',
            'System Diagnostics'
          ];
          
          adminNavItems.forEach(navItem => {
            cy.contains(navItem).should('be.visible');
          });
        });
      }

      if (role === 'advisor') {
        it('should verify advisor-specific functionality', () => {
          cy.visit('/admin-portal');
          
          // Verify advisor has limited admin access
          cy.contains('Dashboard').should('be.visible');
          cy.contains('Clients & Prospects').should('be.visible');
          cy.contains('Referrals & Overrides').should('be.visible');
          
          // Verify advisor cannot access system admin features
          cy.get('body').should('not.contain', 'System Diagnostics');
          cy.get('body').should('not.contain', 'Tenants');
        });
      }

      if (role === 'client') {
        it('should verify client cannot access admin areas', () => {
          // Attempt to visit admin portal - should be redirected
          cy.visit('/admin-portal', { failOnStatusCode: false });
          cy.url().should('not.include', '/admin-portal');
          
          // Verify no admin navigation is visible
          cy.get('body').should('not.contain', 'Admin Portal');
          cy.get('body').should('not.contain', 'System Diagnostics');
        });
      }

      it('should verify critical UI components load without errors', () => {
        cy.visit('/');
        
        // Check for JavaScript errors
        cy.window().then((win) => {
          expect(win.console.error).to.not.have.been.called;
        });
        
        // Verify header loads
        cy.get('header').should('be.visible');
        
        // Verify navigation loads
        cy.get('nav, [role="navigation"]').should('exist');
        
        // Verify main content area loads
        cy.get('main, [role="main"], .main-content').should('exist');
      });

      it('should verify logout functionality', () => {
        cy.visit('/');
        
        // Find and click logout button
        cy.contains('Logout', { matchCase: false }).click();
        
        // Should redirect to auth page
        cy.url().should('include', '/auth');
        
        // Verify auth form is visible
        cy.get('input[type="email"]').should('be.visible');
        cy.get('input[type="password"]').should('be.visible');
      });
    });
  });

  // Cross-role integration tests
  context('Cross-Role Integration Tests', () => {
    it('should verify role-based access controls work correctly', () => {
      // Test that roles cannot access unauthorized areas
      const testCases = [
        { role: 'client', restrictedPath: '/admin-portal', shouldBlock: true },
        { role: 'advisor', restrictedPath: '/admin-portal/tenants', shouldBlock: true },
        { role: 'system_administrator', restrictedPath: '/admin-portal', shouldBlock: false }
      ];

      testCases.forEach(testCase => {
        cy.loginAs(testCase.role);
        cy.visit(testCase.restrictedPath, { failOnStatusCode: false });
        
        if (testCase.shouldBlock) {
          cy.url().should('not.include', testCase.restrictedPath);
        } else {
          cy.url().should('include', testCase.restrictedPath);
        }
      });
    });
  });

  // Performance and load tests
  context('Performance & Load Tests', () => {
    it('should load pages within acceptable time limits', () => {
      cy.loginAs('system_administrator');
      
      const criticalPages = [
        '/',
        '/admin-portal',
        '/admin-portal/system-health'
      ];
      
      criticalPages.forEach(page => {
        const startTime = Date.now();
        cy.visit(page);
        cy.get('h1, h2, h3').first().should('be.visible').then(() => {
          const loadTime = Date.now() - startTime;
          expect(loadTime).to.be.lessThan(5000); // 5 second max load time
        });
      });
    });
  });
});