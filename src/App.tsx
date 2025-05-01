
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import dashboardRoutes from './routes/dashboard-routes';
import { educationRoutes } from './routes/education-routes';
import { integrationRoutes } from './routes/integration-routes';
import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import AdvisorDashboard from './pages/AdvisorDashboard';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Advisor routes */}
        <Route path="/advisor" element={<AdvisorDashboard />} />
        
        {/* Include integration routes - must be spread, not directly included */}
        {integrationRoutes}
        
        {/* Include route groups */}
        {dashboardRoutes}
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
