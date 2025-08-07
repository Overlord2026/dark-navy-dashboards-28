import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NILAnalyticsDashboard from '@/components/analytics/NILAnalyticsDashboard';
import { Trophy, Download, Settings } from 'lucide-react';

const NILAdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">NIL Platform Administration</h1>
          <p className="text-muted-foreground">Manage the NIL Education Platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Platform Settings
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              View NIL Landing Page
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Manage Course Content
            </Button>
            <Button variant="outline" className="w-full justify-start">
              School Partnerships
            </Button>
          </CardContent>
        </Card>
      </div>

      <NILAnalyticsDashboard />
    </div>
  );
};

export default NILAdminDashboard;