
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { ThemeProvider } from "@/components/theme-provider";
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminRoute } from '@/components/auth/AdminRoute';

// Page imports
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import ClientDashboard from '@/pages/ClientDashboard';
import AdvisorDashboard from '@/pages/AdvisorDashboard';
import Documents from '@/pages/Documents';
import Appointments from '@/pages/Appointments';
import Prescriptions from '@/pages/Prescriptions';
import HSAReimbursements from '@/pages/HSAReimbursements';
import Properties from '@/pages/Properties';
import Professionals from '@/pages/Professionals';
import FeeCalculator from '@/pages/FeeCalculator';
import HSAContributions from '@/pages/HSAContributions';
import HSAAccounts from '@/pages/HSAAccounts';
import PrivateEquity from '@/pages/PrivateEquity';
import EpigeneticTests from '@/pages/EpigeneticTests';
import HealthRecommendations from '@/pages/HealthRecommendations';
import FinancialPlanning from '@/pages/FinancialPlanning';
import UserBeneficiaries from '@/pages/UserBeneficiaries';
import UserTrusts from '@/pages/UserTrusts';
import Settings from '@/pages/Settings';
import InvestmentStrategies from '@/pages/InvestmentStrategies';
import EducationalContent from '@/pages/EducationalContent';
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
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  
                  {/* Protected routes */}
                  <Route path="/" element={<Navigate to="/client-dashboard" replace />} />
                  <Route path="/client-dashboard" element={
                    <ProtectedRoute>
                      <ClientDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/advisor-dashboard" element={
                    <ProtectedRoute>
                      <AdvisorDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/documents" element={
                    <ProtectedRoute>
                      <Documents />
                    </ProtectedRoute>
                  } />
                  <Route path="/appointments" element={
                    <ProtectedRoute>
                      <Appointments />
                    </ProtectedRoute>
                  } />
                  <Route path="/prescriptions" element={
                    <ProtectedRoute>
                      <Prescriptions />
                    </ProtectedRoute>
                  } />
                  <Route path="/hsa-reimbursements" element={
                    <ProtectedRoute>
                      <HSAReimbursements />
                    </ProtectedRoute>
                  } />
                  <Route path="/properties" element={
                    <ProtectedRoute>
                      <Properties />
                    </ProtectedRoute>
                  } />
                  <Route path="/professionals" element={
                    <ProtectedRoute>
                      <Professionals />
                    </ProtectedRoute>
                  } />
                  <Route path="/fee-calculator" element={
                    <ProtectedRoute>
                      <FeeCalculator />
                    </ProtectedRoute>
                  } />
                  <Route path="/hsa-contributions" element={
                    <ProtectedRoute>
                      <HSAContributions />
                    </ProtectedRoute>
                  } />
                  <Route path="/hsa-accounts" element={
                    <ProtectedRoute>
                      <HSAAccounts />
                    </ProtectedRoute>
                  } />
                  <Route path="/private-equity" element={
                    <ProtectedRoute>
                      <PrivateEquity />
                    </ProtectedRoute>
                  } />
                  <Route path="/epigenetic-tests" element={
                    <ProtectedRoute>
                      <EpigeneticTests />
                    </ProtectedRoute>
                  } />
                  <Route path="/health-recommendations" element={
                    <ProtectedRoute>
                      <HealthRecommendations />
                    </ProtectedRoute>
                  } />
                  <Route path="/financial-planning" element={
                    <ProtectedRoute>
                      <FinancialPlanning />
                    </ProtectedRoute>
                  } />
                  <Route path="/beneficiaries" element={
                    <ProtectedRoute>
                      <UserBeneficiaries />
                    </ProtectedRoute>
                  } />
                  <Route path="/trusts" element={
                    <ProtectedRoute>
                      <UserTrusts />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="/investment-strategies" element={
                    <ProtectedRoute>
                      <InvestmentStrategies />
                    </ProtectedRoute>
                  } />
                  <Route path="/educational-content" element={
                    <ProtectedRoute>
                      <EducationalContent />
                    </ProtectedRoute>
                  } />
                  
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
