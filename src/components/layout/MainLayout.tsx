
import React from 'react';
import { Header } from './Header';
import { GlobalErrorBoundary } from '@/components/monitoring/GlobalErrorBoundary';
import { PerformanceMonitor } from '@/components/monitoring/PerformanceMonitor';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <GlobalErrorBoundary showDetailedError={process.env.NODE_ENV === 'development'}>
      <PerformanceMonitor />
      <div className="min-h-screen bg-background">
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
