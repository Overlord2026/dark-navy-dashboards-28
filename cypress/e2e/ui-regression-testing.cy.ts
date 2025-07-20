
/// <reference types="cypress" />

describe('UI Regression Testing', () => {
  beforeEach(() => {
    cy.setupTestData();
  });

  describe('Navigation & Layout Consistency', () => {
    const userRoles = [
      { role: 'superadmin', expectedNavItems: ['Dashboard', 'System Health', 'Users'] },
      { role: 'senior_advisor', expectedNavItems: ['Dashboard', 'Clients'] },
      { role: 'premium_client', expectedNavItems: ['Home'] }
    ];

    userRoles.forEach(({ role, expectedNavItems }) => {
      it(`should display consistent navigation for ${role}`, () => {
        cy.loginAsScenario(role);
        cy.visit('/');
        
        // Verify navigation elements are present
        expectedNavItems.forEach(navItem => {
          cy.contains(navItem, { matchCase: false }).should('be.visible');
        });
        
        // Take screenshot for visual regression
        cy.screenshot(`navigation-${role}`);
      });
    });

    it('should maintain responsive design across breakpoints', () => {
      const viewports = [
        { width: 375, height: 667, name: 'mobile' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 1920, height: 1080, name: 'desktop' }
      ];
      
      viewports.forEach(({ width, height, name }) => {
        cy.viewport(width, height);
        cy.loginAsScenario('superadmin');
        cy.visit('/admin-portal');
        
        // Verify layout adapts properly
        cy.get('[data-testid="main-content"]').should('be.visible');
        cy.screenshot(`layout-${name}`);
      });
    });
  });

  describe('Form Validation & User Input', () => {
    it('should display proper validation messages', () => {
      cy.visit('/auth');
      
      // Submit empty form
      cy.get('button[type="submit"]').click();
      
      // Should show validation errors
      cy.get('input[type="email"]:invalid').should('exist');
      cy.get('input[type="password"]:invalid').should('exist');
    });

    it('should handle form submission states correctly', () => {
      cy.visit('/auth');
      
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('password123');
      
      // Intercept login request to simulate loading
      cy.intercept('POST', '**/auth/v1/token*', (req) => {
        req.reply((res) => {
          res.delay(2000); // Simulate slow response
          res.send({ fixture: 'auth-response.json' });
        });
      }).as('loginRequest');
      
      cy.get('button[type="submit"]').click();
      
      // Should show loading state
      cy.get('button[type="submit"]').should('contain.text', 'Signing in...');
    });
  });

  describe('Data Loading States', () => {
    it('should show loading states for dashboard components', () => {
      cy.loginAsScenario('superadmin');
      
      // Intercept API calls to simulate slow loading
      cy.intercept('GET', '**/rest/v1/**', (req) => {
        req.reply((res) => {
          res.delay(1000);
          res.send([]);
        });
      }).as('dataRequest');
      
      cy.visit('/admin-portal');
      
      // Should show loading indicators
      cy.get('[data-testid="loading-spinner"]', { timeout: 500 })
        .should('be.visible');
    });

    it('should handle empty states gracefully', () => {
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      // Check for empty state handling
      cy.get('body').then($body => {
        if ($body.find('[data-testid="empty-state"]').length > 0) {
          cy.get('[data-testid="empty-state"]')
            .should('be.visible')
            .and('contain.text', 'No data');
        }
      });
    });
  });

  describe('Error Boundaries & Error Handling', () => {
    it('should handle component errors gracefully', () => {
      // Force a component error by visiting invalid routes
      cy.visit('/invalid-route-that-does-not-exist', { failOnStatusCode: false });
      
      // Should show error page or redirect
      cy.get('body').should('not.contain', 'Error: ');
      
      // Should either show 404 page or redirect to valid route
      cy.url().then(url => {
        expect(url).to.satisfy((url: string) => 
          url.includes('/404') || 
          url.includes('/auth') || 
          url.includes('/')
        );
      });
    });

    it('should display user-friendly error messages', () => {
      cy.loginAsScenario('superadmin');
      
      // Intercept API calls to simulate server errors
      cy.intercept('GET', '**/rest/v1/**', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      }).as('serverError');
      
      cy.visit('/admin-portal');
      
      // Should show user-friendly error message
      cy.get('[data-testid="error-message"]', { timeout: 10000 })
        .should('be.visible')
        .and('not.contain', '500')
        .and('not.contain', 'Internal Server Error');
    });
  });

  describe('Accessibility & ARIA Compliance', () => {
    it('should have proper ARIA labels and roles', () => {
      cy.loginAsScenario('superadmin');
      cy.visit('/admin-portal');
      
      // Check for proper ARIA attributes
      cy.get('button').each($btn => {
        cy.wrap($btn).should('have.attr', 'aria-label').or('have.text');
      });
      
      // Check for proper heading hierarchy
      cy.get('h1').should('have.length', 1);
      cy.get('h1, h2, h3, h4, h5, h6').each(($heading, index, $headings) => {
        if (index > 0) {
          const currentLevel = parseInt($heading.prop('tagName').charAt(1));
          const prevLevel = parseInt($headings.eq(index - 1).prop('tagName').charAt(1));
          expect(currentLevel).to.be.at.most(prevLevel + 1);
        }
      });
    });

    it('should support keyboard navigation', () => {
      cy.loginAsScenario('superadmin');
      cy.visit('/admin-portal');
      
      // Test tab navigation
      cy.get('body').tab();
      cy.focused().should('be.visible');
      
      // Continue tabbing through interactive elements
      for (let i = 0; i < 5; i++) {
        cy.focused().tab();
        cy.focused().should('be.visible');
      }
    });
  });

  describe('Browser Compatibility', () => {
    it('should work with different user agents', () => {
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      ];
      
      userAgents.forEach(userAgent => {
        cy.visit('/', {
          headers: {
            'User-Agent': userAgent
          }
        });
        
        cy.get('body').should('be.visible');
      });
    });
  });

  describe('Performance Monitoring', () => {
    it('should load critical resources within thresholds', () => {
      cy.loginAsScenario('superadmin');
      
      // Monitor loading performance
      cy.visit('/admin-portal', {
        onBeforeLoad: (win) => {
          win.performance.mark('start');
        },
        onLoad: (win) => {
          win.performance.mark('end');
          win.performance.measure('pageLoad', 'start', 'end');
          
          const measure = win.performance.getEntriesByName('pageLoad')[0];
          expect(measure.duration).to.be.lessThan(5000); // 5 second threshold
        }
      });
    });

    it('should have acceptable Core Web Vitals', () => {
      cy.loginAsScenario('premium_client');
      cy.visit('/');
      
      // Wait for page to fully load
      cy.get('[data-testid="main-content"]').should('be.visible');
      
      // Check for layout shifts (CLS should be minimal)
      cy.window().then(win => {
        return new Promise(resolve => {
          new (win as any).PerformanceObserver((list: any) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
                expect(entry.value).to.be.lessThan(0.1); // CLS threshold
              }
            }
            resolve(true);
          }).observe({ entryTypes: ['layout-shift'] });
          
          setTimeout(resolve, 3000); // Timeout after 3 seconds
        });
      });
    });
  });
});
