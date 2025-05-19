
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { UserProvider } from "@/context/UserContext";
import { AuthProvider } from "@/context/SupabaseAuthContext";
import { Toaster } from "sonner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Lazy load pages
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const CustomerProfile = lazy(() => import("@/pages/CustomerProfile"));
const AdvisorProfile = lazy(() => import("@/pages/AdvisorProfile"));
const Documents = lazy(() => import("@/pages/Documents"));
const Billing = lazy(() => import("@/pages/Billing"));
const Settings = lazy(() => import("@/pages/Settings"));
const Auth = lazy(() => import("@/pages/Auth"));
const Landing = lazy(() => import("@/pages/Landing"));
const IntegrationHub = lazy(() => import("@/pages/IntegrationHub"));
const LegacyVault = lazy(() => import("@/pages/LegacyVault"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <UserProvider>
          <Suspense fallback={
            <div className="h-screen w-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
          }>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<CustomerProfile />} />
                  <Route path="/advisor-profile" element={<AdvisorProfile />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/integration" element={<IntegrationHub />} />
                  <Route path="/legacy-vault" element={<LegacyVault />} />
                </Route>
                
                {/* Fallbacks */}
                <Route path="/home" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </Suspense>
          
          <Toaster position="top-right" />
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
