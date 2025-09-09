
import React from 'react';
import GlobalErrorBoundary from '@/components/monitoring/GlobalErrorBoundary';
import { PerformanceMonitor } from '@/components/monitoring/PerformanceMonitor';
import { BFOBrandBanner, BFOCornerBug } from '@/components/branding/BFOBrandBanner';
import { usePersonaSublinks } from '@/hooks/usePersonaSublinks';
import { getStartedRoute } from '@/utils/getStartedUtils';
import { LegalBar } from '@/components/layout/LegalBar';
import { useAuth } from '@/context/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const sublinks = usePersonaSublinks();
  const { user } = useAuth();
  
  return (
    <GlobalErrorBoundary>
      <PerformanceMonitor />
      <div className="page-surface">
        <BFOBrandBanner
          wordmarkSrc="/brand/bfo-wordmark-horizontal.png"
          emblemSrc="/brand/bfo-emblem-gold.png"
          cta={{ label: "Get Started", to: getStartedRoute() }}
          announcements={[
            { id: "launch", text: "Marketplace preview is live →", to: "/marketplace", emphasize: true },
          ]}
          sublinks={sublinks}
        />
        <BFOCornerBug position="bottom-right" />
        <main style={{ paddingBottom: user ? '80px' : '0' }}>
          <GlobalErrorBoundary>
            {children}
          </GlobalErrorBoundary>
        </main>
        {user && <LegalBar />}
      </div>
    </GlobalErrorBoundary>
  );
}
