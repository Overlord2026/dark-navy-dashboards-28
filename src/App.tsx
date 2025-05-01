import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import dashboardRoutes from './routes/dashboard-routes';
import accountRoutes from './routes/account-routes';
import educationRoutes from './routes/education-routes';
import { integrationRoute } from './routes/index';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MobileHome from './pages/mobile/MobileHome';
import MobileAccounts from './pages/mobile/MobileAccounts';
import MobileSettings from './pages/mobile/MobileSettings';
import AdvisorDashboard from './pages/AdvisorDashboard';
import AdvisorLogin from './pages/AdvisorLogin';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        
        {/* Mobile routes */}
        <Route path="/mobile" element={<MobileHome />} />
        <Route path="/mobile/accounts" element={<MobileAccounts />} />
        <Route path="/mobile/settings" element={<MobileSettings />} />
        
        {/* Advisor routes */}
        <Route path="/advisor" element={<AdvisorDashboard />} />
        <Route path="/advisor/login" element={<AdvisorLogin />} />
        
        {/* Include integration route */}
        {integrationRoute}
        
        {/* Include route groups */}
        {dashboardRoutes}
        {accountRoutes}
        {educationRoutes}
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <SonnerToaster position="bottom-right" />
    </>
  );
}

export default App;
