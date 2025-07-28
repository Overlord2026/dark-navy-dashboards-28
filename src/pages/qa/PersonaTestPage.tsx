import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PersonaTestHarness } from '@/components/qa/PersonaTestHarness';

export function PersonaTestPage() {
  return (
    <MainLayout>
      <PersonaTestHarness />
    </MainLayout>
  );
}