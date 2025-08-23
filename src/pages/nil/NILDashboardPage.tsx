import React from 'react';
import { NILDashboard } from '@/components/nil/dashboards/NILDashboard';
import NILLayout from '@/components/nil/NILLayout';

export default function NILDashboardPage() {
  return (
    <NILLayout 
      title="NIL Dashboard" 
      description="Manage your NIL opportunities and compliance"
    >
      <NILDashboard persona="athlete" />
    </NILLayout>
  );
}