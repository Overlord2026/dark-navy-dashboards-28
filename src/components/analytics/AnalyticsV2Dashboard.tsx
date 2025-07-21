import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectAnalyticsV2 } from './ProjectAnalyticsV2';

export function AnalyticsV2Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics & Reporting</h1>
          <p className="text-muted-foreground">
            Real-time project performance metrics, team productivity analytics, and resource utilization insights
          </p>
        </div>
      </div>
      
      <ProjectAnalyticsV2 />
    </div>
  );
}