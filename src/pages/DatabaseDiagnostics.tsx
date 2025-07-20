import React from 'react';
import { DatabaseTestRunner } from '@/components/diagnostics/DatabaseTestRunner';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';

export default function DatabaseDiagnostics() {
  return (
    <ThreeColumnLayout 
      title="Database Diagnostics" 
      activeMainItem="diagnostics"
    >
      <DatabaseTestRunner />
    </ThreeColumnLayout>
  );
}