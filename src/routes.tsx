import { createBrowserRouter } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import Accounts from "@/pages/Accounts";
import FinancialPlans from "@/pages/FinancialPlans";
import AIInsights from "@/pages/AIInsights";
import NotFound from "@/pages/NotFound";
import TaxPlanning from "@/pages/TaxPlanning";
import AdvisorDashboard from "@/pages/AdvisorDashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Subscription from "@/pages/Subscription";
import Diagnostics from "@/pages/Diagnostics";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminUsers from "@/pages/AdminUsers";
import AdminAdvisors from "@/pages/AdminAdvisors";
import AdminSettings from "@/pages/AdminSettings";
import AdminSubscriptions from "@/pages/AdminSubscriptions";
import AdminDiagnostics from "@/pages/AdminDiagnostics";
import AdminLogin from "@/pages/AdminLogin";
import AdminRegister from "@/pages/AdminRegister";
import Audience from "@/pages/Audience";

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
    path: "/ai-insights",
    element: <AIInsights />,
  },
  {
    path: "/profile",
    element: <Profile />,
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
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/subscription",
    element: <Subscription />,
  },
  {
    path: "/diagnostics",
    element: <Diagnostics />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/users",
    element: <AdminUsers />,
  },
  {
    path: "/admin/advisors",
    element: <AdminAdvisors />,
  },
  {
    path: "/admin/settings",
    element: <AdminSettings />,
  },
  {
    path: "/admin/subscriptions",
    element: <AdminSubscriptions />,
  },
  {
    path: "/admin/diagnostics",
    element: <AdminDiagnostics />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/register",
    element: <AdminRegister />,
  },
  {
    path: "/audience",
    element: <Audience />,
  },
  
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
