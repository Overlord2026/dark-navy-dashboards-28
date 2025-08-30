import React from 'react';
import { Outlet } from 'react-router-dom';
import BrandHeader from './BrandHeader';
import TopNav from './TopNav';
import { AccordionSidebar } from '@/components/navigation/NewAccordionSidebar';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useTheme } from "@/context/ThemeContext";

export function DashboardLayout() {

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background flex w-full">
        {/* New Accordion Sidebar with mobile responsiveness */}
        <AccordionSidebar />
        
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header for desktop only - mobile header is in sidebar */}
          <div className="hidden lg:block">
            <ErrorBoundary>
              <BrandHeader />
              <TopNav />
            </ErrorBoundary>
          </div>
          
          <main className="flex-1 p-3 sm:p-4 lg:p-6 min-h-0 pt-[96px]">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}