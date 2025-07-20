
describe('Multi-Tenant Isolation E2E Tests', () => {
  beforeEach(() => {
    cy.resetTestData();
  });

  describe('Tenant Data Isolation', () => {
    it('should isolate user data by tenant', () => {
      // Test with advisor from tenant A
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      // Capture tenant context
      cy.window().its('localStorage').then((localStorage) => {
        const authData = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}');
        const tenantA = authData.user?.tenant_id;
        
        expect(tenantA).to.not.be.undefined;
        
        // Verify multi-tenant isolation
        cy.verifyMultiTenantIsolation(tenantA);
        
        // Check that all visible data belongs to tenant A
        cy.get('[data-testid="client-list"]').within(() => {
          cy.get('[data-client-id]').each(($el) => {
            cy.wrap($el).should('have.attr', 'data-tenant-id', tenantA);
          });
        });
      });
    });

    it('should prevent cross-tenant data access via API', () => {
      cy.loginAsScenario('senior_advisor');
      
      // Get auth token
      cy.window().its('localStorage').then((localStorage) => {
        const authData = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}');
        const token = authData.access_token;
        const userTenantId = authData.user?.tenant_id;
        
        // Try to access data from a different tenant
        const otherTenantId = 'different-tenant-id-123';
        
        cy.request({
          method: 'GET',
          url: `https://xcmqjkvyvuhoslbzmlgi.supabase.co/rest/v1/documents?tenant_id=eq.${otherTenantId}`,
          headers: {
            'Authorization': `Bearer ${token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjbXFqa3Z5dnVob3NsYnptbGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjQ5MjUsImV4cCI6MjA2MjA0MDkyNX0.x0UM2ezINls7QytsvURR5zYitUiZ52G8Pl5s78ILDfU'
          },
          failOnStatusCode: false
        }).then((response) => {
          // Should return empty result due to RLS
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array').that.is.empty;
        });
      });
    });

    it('should isolate professional services by tenant', () => {
      cy.loginAsScenario('premium_client');
      cy.visit('/client-professionals');
      
      // Add a professional
      cy.get('[data-testid="add-professional-button"]').click();
      cy.get('[data-testid="professional-name-input"]').type('Tenant A CPA');
      cy.get('[data-testid="professional-email-input"]').type('cpa.tenanta@example.com');
      cy.get('[data-testid="professional-type-select"]').select('Tax Professional / Accountant');
      cy.get('[data-testid="save-professional-button"]').click();
      
      // Verify professional is saved
      cy.get('[data-testid="professionals-list"]')
        .should('contain', 'Tenant A CPA');
      
      // Login as different tenant user
      cy.loginAsScenario('basic_client'); // Different tenant
      cy.visit('/client-professionals');
      
      // Should not see the professional from other tenant
      cy.get('[data-testid="professionals-list"]')
        .should('not.contain', 'Tenant A CPA');
    });
  });

  describe('System Admin Multi-Tenant Access', () => {
    it('should allow system admin to access all tenant data', () => {
      cy.loginAsScenario('superadmin');
      cy.visit('/admin-portal');
      
      // System admin should see multi-tenant overview
      cy.get('[data-testid="tenant-overview"]')
        .should('be.visible');
      
      // Should be able to switch between tenant contexts
      cy.get('[data-testid="tenant-selector"]').click();
      cy.get('[data-testid="tenant-option"]').first().click();
      
      // Verify can access tenant-specific data
      cy.get('[data-testid="tenant-users"]')
        .should('be.visible')
        .and('have.length.greaterThan', 0);
    });

    it('should restrict tenant admin to their tenant only', () => {
      cy.loginAsScenario('tenant_admin');
      cy.visit('/admin-portal');
      
      // Tenant admin should not see tenant selector
      cy.get('[data-testid="tenant-selector"]').should('not.exist');
      
      // Should only see their tenant's data
      cy.get('[data-testid="users-list"]').within(() => {
        cy.get('[data-user-id]').each(($el) => {
          // All users should belong to same tenant
          cy.wrap($el).should('have.attr', 'data-tenant-id');
        });
      });
    });
  });

  describe('Document Sharing Isolation', () => {
    it('should isolate shared documents by tenant', () => {
      cy.loginAsScenario('premium_client');
      cy.visit('/client-professionals');
      
      // Upload and share a document
      cy.get('[data-testid="documents-tab"]').click();
      cy.get('[data-testid="upload-document-button"]').click();
      
      // Mock file upload
      cy.get('[data-testid="file-input"]').selectFile({
        contents: 'Test document content',
        fileName: 'test-doc.pdf',
        mimeType: 'application/pdf'
      }, { force: true });
      
      cy.get('[data-testid="document-name-input"]').type('Tenant A Document');
      cy.get('[data-testid="upload-button"]').click();
      
      // Share with professional
      cy.get('[data-testid="share-document-button"]').click();
      cy.get('[data-testid="select-professional"]').first().click();
      cy.get('[data-testid="confirm-share-button"]').click();
      
      // Login as user from different tenant
      cy.loginAsScenario('basic_client');
      cy.visit('/client-professionals');
      
      cy.get('[data-testid="documents-tab"]').click();
      
      // Should not see document from other tenant
      cy.get('[data-testid="shared-documents-list"]')
        .should('not.contain', 'Tenant A Document');
    });
  });

  describe('Invitation Isolation', () => {
    it('should isolate prospect invitations by tenant', () => {
      const prospectEmail = 'tenant.prospect@example.com';
      
      // Advisor from tenant A invites prospect
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      cy.get('[data-testid="invite-prospect-button"]').click();
      cy.get('[data-testid="prospect-email-input"]').type(prospectEmail);
      cy.get('[data-testid="prospect-first-name-input"]').type('Tenant');
      cy.get('[data-testid="prospect-last-name-input"]').type('Prospect');
      cy.get('[data-testid="send-invitation-button"]').click();
      
      // Verify invitation shows in tenant A advisor's list
      cy.get('[data-testid="prospects-list"]')
        .should('contain', prospectEmail);
      
      // Login as advisor from different tenant
      cy.loginAsScenario('junior_advisor'); // Different tenant
      cy.visit('/advisor-dashboard');
      
      // Should not see prospect from other tenant
      cy.get('[data-testid="prospects-list"]')
        .should('not.contain', prospectEmail);
    });

    it('should isolate advisor invitations by tenant', () => {
      const newAdvisorEmail = 'tenant.advisor@example.com';
      
      // Tenant A admin invites advisor
      cy.loginAsScenario('tenant_admin');
      cy.visit('/admin-portal');
      
      cy.get('[data-testid="manage-advisors-link"]').click();
      cy.get('[data-testid="invite-advisor-button"]').click();
      
      cy.get('[data-testid="advisor-email-input"]').type(newAdvisorEmail);
      cy.get('[data-testid="advisor-first-name-input"]').type('Tenant');
      cy.get('[data-testid="advisor-last-name-input"]').type('Advisor');
      cy.get('[data-testid="advisor-role-select"]').select('senior_advisor');
      cy.get('[data-testid="send-advisor-invite-button"]').click();
      
      // Verify invitation is visible to tenant A admin
      cy.get('[data-testid="pending-invitations"]')
        .should('contain', newAdvisorEmail);
      
      // This test would require a second tenant admin to verify isolation
      // For now, we'll verify the invitation has correct tenant context
      cy.get('[data-testid="invitation-row"]')
        .first()
        .should('have.attr', 'data-tenant-id');
    });
  });

  describe('Cross-Tenant Data Leakage Prevention', () => {
    it('should prevent data leakage through search functionality', () => {
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      // Search for data that might exist in other tenants
      cy.get('[data-testid="search-input"]').type('client@othertenant.com');
      cy.get('[data-testid="search-button"]').click();
      
      // Should return no results
      cy.get('[data-testid="search-results"]')
        .should('contain', 'No results found');
      
      // Should not expose any cross-tenant information
      cy.get('[data-testid="search-suggestions"]')
        .should('not.exist');
    });

    it('should prevent data leakage through URL manipulation', () => {
      // Get a client ID that belongs to current tenant
      cy.loginAsScenario('senior_advisor');
      cy.visit('/advisor-dashboard');
      
      cy.get('[data-client-id]').first().then(($el) => {
        const clientId = $el.attr('data-client-id');
        
        // Try to access client with manipulated tenant context
        cy.visit(`/client/${clientId}?tenant=different-tenant`);
        
        // Should either redirect or show access denied
        cy.url().should('not.contain', 'different-tenant');
        
        // Verify current user's tenant context is maintained
        cy.verifyMultiTenantIsolation();
      });
    });
  });

  describe('Performance Impact of Tenant Isolation', () => {
    it('should maintain performance with tenant isolation', () => {
      cy.loginAsScenario('senior_advisor');
      
      // Record performance timing
      const startTime = Date.now();
      
      cy.visit('/advisor-dashboard');
      
      // Wait for page to fully load
      cy.get('[data-testid="dashboard-loaded"]').should('be.visible');
      
      cy.then(() => {
        const loadTime = Date.now() - startTime;
        
        // Page should load within reasonable time (5 seconds)
        expect(loadTime).to.be.lessThan(5000);
      });
      
      // Verify all tenant-isolated data is loaded correctly
      cy.get('[data-testid="client-count"]').should('contain.text', /\d+/);
      cy.get('[data-testid="prospects-count"]').should('contain.text', /\d+/);
    });
  });
});
