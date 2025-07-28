import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { UATQAChecklist } from '@/components/qa/UATQAChecklist';

export function UATChecklistPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <UATQAChecklist />
      </div>
    </MainLayout>
  );
}