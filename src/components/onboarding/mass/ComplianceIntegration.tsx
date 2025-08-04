import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  ExternalLink, 
  PlayCircle, 
  UserCheck,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const complianceChecklist = [
  { id: 1, name: 'Policy', status: 'completed', required: true },
  { id: 2, name: 'ADV', status: 'completed', required: true },
  { id: 3, name: 'AML', status: 'in-progress', required: true },
  { id: 4, name: 'U4', status: 'pending', required: true },
  { id: 5, name: 'IARD', status: 'pending', required: false },
  { id: 6, name: 'Continuing Ed', status: 'completed', required: false },
  { id: 7, name: 'KYC', status: 'in-progress', required: true }
];

export const ComplianceIntegration = () => {
  const navigate = useNavigate();

  const completedCount = complianceChecklist.filter(item => item.status === 'completed').length;
  const totalCount = complianceChecklist.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-700 border-green-500/20">Complete</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">In Progress</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Compliance Center Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Access */}
        <Button 
          onClick={() => navigate('/compliance-dashboard')}
          className="w-full flex items-center justify-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Go to Compliance Dashboard
        </Button>

        {/* Compliance Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Compliance Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedCount}/{totalCount} Complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Checklist Status */}
        <div>
          <h4 className="font-semibold mb-3">Checklist Status</h4>
          <div className="space-y-2">
            {complianceChecklist.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <span className="text-sm font-medium">{item.name}</span>
                  {item.required && (
                    <Badge variant="outline" className="text-xs">Required</Badge>
                  )}
                </div>
                {getStatusBadge(item.status)}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full flex items-center gap-2">
            <PlayCircle className="h-4 w-4" />
            Run Pre-Launch Audit
          </Button>
          
          <Button variant="outline" className="w-full flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Assign Compliance Officer
          </Button>
        </div>

        {/* Compliance Score */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{Math.round(progressPercentage)}%</div>
            <div className="text-sm text-muted-foreground">Compliance Ready</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};