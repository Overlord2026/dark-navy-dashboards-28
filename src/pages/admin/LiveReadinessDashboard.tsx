import React from 'react';
import { LiveReadinessCheck } from '@/components/admin/LiveReadinessCheck';

const LiveReadinessDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <LiveReadinessCheck />
      </div>
    </div>
  );
};

export default LiveReadinessDashboard;