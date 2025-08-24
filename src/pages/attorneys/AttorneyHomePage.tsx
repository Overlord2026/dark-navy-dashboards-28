import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  UserPlus, 
  Calendar,
  Shield,
  Scale,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Gavel
} from 'lucide-react';
import { recordReceipt } from '@/features/receipts/record';
import { toast } from 'sonner';

export default function AttorneyHomePage() {
  const [stats] = useState({
    activeMatter: 12,
    conflictChecks: 3,
    pendingAuthorizations: 2,
    upcomingDeadlines: 8
  });

  const quickActions = [
    {
      title: 'New Client',
      description: 'Run conflict check & intake',
      icon: UserPlus,
      action: () => handleQuickAction('new_client'),
      variant: 'default' as const
    },
    {
      title: 'Conflict Check',
      description: 'Search conflicts database',
      icon: Shield,
      action: () => handleQuickAction('conflict_check'),
      variant: 'secondary' as const
    },
    {
      title: 'Matter Checklist',
      description: 'Track case progress',
      icon: FileText,
      action: () => handleQuickAction('matter_checklist'),
      variant: 'secondary' as const
    },
    {
      title: 'Authority Verification',
      description: 'Proof-of-Authority QR',
      icon: Scale,
      action: () => handleQuickAction('authority_verification'),
      variant: 'secondary' as const
    },
    {
      title: 'Vault Export',
      description: 'Generate case binder',
      icon: Gavel,
      action: () => handleQuickAction('vault_export'),
      variant: 'outline' as const
    }
  ];

  const handleQuickAction = async (action: string) => {
    const actionMapping = {
      new_client: 'client_intake_initiated',
      conflict_check: 'conflict_search_executed',
      matter_checklist: 'matter_progress_reviewed',
      authority_verification: 'authority_verification_requested',
      vault_export: 'case_binder_generated'
    };

    try {
      recordReceipt({
        id: `attorney_${action}_${Date.now()}`,
        type: 'Decision-RDS',
        policy_version: 'A-2025.01',
        inputs_hash: `sha256:${action}`,
        result: 'approve',
        reasons: [actionMapping[action as keyof typeof actionMapping]],
        created_at: new Date().toISOString()
      });

      toast.success(`${action.replace('_', ' ')} initiated with privilege protection`);
    } catch (error) {
      toast.error('Failed to record action');
    }
  };

  const recentMatters = [
    {
      id: 'M001',
      title: 'Estate Planning - Johnson Family',
      status: 'Draft',
      priority: 'High',
      deadline: '2024-02-15',
      privilegeLevel: 'Attorney-Client'
    },
    {
      id: 'M002', 
      title: 'Business Formation - Tech Startup',
      status: 'Execute',
      priority: 'Medium',
      deadline: '2024-02-20',
      privilegeLevel: 'Attorney-Client'
    },
    {
      id: 'M003',
      title: 'Contract Review - Acquisition',
      status: 'Record',
      priority: 'High',
      deadline: '2024-02-10',
      privilegeLevel: 'Work Product'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'Execute': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'Record': return 'bg-green-500/10 text-green-700 border-green-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500/10 text-red-700 border-red-200';
      case 'Medium': return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case 'Low': return 'bg-green-500/10 text-green-700 border-green-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attorney Dashboard</h1>
          <p className="text-muted-foreground">
            Manage matters, conflicts, and client authorizations with privilege protection
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Shield className="h-4 w-4 mr-1" />
          Privilege Protected
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{stats.activeMatter}</p>
              <p className="text-sm text-muted-foreground">Active Matters</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <Shield className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{stats.conflictChecks}</p>
              <p className="text-sm text-muted-foreground">Pending Conflicts</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <Scale className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{stats.pendingAuthorizations}</p>
              <p className="text-sm text-muted-foreground">Pending Auth</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <Clock className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{stats.upcomingDeadlines}</p>
              <p className="text-sm text-muted-foreground">Upcoming Deadlines</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant={action.variant}
                  onClick={action.action}
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <Icon className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs opacity-70">{action.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Matters */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Matters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMatters.map((matter) => (
              <div key={matter.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">{matter.title}</div>
                  <div className="text-sm text-muted-foreground">Matter #{matter.id}</div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(matter.status)}>
                      {matter.status}
                    </Badge>
                    <Badge className={getPriorityColor(matter.priority)}>
                      {matter.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {matter.privilegeLevel}
                    </Badge>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm font-medium">Due: {matter.deadline}</div>
                  <div className="flex items-center space-x-1">
                    {matter.priority === 'High' ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}