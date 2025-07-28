import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { GoNoGoLaunchReport } from '@/components/qa/GoNoGoLaunchReport';

export function LaunchReportPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <GoNoGoLaunchReport />
      </div>
    </MainLayout>
  );
}