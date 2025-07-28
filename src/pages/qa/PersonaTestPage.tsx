import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PersonaTestHarness } from '@/components/qa/PersonaTestHarness';
import { PersonaQATestRunner } from '@/components/qa/PersonaQATestRunner';

export function PersonaTestPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <PersonaQATestRunner />
        <PersonaTestHarness />
      </div>
    </MainLayout>
  );
}