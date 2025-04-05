import React, { lazy, Suspense } from "react";
import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

// Import route groups
import MainRoutes from "./routes/MainRoutes";
import FinanceRoutes from "./routes/FinanceRoutes";
import WealthRoutes from "./routes/WealthRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import AdvisorRoutes from "./routes/AdvisorRoutes";
import AdminRoutes from "./routes/AdminRoutes";

// Pages
const HomePage = lazy(() => import("./pages/HomePage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const BillPay = lazy(() => import("./pages/BillPay"));
const Properties = lazy(() => import("./pages/Properties"));
const IntegrationsManagement = lazy(() => import("./pages/IntegrationsManagement"));

// New Bill Inbox Page
const BillInbox = lazy(() => import("./pages/BillInbox"));

// Public pages
const AboutUsPage = lazy(() => import("./pages/AboutUsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));
const DisclosuresPage = lazy(() => import("./pages/DisclosuresPage"));
const AccessibilityPage = lazy(() => import("./pages/AccessibilityPage"));

// fallback component for lazy loading
const Fallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const AppRoutes: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        {/* Public Routes */}
        <Route element={<PublicRoutes />}>
          <Route
            index
            element={
              <Suspense fallback={<Fallback />}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="about"
            element={
              <Suspense fallback={<Fallback />}>
                <AboutUsPage />
              </Suspense>
            }
          />
          <Route
            path="contact"
            element={
              <Suspense fallback={<Fallback />}>
                <ContactPage />
              </Suspense>
            }
          />
          <Route
            path="services"
            element={
              <Suspense fallback={<Fallback />}>
                <ServicesPage />
              </Suspense>
            }
          />
          <Route
            path="team"
            element={
              <Suspense fallback={<Fallback />}>
                <TeamPage />
              </Suspense>
            }
          />
          <Route
            path="careers"
            element={
              <Suspense fallback={<Fallback />}>
                <CareersPage />
              </Suspense>
            }
          />
          <Route
            path="privacy"
            element={
              <Suspense fallback={<Fallback />}>
                <PrivacyPolicyPage />
              </Suspense>
            }
          />
          <Route
            path="terms"
            element={
              <Suspense fallback={<Fallback />}>
                <TermsOfServicePage />
              </Suspense>
            }
          />
          <Route
            path="disclosures"
            element={
              <Suspense fallback={<Fallback />}>
                <DisclosuresPage />
              </Suspense>
            }
          />
          <Route
            path="accessibility"
            element={
              <Suspense fallback={<Fallback />}>
                <AccessibilityPage />
              </Suspense>
            }
          />
          <Route
            path="login"
            element={
              <Suspense fallback={<Fallback />}>
                <LoginPage />
              </Suspense>
            }
          />
        </Route>

        {/* Main Routes */}
        <Route element={<MainRoutes />}>
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<Fallback />}>
                <Dashboard />
              </Suspense>
            }
          />

          {/* Finance Routes */}
          <Route path="finance/*" element={<FinanceRoutes />} />

          {/* Wealth Routes */}
          <Route path="wealth/*" element={<WealthRoutes />} />

          {/* Advisor Routes */}
          <Route path="advisor/*" element={<AdvisorRoutes />} />

          {/* Admin Routes */}
          <Route path="admin/*" element={<AdminRoutes />} />
        </Route>

        {/* 404 - Not Found */}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    )
  );

  return <>{router.routes}</>;
};

export default AppRoutes;
