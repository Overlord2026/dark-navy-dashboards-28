import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/TabPages";
import { AnnuitiesPage } from "./pages/AnnuitiesPage";
import NoticesPage from "./pages/NoticesPage";
import InsurancePage from "./pages/InsurancePage";
import LendingDashboard from "./pages/LendingDashboard";
import ProfessionalNetworkPage from "./pages/ProfessionalNetworkPage";
import ComplianceAuditPage from "./pages/ComplianceAuditPage";
import FiduciaryInsurancePage from "./pages/FiduciaryInsurancePage";
import { ClientDashboard } from "./pages/ClientDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import AdvisorDashboard from "./pages/AdvisorDashboard";
import { AccountantDashboard } from "./pages/AccountantDashboard";
import { ConsultantDashboard } from "./pages/ConsultantDashboard";
import { AttorneyDashboard } from "./pages/AttorneyDashboard";

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
  // Dashboard routes
  {
    path: "/client-dashboard",
    element: <ClientDashboard />,
  },
  {
    path: "/advisor-dashboard", 
    element: <AdvisorDashboard />,
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/accountant-dashboard",
    element: <AccountantDashboard />,
  },
  {
    path: "/consultant-dashboard",
    element: <ConsultantDashboard />,
  },
  {
    path: "/attorney-dashboard",
    element: <AttorneyDashboard />,
  },
]);