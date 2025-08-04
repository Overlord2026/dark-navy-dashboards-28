import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Upload, 
  FileCheck, 
  Calendar, 
  Download,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface OnboardingProgressDashboardProps {
  currentStep: number;
}

const mockTasks = [
  { id: 1, name: 'Upload Client Data', status: 'completed', date: '2024-01-15' },
  { id: 2, name: 'Field Mapping', status: 'in-progress', date: '2024-01-16' },
  { id: 3, name: 'Compliance Review', status: 'pending', date: '2024-01-17' },
  { id: 4, name: 'E-Sign Collection', status: 'pending', date: '2024-01-18' }
];

const complianceTasks = [
  { id: 1, name: 'ADV Uploaded', status: 'completed' },
  { id: 2, name: 'AML Cleared', status: 'in-progress' },
  { id: 3, name: 'Policy Signed', status: 'pending' },
  { id: 4, name: 'U4 Filed', status: 'pending' }
];

export const OnboardingProgressDashboard = ({ currentStep }: OnboardingProgressDashboardProps) => {
  const overallProgress = (currentStep / 7) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-700 border-green-500/20">Completed</Badge>;
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
          <Activity className="h-5 w-5 text-primary" />
          Onboarding Dashboard: Real-Time Progress Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </div>

        {/* Timeline View */}
        <div>
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Timeline View
          </h4>
          <div className="space-y-3">
            {mockTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(task.status)}
                  <div>
                    <span className="font-medium">{task.name}</span>
                    <p className="text-sm text-muted-foreground">Due: {task.date}</p>
                  </div>
                </div>
                {getStatusBadge(task.status)}
              </div>
            ))}
          </div>
        </div>

        {/* File Upload Status */}
        <div>
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Upload className="h-4 w-4" />
            File Upload Status
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">47</div>
              <div className="text-sm text-muted-foreground">Files Uploaded</div>
            </div>
            <div className="p-3 border rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <div className="text-sm text-muted-foreground">Processing</div>
            </div>
            <div className="p-3 border rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">2</div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
          </div>
        </div>

        {/* Compliance Tasks */}
        <div>
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Compliance Tasks
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {complianceTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(task.status)}
                  <span className="text-sm font-medium">{task.name}</span>
                </div>
                {getStatusBadge(task.status)}
              </div>
            ))}
          </div>
        </div>

        {/* Key Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
          <div>
            <div className="font-medium text-sm text-muted-foreground">Custodian Account Opened</div>
            <div className="font-semibold">January 20, 2024</div>
          </div>
          <div>
            <div className="font-medium text-sm text-muted-foreground">Client Portal Live</div>
            <div className="font-semibold">January 25, 2024</div>
          </div>
        </div>

        {/* Download Reports */}
        <div className="flex gap-4">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Onboarding Progress Report
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Compliance Status Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};