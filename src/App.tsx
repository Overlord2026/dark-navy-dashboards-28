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

// Page imports
import { AuthPage } from '@/pages/AuthPage';
import { HomePage } from '@/pages/HomePage';
import { AdminPortal } from '@/pages/AdminPortal';
import { AdminSettings } from '@/pages/admin/AdminSettings';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AdminFAQs } from '@/pages/admin/AdminFAQs';
import { AdminAnalytics } from '@/pages/admin/AdminAnalytics';
import { AdminCompliance } from '@/pages/admin/AdminCompliance';
import { AdminSystemHealth } from '@/pages/admin/AdminSystemHealth';
import { AdminEdgeFunctions } from '@/pages/admin/AdminEdgeFunctions';
import InviteRedeem from '@/pages/InviteRedeem';
import { AdvisorInviteRedeem } from '@/pages/AdvisorInviteRedeem';

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Auth route */}
        <Route path="/auth" element={
          <ErrorBoundary>
            <RouteTransition>
              <AuthPage />
            </RouteTransition>
          </ErrorBoundary>
        } />
        
        {/* Invite routes */}
        <Route path="/invite/:token" element={
          <ErrorBoundary>
            <RouteTransition>
              <InviteRedeem />
            </RouteTransition>
          </ErrorBoundary>
        } />
        <Route path="/advisor-invite/:token" element={
          <ErrorBoundary>
            <RouteTransition>
              <AdvisorInviteRedeem />
            </RouteTransition>
          </ErrorBoundary>
        } />
        
        {/* Protected main route */}
        <Route path="/" element={
          <ErrorBoundary>
            <ProtectedRoute>
              <RouteTransition>
                <HomePage />
              </RouteTransition>
            </ProtectedRoute>
          </ErrorBoundary>
        } />
        
        {/* Legacy login routes - redirect to auth */}
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        
        {/* Admin routes */}
        <Route path="/admin-portal" element={
          <ErrorBoundary>
            <ProtectedRoute>
              <AdminRoute roles={['admin', 'system_administrator', 'tenant_admin', 'superadmin']}>
                <RouteTransition>
                  <AdminPortal />
                </RouteTransition>
              </AdminRoute>
            </ProtectedRoute>
          </ErrorBoundary>
        } />
        <Route path="/admin-portal/settings" element={
          <ErrorBoundary>
            <ProtectedRoute>
              <AdminRoute roles={['admin', 'system_administrator', 'tenant_admin', 'superadmin']}>
                <RouteTransition>
                  <AdminSettings />
                </RouteTransition>
              </AdminRoute>
            </ProtectedRoute>
          </ErrorBoundary>
        } />
        <Route path="/admin-portal/users" element={
          <ErrorBoundary>
            <ProtectedRoute>
              <AdminRoute roles={['admin', 'system_administrator', 'tenant_admin', 'superadmin']}>
                <RouteTransition>
                  <AdminUsers />
                </RouteTransition>
              </AdminRoute>
            </ProtectedRoute>
          </ErrorBoundary>
        } />
        <Route path="/admin-portal/faqs" element={
          <ErrorBoundary>
            <ProtectedRoute>
              <AdminRoute roles={['admin', 'system_administrator', 'tenant_admin', 'superadmin']}>
                <RouteTransition>
                  <AdminFAQs />
                </RouteTransition>
              </AdminRoute>
            </ProtectedRoute>
          </ErrorBoundary>
        } />
        <Route path="/admin-portal/analytics" element={
          <ErrorBoundary>
            <ProtectedRoute>
              <AdminRoute roles={['admin', 'system_administrator', 'tenant_admin', 'superadmin']}>
                <RouteTransition>
                  <AdminAnalytics />
                </RouteTransition>
              </AdminRoute>
            </ProtectedRoute>
          </ErrorBoundary>
        } />
        <Route path="/admin-portal/compliance" element={
          <ErrorBoundary>
            <ProtectedRoute>
              <AdminRoute roles={['admin', 'system_administrator', 'tenant_admin', 'superadmin']}>
                <RouteTransition>
                  <AdminCompliance />
                </RouteTransition>
              </AdminRoute>
            </ProtectedRoute>
          </ErrorBoundary>
        } />
        <Route path="/admin-portal/system-health" element={
          <ErrorBoundary>
            <ProtectedRoute>
              <AdminRoute roles={['admin', 'system_administrator', 'tenant_admin', 'superadmin']}>
                <RouteTransition>
                  <AdminSystemHealth />
                </RouteTransition>
              </AdminRoute>
            </ProtectedRoute>
          </ErrorBoundary>
        } />
        <Route path="/admin-portal/edge-functions" element={
          <ErrorBoundary>
            <ProtectedRoute>
              <AdminRoute roles={['admin', 'system_administrator', 'tenant_admin', 'superadmin']}>
                <RouteTransition>
                  <AdminEdgeFunctions />
                </RouteTransition>
              </AdminRoute>
            </ProtectedRoute>
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
