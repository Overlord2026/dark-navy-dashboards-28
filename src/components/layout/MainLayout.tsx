
import React from 'react';
import { Header } from './Header';
import { GlobalErrorBoundary } from '@/components/monitoring/GlobalErrorBoundary';
import { PerformanceMonitor } from '@/components/monitoring/PerformanceMonitor';
import { BFOBrandBanner, BFOCornerBug } from '@/components/branding/BFOBrandBanner';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <GlobalErrorBoundary showDetailedError={process.env.NODE_ENV === 'development'}>
      <PerformanceMonitor />
      <div className="min-h-screen bg-background">
        <BFOBrandBanner
          wordmarkSrc="/brand/bfo-wordmark-horizontal.png"
          emblemSrc="/brand/bfo-emblem-gold.png"
          cta={{ label: "Get Started", to: "/get-started" }}
          announcements={[
            { id: "launch", text: "Marketplace preview is live →", to: "/marketplace", emphasize: true },
          ]}
          sublinks={[
            { label: "Notes", to: "/workspace/notes" },
            { label: "Recommendations", to: "/workspace/recommendations" },
            { label: "Dashboards", to: "/client-dashboard" },
            { label: "Calculators", to: "/calculators" },
            { label: "Studies", to: "/studies" },
          ]}
        />
        <BFOCornerBug position="bottom-right" />
        <GlobalErrorBoundary>
          <Header />
        </GlobalErrorBoundary>
        <main>
          <GlobalErrorBoundary>
            {children}
          </GlobalErrorBoundary>
        </main>
      </div>
    </GlobalErrorBoundary>
  );
}
