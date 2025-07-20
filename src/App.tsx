
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminRoute } from '@/components/auth/AdminRoute';

// Page imports - using existing pages from the current codebase
import LoginPage from '@/pages/LoginPage';
import { AdminPortal } from '@/pages/AdminPortal';
import { AdminSettings } from '@/pages/admin/AdminSettings';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <UserProvider>
            <Router>
              <div className="min-h-screen bg-background font-sans antialiased">
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/auth" element={<LoginPage />} />
                  
                  {/* Protected routes */}
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin-portal" element={
                    <AdminRoute roles={['admin', 'system_administrator', 'tenant_admin', 'superadmin']}>
                      <AdminPortal />
                    </AdminRoute>
                  } />
                  <Route path="/admin-portal/settings" element={
                    <AdminRoute roles={['admin', 'system_administrator', 'tenant_admin', 'superadmin']}>
                      <AdminSettings />
                    </AdminRoute>
                  } />
                </Routes>
                <Toaster />
                <Sonner />
              </div>
            </Router>
          </UserProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
