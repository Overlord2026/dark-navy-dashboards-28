import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "next-themes";
import { Toaster } from '@/components/ui/toaster';
import DevPanel from '@/components/dev/DevPanel';
import NILOnboarding from '@/pages/nil/Onboarding';
import Education from '@/pages/nil/Education';
import Disclosures from '@/pages/nil/Disclosures';
import Offers from '@/pages/nil/Offers';
import Marketplace from '@/pages/nil/Marketplace';
import Contract from '@/pages/nil/Contract';
import Payments from '@/pages/nil/Payments';
import Disputes from '@/pages/nil/Disputes';
import Receipts from '@/pages/nil/Receipts';
import Admin from '@/pages/nil/Admin';
import Pricing from '@/pages/Pricing';
import FixturesPanel from '@/pages/dev/FixturesPanel';
import Discover from '@/pages/Discover';
import { HowItWorks } from '@/pages/HowItWorks';
import Solutions from '@/pages/Solutions';
import { Annuities } from '@/pages/solutions/Annuities';
import { OnboardingFlow } from '@/pages/OnboardingFlow';
import { PUBLIC_CONFIG } from '@/config/publicConfig';
import QACoverage from '@/pages/admin/QACoverage';

const DemoPage = React.lazy(() => import('@/pages/demos/[persona]'));

function App() {
  // Check authentication status (simplified for demo)
  const isAuthenticated = typeof window !== 'undefined' && 
    (localStorage.getItem('user_session') || localStorage.getItem('auth_token'));

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/nil/onboarding" replace /> : 
            PUBLIC_CONFIG.DISCOVER_ENABLED ? <Navigate to="/discover" replace /> : 
            <Navigate to="/nil/onboarding" replace />
          } />
          {PUBLIC_CONFIG.DISCOVER_ENABLED && <Route path="/discover" element={<Discover />} />}
          <Route path="/how-it-works" element={<HowItWorks />} />
          {PUBLIC_CONFIG.SOLUTIONS_ENABLED && <Route path="/solutions" element={<Solutions />} />}
          {PUBLIC_CONFIG.SOLUTIONS_ENABLED && <Route path="/solutions/annuities" element={<Annuities />} />}
          <Route path="/onboarding" element={<OnboardingFlow />} />
          <Route path="/nil/onboarding" element={<NILOnboarding />} />
          <Route path="/nil/education" element={<Education />} />
          <Route path="/nil/disclosures" element={<Disclosures />} />
          <Route path="/nil/offers" element={<Offers />} />
          <Route path="/nil/marketplace" element={<Marketplace />} />
          <Route path="/nil/contract/:id" element={<Contract />} />
          <Route path="/nil/payments" element={<Payments />} />
          <Route path="/nil/disputes" element={<Disputes />} />
          <Route path="/nil/receipts" element={<Receipts />} />
          <Route path="/nil/admin" element={<Admin />} />
          <Route path="/admin/qa-coverage" element={<QACoverage />} />
          <Route path="/pricing" element={<Pricing />} />
          {PUBLIC_CONFIG.DEMOS_ENABLED && (
            <Route path="/demos/:persona" element={
              <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading demo...</div>}>
                <DemoPage />
              </Suspense>
            } />
          )}
          {/* Dev-only route */}
          {process.env.NODE_ENV !== 'production' && (
            <Route path="/dev/fixtures" element={<FixturesPanel />} />
          )}
        </Routes>
        <Toaster />
        <DevPanel />
      </div>
    </ThemeProvider>
  );
}

export default App;