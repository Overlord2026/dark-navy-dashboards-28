import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import DevPanel from '@/components/dev/DevPanel';
import CTAStickyBar from '@/components/ui/CTAStickyBar';
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
import NilReadyCheckPage from '@/pages/nil/admin/NilReadyCheckPage';
import Pricing from '@/pages/Pricing';
import FixturesPanel from '@/pages/dev/FixturesPanel';
import Discover from '@/pages/Discover';
import { HowItWorks } from '@/pages/HowItWorks';
import Solutions from '@/pages/Solutions';
import { Annuities } from '@/pages/solutions/Annuities';
import { OnboardingFlow } from '@/pages/OnboardingFlow';
import QACoverage from '@/pages/admin/QACoverage';
import ReadyCheck from '@/pages/admin/ReadyCheck';
import PublishPanel from '@/pages/admin/PublishPanel';
import NotFound from '@/pages/NotFound';
import { getFlag } from '@/lib/flags';

// Onboarding Components
import FamilyOnboarding from '@/pages/onboarding/FamilyOnboarding';
import ProfessionalOnboarding from '@/pages/onboarding/ProfessionalOnboarding';
import HealthcareOnboarding from '@/pages/onboarding/HealthcareOnboarding';
import NILOnboardingFlow from '@/pages/onboarding/NILOnboarding';

const DemoPage = React.lazy(() => import('@/pages/demos/[persona]'));
// Import FamilyHome directly for now to fix TypeScript error
import { FamilyHome } from '@/pages/family/FamilyHome';

function App() {
  // Check authentication status (simplified for demo)
  const isAuthenticated = typeof window !== 'undefined' && 
    (localStorage.getItem('user_session') || localStorage.getItem('auth_token'));

  return (
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={
              isAuthenticated ? <Navigate to="/family/home" replace /> : 
              getFlag('PUBLIC_DISCOVER_ENABLED') ? <Navigate to="/discover" replace /> : 
              <Navigate to="/nil/onboarding" replace />
            } />
            
            {/* Public Pages - Flag Protected */}
            {getFlag('PUBLIC_DISCOVER_ENABLED') && <Route path="/discover" element={<Discover />} />}
            <Route path="/how-it-works" element={<HowItWorks />} />
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions" element={<Solutions />} />}
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions/annuities" element={<Annuities />} />}
            
            {/* NIL Public Pages */}
            {getFlag('NIL_PUBLIC_ENABLED') && <Route path="/nil" element={<Marketplace />} />}
            {getFlag('NIL_PUBLIC_ENABLED') && <Route path="/nil/index" element={<Marketplace />} />}
            
            
            {/* Onboarding Routes - Flag Protected */}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/families" element={<FamilyOnboarding />} />}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/advisors" element={<ProfessionalOnboarding professionalType="advisors" />} />}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/cpas" element={<ProfessionalOnboarding professionalType="cpas" />} />}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/attorneys" element={<ProfessionalOnboarding professionalType="attorneys" />} />}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/realtor" element={<ProfessionalOnboarding professionalType="realtor" />} />}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/insurance" element={<ProfessionalOnboarding professionalType="advisors" />} />}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/healthcare" element={<HealthcareOnboarding segment="providers" />} />}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/nil-athlete" element={<NILOnboardingFlow type="athlete" />} />}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/nil-school" element={<NILOnboardingFlow type="school" />} />}
            
            {/* Family App Routes (Authenticated) */}
            <Route path="/family/home" element={<FamilyHome />} />
            
            {/* Private App Routes */}
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
            <Route path="/nil/admin/ready-check" element={<NilReadyCheckPage />} />
            <Route path="/pricing" element={<Pricing />} />
            
            
            {/* Admin Routes - Flag Protected */}
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/qa-coverage" element={<QACoverage />} />}
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/ready-check" element={<ReadyCheck />} />}
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/publish" element={<PublishPanel />} />}
            
            {/* Demo Routes */}
            {getFlag('DEMOS_ENABLED') && (
              <Route path="/demos/:persona" element={
                <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading demo...</div>}>
                  <DemoPage />
                </Suspense>
              } />
            )}
            
            {/* Dev Routes */}
            {process.env.NODE_ENV !== 'production' && (
              <Route path="/dev/fixtures" element={<FixturesPanel />} />
            )}
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <Toaster />
          <DevPanel />
          
          
          {/* Show CTA bar on public pages only - Flag Protected */}
          {!isAuthenticated && getFlag('PUBLIC_CTA_BAR') && <CTAStickyBar />}
        </div>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;