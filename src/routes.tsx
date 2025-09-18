import React, { Suspense } from "react";
import { createBrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { SecureMessagesPage } from "./pages/SecureMessagesPage";
import { HomePage } from "./pages/TabPages";
import { AnnuitiesPage } from "./pages/AnnuitiesPage";
import NotFoundPage from "./components/errors/404Page";
import NoticesPage from "./pages/NoticesPage";
import InsurancePage from "./pages/InsurancePage";
import LendingDashboard from "./pages/LendingDashboard";
import ProfessionalNetworkPage from "./pages/ProfessionalNetworkPage";
import ComplianceAuditPage from "./pages/ComplianceAuditPage";
import FiduciaryInsurancePage from "./pages/FiduciaryInsurancePage";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ClientDashboard } from "./pages/dashboard/ClientDashboard";
import { AdminDashboard } from "./pages/dashboard/AdminDashboard";
import AdvisorDashboard from "./pages/AdvisorDashboard";
import { AccountantDashboard } from "./pages/dashboard/AccountantDashboard";
import { ConsultantDashboard } from "./pages/dashboard/ConsultantDashboard";
import { AttorneyDashboard } from "./pages/dashboard/AttorneyDashboard";
import { TenantAdminDashboard } from "./pages/dashboard/TenantAdminDashboard";
import { SystemAdministratorDashboard } from "./pages/dashboard/SystemAdministratorDashboard";
import { ComingSoonPage } from "./pages/ComingSoonPage";
import { WealthDashboardPage } from "./pages/WealthDashboardPage";
import { AccountsOverviewPage } from "./pages/AccountsOverviewPage";
import { BudgetsPage } from "./pages/BudgetsPage";
import { BillPayPage } from "./pages/BillPayPage";
import { LoanApplicationPage } from "./pages/lending/LoanApplicationPage";
import { LoanStatusPage } from "./pages/lending/LoanStatusPage";
import { PartnerComparisonPage } from "./pages/lending/PartnerComparisonPage";
import { AdvisorLendingDashboard } from "./pages/lending/AdvisorLendingDashboard";
import { AdminRoute } from "./components/auth/AdminRoute";

// Legal pages
import { PrivacyPolicyPage } from "./pages/legal/PrivacyPolicyPage";
import { TermsOfServicePage } from "./pages/legal/TermsOfServicePage";
import { DataProcessingPage } from "./pages/legal/DataProcessingPage";
import { CookiePolicyPage } from "./pages/legal/CookiePolicyPage";

// Help pages
import { GettingStartedPage } from "./pages/help/GettingStartedPage";
import { VideosPage } from "./pages/help/VideosPage";
import { APIPage } from "./pages/help/APIPage";
import { WebinarsPage } from "./pages/help/WebinarsPage";
import EducationPage from "./pages/EducationPage";

// NIL pages - removed
import ReadyCheck from "./pages/admin/ReadyCheck";
import { QAPlaybookPage } from "./pages/qa/QAPlaybookPage";

