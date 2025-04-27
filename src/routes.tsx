import { createBrowserRouter } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import Accounts from "@/pages/Accounts";
import FinancialPlans from "@/pages/FinancialPlans";
import NotFound from "@/pages/NotFound";
import TaxPlanning from "@/pages/TaxPlanning";
import AdvisorDashboard from "@/pages/AdvisorDashboard";
import Subscription from "@/pages/Subscription";
import SystemDiagnostics from "@/pages/SystemDiagnostics";
import ErrorSimulation from "@/pages/ErrorSimulation";
import VisualTesting from "@/pages/VisualTesting";
import IPProtection from "@/pages/IPProtection";
import DeveloperAccessControl from "@/pages/DeveloperAccessControl";
import {
  HomePage,
  AccountsPage,
  EducationPage,
  FamilyWealthPage,
  CollaborationPage,
  SettingsPage,
} from "@/pages/TabPages";
import Education from "@/pages/Education";
import TaxPlanningEducation from "@/pages/TaxPlanningEducation";
import EstatePlanning from "@/pages/EstatePlanning";
import Help from "@/pages/Help";
import Transfers from "@/pages/Transfers";
import TaxBudgets from "@/pages/TaxBudgets";
import Healthcare from "@/pages/Healthcare";
import Documents from "@/pages/Documents";
import DisclosuresPage from "@/pages/DisclosuresPage";
import TeamPage from "@/pages/TeamPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import Properties from "@/pages/Properties";
import SocialSecurity from "@/pages/SocialSecurity";
import ProfessionalSignup from "@/pages/ProfessionalSignup";
import Integration from "@/pages/Integration";
import Sharing from "@/pages/Sharing";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/accounts",
    element: <Accounts />,
  },
  {
    path: "/financial-plans",
    element: <FinancialPlans />,
  },
  {
    path: "/integration",
    element: <Integration />,
  },
  {
    path: "/sharing",
    element: <Sharing />,
  },
  {
    path: "/ai-insights",
    element: <Dashboard />, // Temporarily point to Dashboard until AI Insights page is created
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/tax-planning",
    element: <TaxPlanning />,
  },
  {
    path: "/advisor/dashboard",
    element: <AdvisorDashboard />,
  },
  {
    path: "/subscription",
    element: <Subscription />,
  },
  {
    path: "/diagnostics",
    element: <SystemDiagnostics />,
  },
  {
    path: "/diagnostics/error-simulation",
    element: <ErrorSimulation />,
  },
  {
    path: "/diagnostics/visual-testing",
    element: <VisualTesting />,
  },
  {
    path: "/ip-protection",
    element: <IPProtection />,
  },
  {
    path: "/developer-access-control",
    element: <DeveloperAccessControl />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/accounts-overview",
    element: <AccountsPage />,
  },
  {
    path: "/education-center",
    element: <EducationPage />,
  },
  {
    path: "/family-wealth",
    element: <FamilyWealthPage />,
  },
  {
    path: "/collaboration",
    element: <CollaborationPage />,
  },
  {
    path: "/settings-page",
    element: <SettingsPage />,
  },
  {
    path: "/education",
    element: <Education />,
  },
  {
    path: "/education/tax-planning",
    element: <TaxPlanningEducation />,
  },
  {
    path: "/estate-planning",
    element: <EstatePlanning />,
  },
  {
    path: "/help",
    element: <Help />,
  },
  {
    path: "/transfers",
    element: <Transfers />,
  },
  {
    path: "/tax-budgets",
    element: <TaxBudgets />,
  },
  {
    path: "/healthcare",
    element: <Healthcare />,
  },
  {
    path: "/documents",
    element: <Documents />,
  },
  {
    path: "/disclosures",
    element: <DisclosuresPage />,
  },
  {
    path: "/team",
    element: <TeamPage />,
  },
  {
    path: "/terms-of-service",
    element: <TermsOfServicePage />,
  },
  {
    path: "/properties",
    element: <Properties />,
  },
  {
    path: "/social-security",
    element: <SocialSecurity />,
  },
  {
    path: "/professional-signup",
    element: <ProfessionalSignup />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
