import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/TabPages";
import { AnnuitiesPage } from "./pages/AnnuitiesPage";
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
import { LoanApplicationPage } from "./pages/lending/LoanApplicationPage";
import { LoanStatusPage } from "./pages/lending/LoanStatusPage";
import { PartnerComparisonPage } from "./pages/lending/PartnerComparisonPage";
import { AdvisorLendingDashboard } from "./pages/lending/AdvisorLendingDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
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
    element: <ComingSoonPage featureName="Family Wealth Dashboard" description="Comprehensive wealth management and family office tools." />
  },
  {
    path: "/wealth/accounts",
    element: <ComingSoonPage featureName="Accounts Overview" description="Centralized view and management of all your financial accounts." />
  },
  {
    path: "/health",
    element: <ComingSoonPage featureName="Health Optimization" description="Comprehensive health optimization and wellness management tools." />
  },
  {
    path: "/advisor/*",
    element: <ComingSoonPage featureName="Advisor Tools" description="Professional advisor management and client service tools." />
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
    element: <ComingSoonPage featureName="Legal Services" description="Professional legal services and document management." />
  },
  {
    path: "/admin/*",
    element: <ComingSoonPage featureName="Administrative Tools" description="Platform administration and user management tools." />
  }
]);