// QA pages removed for production
// All QA routes, checklists, and testing components removed for production security

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/start/families",
    element: React.createElement(() => {
      const { FamilyOnboarding } = require('./pages/family/FamilyOnboarding');
      return React.createElement(FamilyOnboarding);
    })
  },
  {
    path: "/family/home",
    element: React.createElement(() => {
      const { FamilyHomePage } = require('./pages/family/FamilyHomePage');
      return React.createElement(FamilyHomePage);
    })
  },
  {
    path: "/annuities",
    element: <AnnuitiesPage />,
  },
  {
    path: "/notices",
    element: <NoticesPage />,
  },
  {
    path: "/insurance",
    element: <InsurancePage />,
  },
  {
    path: "/lending",
    element: <LendingDashboard />,
  },
  {
    path: "/lending/apply",
    element: <LoanApplicationPage />,
  },
  {
    path: "/lending/status/:loanId",
    element: <LoanStatusPage />,
  },
  {
    path: "/lending/partners",
    element: <PartnerComparisonPage />,
  },
  {
    path: "/advisor/lending",
    element: <AdvisorLendingDashboard />,
  },
  {
    path: "/professional-network",
    element: <ProfessionalNetworkPage />,
  },
  {
    path: "/compliance-audit",
    element: <ComplianceAuditPage />,
  },
  {
    path: "/insurance/education/:productType",
    element: <FiduciaryInsurancePage />,
  },
  // Dashboard routes with new layout
  {
    path: "/client-dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <ClientDashboard />,
      }
    ]
  },
  {
    path: "/advisor-dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <AdvisorDashboard />,
      }
    ]
  },
  {
    path: "/admin-dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      }
    ]
  },
  {
    path: "/accountant-dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <AccountantDashboard />,
      }
    ]
  },
  {
    path: "/consultant-dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <ConsultantDashboard />,
      }
    ]
  },
  {
    path: "/attorney-dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <AttorneyDashboard />,
      }
    ]
  },
  {
    path: "/tenant-admin-dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <TenantAdminDashboard />,
      }
    ]
  },
  {
    path: "/system-administrator-dashboard", 
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <SystemAdministratorDashboard />,
      }
    ]
  },
  // NIL Platform routes - removed
  {
    path: "/admin/ready-check",
    element: <ReadyCheck />
  },
  // Education route
  {
    path: "/education",
    element: <EducationPage />
  },
  // Coming Soon routes for missing features
  {
    path: "/client-education",
    element: <ComingSoonPage featureName="Education & Resources" description="Comprehensive educational resources and solution catalog for family office clients." />
  },
  {
    path: "/investments", 
    element: <ComingSoonPage featureName="Investment Solutions" description="Advanced investment management and portfolio optimization tools." />
  },
  {
    path: "/tax-planning",
    element: <ComingSoonPage featureName="Tax Planning" description="Comprehensive tax planning and optimization strategies." />
  },
  {
    path: "/client-lending",
    element: <ComingSoonPage featureName="Lending Solutions" description="Customized lending solutions and credit management tools." />
  },
  {
    path: "/estate-planning", 
    element: <ComingSoonPage featureName="Estate Planning" description="Advanced estate planning and wealth transfer strategies." />
  },
  {
    path: "/wealth",
    element: <WealthDashboardPage />
  },
  {
    path: "/wealth/accounts", 
    element: <AccountsOverviewPage />
  },
  {
    path: "/wealth/goals/budgets",
    element: <BudgetsPage />
  },
  {
    path: "/wealth/bill-pay",
    element: <BillPayPage />
  },
  {
    path: "/health",
    element: <ComingSoonPage featureName="Health Optimization" description="Comprehensive health optimization and wellness management tools." />
  },
  {
    path: "/start/brand",
    element: React.createElement(() => {
      const { default: StartBrandPage } = require('./pages/start/StartBrandPage');
      return React.createElement(StartBrandPage);
    })
  },
  {
    path: "/brand/home",
    element: React.createElement(() => {
      const { default: BrandHomePage } = require('./pages/brand/BrandHomePage');
      return React.createElement(BrandHomePage);
    })
  },
  {
    path: "/supervisor",
    element: React.createElement(() => {
      const { default: SupervisorHomePage } = require('./pages/supervisor/SupervisorHomePage');
      return React.createElement(SupervisorHomePage);
    })
  },
  {
    path: "/advisor/leads",
    element: React.createElement(() => {
      const { ProLeadsPage } = require('./pages/pro/ProLeadsPage');
      return React.createElement(ProLeadsPage, { persona: 'advisor' });
    })
  },
  {
    path: "/cpa/leads", 
    element: React.createElement(() => {
      const { ProLeadsPage } = require('./pages/pro/ProLeadsPage');
      return React.createElement(ProLeadsPage, { persona: 'cpa' });
    })
  },
  {
    path: "/attorney/leads",
    element: React.createElement(() => {
      const { ProLeadsPage } = require('./pages/pro/ProLeadsPage');
      return React.createElement(ProLeadsPage, { persona: 'attorney' });
    })
  },
  {
    path: "/insurance/leads",
    element: React.createElement(() => {
      const { ProLeadsPage } = require('./pages/pro/ProLeadsPage');
      return React.createElement(ProLeadsPage, { persona: 'insurance' });
    })
  },
  {
    path: "/healthcare/leads", 
    element: React.createElement(() => {
      const { ProLeadsPage } = require('./pages/pro/ProLeadsPage');
      return React.createElement(ProLeadsPage, { persona: 'healthcare' });
    })
  },
  {
    path: "/realtor/leads",
    element: React.createElement(() => {
      const { ProLeadsPage } = require('./pages/pro/ProLeadsPage');
      return React.createElement(ProLeadsPage, { persona: 'realtor' });
    })
  },
  // Pro dashboard routes
  {
    path: "/cpa",
    element: React.createElement(() => {
      const { ProDashboard } = require('./pages/pro/ProDashboard');
      return React.createElement(ProDashboard, { persona: 'cpa' });
    })
  },
  {
    path: "/attorney",
    element: React.createElement(() => {
      const { ProDashboard } = require('./pages/pro/ProDashboard');
      return React.createElement(ProDashboard, { persona: 'attorney' });
    })
  },
  {
    path: "/insurance/home",
    element: React.createElement(() => {
      const { InsuranceHomePage } = require('./pages/insurance/InsuranceHomePage');
      return React.createElement(InsuranceHomePage);
    })
  },
  {
    path: "/insurance/meetings",
    element: React.createElement(() => {
      const { InsuranceMeetingsPage } = require('./pages/insurance/InsuranceMeetingsPage');
      return React.createElement(InsuranceMeetingsPage);
    })
  },
  {
    path: "/insurance/pipeline",
    element: React.createElement(() => {
      const { InsurancePipelinePage } = require('./pages/insurance/InsurancePipelinePage');
      return React.createElement(InsurancePipelinePage);
    })
  },
  {
    path: "/insurance/proof",
    element: React.createElement(() => {
      const { InsuranceProofPage } = require('./pages/insurance/InsuranceProofPage');
      return React.createElement(InsuranceProofPage);
    })
  },
  {
    path: "/insurance",
    element: React.createElement(() => {
      const { ProDashboard } = require('./pages/pro/ProDashboard');
      return React.createElement(ProDashboard, { persona: 'insurance' });
    })
  },
  {
    path: "/healthcare",
    element: React.createElement(() => {
      const { ProDashboard } = require('./pages/pro/ProDashboard');
      return React.createElement(ProDashboard, { persona: 'healthcare' });
    })
  },
  {
    path: "/realtor",
    element: React.createElement(() => {
      const { ProDashboard } = require('./pages/pro/ProDashboard');
      return React.createElement(ProDashboard, { persona: 'realtor' });
    })
  },
  // Advisor workspace routes
  {
    path: "/advisors",
    element: React.createElement(() => {
      const { AdvisorsLayout } = require('./layouts/AdvisorsLayout');
      return React.createElement(AdvisorsLayout);
    }),
    children: [
      {
        path: "home",
        element: React.createElement(() => {
          const { AdvisorHomePage } = require('./pages/advisors/AdvisorHomePage');
          return React.createElement(AdvisorHomePage);
        })
      },
      {
        path: "leads",
        element: React.createElement(() => {
          const { AdvisorLeadsPage } = require('./pages/advisors/AdvisorLeadsPage');
          return React.createElement(AdvisorLeadsPage);
        })
      },
      {
        path: "meetings",
        element: React.createElement(() => {
          const { AdvisorMeetingsPage } = require('./pages/advisors/AdvisorMeetingsPage');
          return React.createElement(AdvisorMeetingsPage);
        })
      },
      {
        path: "campaigns",
        element: React.createElement(() => {
          const { AdvisorCampaignsPage } = require('./pages/advisors/AdvisorCampaignsPage');
          return React.createElement(AdvisorCampaignsPage);
        })
      },
      {
        path: "pipeline",
        element: React.createElement(() => {
          const { AdvisorPipelinePage } = require('./pages/advisors/AdvisorPipelinePage');
          return React.createElement(AdvisorPipelinePage);
        })
      },
      {
        path: "tools",
        element: React.createElement(() => {
          const { AdvisorToolsPage } = require('./pages/advisors/AdvisorToolsPage');
          return React.createElement(AdvisorToolsPage);
        })
      },
      {
        path: "proof",
        element: React.createElement(() => {
          const { AdvisorProofPage } = require('./pages/advisors/AdvisorProofPage');
          return React.createElement(AdvisorProofPage);
        })
      }
    ]
  },
  {
    path: "/advisor/*",
    element: <ComingSoonPage featureName="Legacy Advisor Tools" description="Professional advisor management and client service tools." />
  },
  {
    path: "/accountant/*", 
    element: <ComingSoonPage featureName="Accounting Services" description="Professional accounting and tax preparation services." />
  },
  {
    path: "/consultant/*",
    element: <ComingSoonPage featureName="Consulting Services" description="Professional consulting and business advisory services." />
  },
  {
    path: "/attorney/*",
    element: (
      <div className="min-h-screen bg-background">
        <div className="border-b">
          <nav className="container mx-auto px-6 py-3">
            <div className="flex items-center space-x-6">
              <Link to="/attorney/home" className="text-sm font-medium">Home</Link>
              <Link to="/attorney/leads" className="text-sm text-muted-foreground hover:text-foreground">Leads</Link>
              <Link to="/attorney/meetings" className="text-sm text-muted-foreground hover:text-foreground">Meetings</Link>
              <Link to="/attorney/matters" className="text-sm text-muted-foreground hover:text-foreground">Matters</Link>
              <Link to="/attorney/proof" className="text-sm text-muted-foreground hover:text-foreground">Proof</Link>
            </div>
          </nav>
        </div>
        <Routes>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={React.createElement(() => {
            const { AttorneyHomePage } = require('./pages/attorneys/AttorneyHomePage');
            return React.createElement(AttorneyHomePage);
          })} />
          <Route path="leads" element={React.createElement(() => {
            const { AttorneyLeadsPage } = require('./pages/attorneys/AttorneyLeadsPage');
            return React.createElement(AttorneyLeadsPage);
          })} />
          <Route path="meetings" element={React.createElement(() => {
            const { AttorneyMeetingsPage } = require('./pages/attorneys/AttorneyMeetingsPage');
            return React.createElement(AttorneyMeetingsPage);
          })} />
          <Route path="matters" element={React.createElement(() => {
            const { AttorneyMattersPage } = require('./pages/attorneys/AttorneyMattersPage');
            return React.createElement(AttorneyMattersPage);
          })} />
          <Route path="proof" element={React.createElement(() => {
            const { AttorneyProofPage } = require('./pages/attorneys/AttorneyProofPage');
            return React.createElement(AttorneyProofPage);
          })} />
        </Routes>
      </div>
    )
  },
  {
    path: "/insurance/life/*",
    element: (
      <div className="min-h-screen bg-background">
        <Routes>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={React.createElement(() => {
            const { default: InsuranceLifeHomePage } = require('./pages/insurance/life/InsuranceLifeHomePage');
            return React.createElement(InsuranceLifeHomePage);
          })} />
          <Route path="leads" element={React.createElement(() => {
            const { default: InsuranceLifeLeadsPage } = require('./pages/insurance/life/InsuranceLifeLeadsPage');
            return React.createElement(InsuranceLifeLeadsPage);
          })} />
          <Route path="tools" element={React.createElement(() => {
            const { default: InsuranceLifeToolsPage } = require('./pages/insurance/life/InsuranceLifeToolsPage');
            return React.createElement(InsuranceLifeToolsPage);
          })} />
          <Route path="proof" element={React.createElement(() => {
            const { default: InsuranceLifeProofPage } = require('./pages/insurance/life/InsuranceLifeProofPage');
            return React.createElement(InsuranceLifeProofPage);
          })} />
        </Routes>
      </div>
    )
  },
  {
    path: "/medicare/*",
    element: (
      <div className="min-h-screen bg-background">
        <Routes>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={React.createElement(() => {
            const { default: MedicareHomePage } = require('./pages/medicare/MedicareHomePage');
            return React.createElement(MedicareHomePage);
          })} />
          <Route path="leads" element={React.createElement(() => {
            const { default: MedicareLeadsPage } = require('./pages/medicare/MedicareLeadsPage');
            return React.createElement(MedicareLeadsPage);
          })} />
          <Route path="soa" element={React.createElement(() => {
            const { default: MedicareSOAPage } = require('./pages/medicare/MedicareSOAPage');
            return React.createElement(MedicareSOAPage);
          })} />
          <Route path="proof" element={React.createElement(() => {
            const { default: MedicareProofPage } = require('./pages/medicare/MedicareProofPage');
            return React.createElement(MedicareProofPage);
          })} />
        </Routes>
      </div>
    )
  },
  {
    path: "/health/*",
    element: (
      <div className="min-h-screen bg-background">
        <Routes>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={React.createElement(() => {
            const { default: HealthcareHomePage } = require('./pages/health/HealthcareHomePage');
            return React.createElement(HealthcareHomePage);
          })} />
          <Route path="leads" element={React.createElement(() => {
            const { default: HealthcareLeadsPage } = require('./pages/health/HealthcareLeadsPage');
            return React.createElement(HealthcareLeadsPage);
          })} />
          <Route path="tools" element={React.createElement(() => {
            const { default: HealthcareToolsPage } = require('./pages/health/HealthcareToolsPage');
            return React.createElement(HealthcareToolsPage);
          })} />
          <Route path="proof" element={React.createElement(() => {
            const { default: HealthcareProofPage } = require('./pages/health/HealthcareProofPage');
            return React.createElement(HealthcareProofPage);
          })} />
        </Routes>
      </div>
    )
  },
  {
    path: "/realtor/*",
    element: (
      <div className="min-h-screen bg-background">
        <Routes>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={React.createElement(() => {
            const { default: RealtorHomePage } = require('./pages/realtor/RealtorHomePage');
            return React.createElement(RealtorHomePage);
          })} />
          <Route path="leads" element={React.createElement(() => {
            const { default: RealtorLeadsPage } = require('./pages/realtor/RealtorLeadsPage');
            return React.createElement(RealtorLeadsPage);
          })} />
          <Route path="tools" element={React.createElement(() => {
            const { default: RealtorToolsPage } = require('./pages/realtor/RealtorToolsPage');
            return React.createElement(RealtorToolsPage);
          })} />
          <Route path="proof" element={React.createElement(() => {
            const { default: RealtorProofPage } = require('./pages/realtor/RealtorProofPage');
            return React.createElement(RealtorProofPage);
          })} />
        </Routes>
      </div>
    )
  },
  {
    path: "/admin/*",
    element: (
      <AdminRoute roles={['admin', 'tenant_admin', 'system_administrator']}>
        <ComingSoonPage featureName="Administrative Tools" description="Platform administration and user management tools." />
      </AdminRoute>
    )
  },
  // Legal routes
  {
    path: "/legal/privacy-policy",
    element: <PrivacyPolicyPage />
  },
  {
    path: "/legal/terms-of-service", 
    element: <TermsOfServicePage />
  },
  {
    path: "/legal/data-processing",
    element: <DataProcessingPage />
  },
  {
    path: "/legal/cookie-policy",
    element: <CookiePolicyPage />
  },
  // Help routes
  {
    path: "/help/getting-started",
    element: <GettingStartedPage />
  },
  {
    path: "/help/videos",
    element: <VideosPage />
  },
  {
    path: "/help/api",
    element: <APIPage />
  },
  {
    path: "/help/webinars",
    element: <WebinarsPage />
  },
  {
    path: "/secure-messages",
    element: <SecureMessagesPage />
  },
  {
    path: "/invite/advisor",
    element: React.createElement(() => {
      const { default: InviteAdvisor } = require('./pages/invite/InviteAdvisor');
      return React.createElement(InviteAdvisor);
    })
  },
  {
    path: "/invite/:token",
    element: React.createElement(() => {
      const { default: InviteRedemption } = require('./pages/invite/InviteRedemption');
      return React.createElement(InviteRedemption);
    })
  },
  {
    path: "/qa-playbook",
    element: <QAPlaybookPage />
  },
  // QA routes removed for production security
  // 404 catch-all route
  {
    path: "*",
    element: <NotFoundPage />
  }
]);