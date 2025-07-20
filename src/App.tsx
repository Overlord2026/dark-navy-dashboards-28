
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { ThemeProvider } from "@/components/ThemeProvider";
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { RouteTransition } from '@/components/animations/RouteTransition';
import { ErrorBoundary } from '@/components/ui/error-boundary';

// Page imports - using existing pages from the current codebase
import LoginPage from '@/pages/LoginPage';
import { AdminPortal } from '@/pages/AdminPortal';
import { AdminSettings } from '@/pages/admin/AdminSettings';

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/login" element={
          <ErrorBoundary>
            <RouteTransition>
              <LoginPage />
            </RouteTransition>
          </ErrorBoundary>
        } />
        <Route path="/auth" element={
          <ErrorBoundary>
            <RouteTransition>
              <LoginPage />
            </RouteTransition>
          </ErrorBoundary>
        } />
        
        {/* Protected routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Admin routes */}
        <Route path="/admin-portal" element={
          <ErrorBoundary>
            <AdminRoute roles={['admin', 'system_administrator', 'tenant_admin', 'superadmin']}>
              <RouteTransition>
                <AdminPortal />
              </RouteTransition>
            </AdminRoute>
          </ErrorBoundary>
        } />
        <Route path="/admin-portal/settings" element={
          <ErrorBoundary>
            <AdminRoute roles={['admin', 'system_administrator', 'tenant_admin', 'superadmin']}>
              <RouteTransition>
                <AdminSettings />
              </RouteTransition>
            </AdminRoute>
          </ErrorBoundary>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <AuthProvider>
              <ErrorBoundary>
                <UserProvider>
                  <ErrorBoundary>
                    <AnalyticsProvider>
                      <Router>
                        <div className="min-h-screen bg-background font-sans antialiased">
                          <AnimatedRoutes />
                          <Toaster />
                          <Sonner />
                        </div>
                      </Router>
                    </AnalyticsProvider>
                  </ErrorBoundary>
                </UserProvider>
              </ErrorBoundary>
            </AuthProvider>
          </ErrorBoundary>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
