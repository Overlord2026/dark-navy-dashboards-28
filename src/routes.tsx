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
    element: <AdvisorDashboard />,
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
]);