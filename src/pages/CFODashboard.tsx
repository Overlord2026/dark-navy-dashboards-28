import React from 'react';
import { PersonaAnalyticsDashboard } from '@/components/analytics/PersonaAnalyticsDashboard';

const CFODashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-background to-navy">
      <div className="container mx-auto px-4 py-8">
        <PersonaAnalyticsDashboard />
      </div>
    </div>
  );
};

export default CFODashboard;