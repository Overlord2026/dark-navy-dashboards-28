import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, FileText, Upload, Calendar, DollarSign, BarChart3 } from 'lucide-react';

export function PracticeQuickActions() {
  const quickActions = [
    {
      label: 'Add Client',
      icon: UserPlus,
      description: 'Onboard new client',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      label: 'Start Proposal',
      icon: FileText,
      description: 'Create client proposal',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      label: 'Import Book',
      icon: Upload,
      description: 'Import client data',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      label: 'Schedule Review',
      icon: Calendar,
      description: 'Book client meeting',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      label: 'Create Invoice',
      icon: DollarSign,
      description: 'Generate billing',
      color: 'bg-emerald-500 hover:bg-emerald-600'
    },
    {
      label: 'View Analytics',
      icon: BarChart3,
      description: 'Practice insights',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Quick Actions</span>
          <span className="text-sm font-normal text-muted-foreground">
            Common practice management tasks
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto flex-col gap-2 p-4 hover:shadow-md transition-all"
              >
                <div className={`p-2 rounded-full text-white ${action.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{action.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {action.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}