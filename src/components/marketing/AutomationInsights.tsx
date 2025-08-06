import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Users,
  Mail,
  Target,
  Zap
} from 'lucide-react';

const automatedTasks = [
  {
    name: 'Contact Deduplication',
    description: 'Automatically removes duplicate contacts on CSV upload',
    status: 'active',
    efficiency: 95,
    savedTime: '2.5 hours/week'
  },
  {
    name: 'Email Validation',
    description: 'Validates email addresses using Hunter.io API',
    status: 'active',
    efficiency: 88,
    savedTime: '1.8 hours/week'
  },
  {
    name: 'Persona Assignment',
    description: 'Auto-assigns contacts to personas based on job titles',
    status: 'active',
    efficiency: 82,
    savedTime: '3.2 hours/week'
  },
  {
    name: 'Campaign Scheduling',
    description: 'Schedules and sends campaigns based on optimal timing',
    status: 'active',
    efficiency: 92,
    savedTime: '4.1 hours/week'
  },
  {
    name: 'Bounce Management',
    description: 'Automatically handles email bounces and retries',
    status: 'active',
    efficiency: 78,
    savedTime: '1.5 hours/week'
  }
];

const manualTasks = [
  {
    name: 'VIP Contact Review',
    description: 'Manual review of high-priority contacts',
    avgTime: '15 min per contact',
    frequency: '5-8 contacts/week',
    importance: 'critical'
  },
  {
    name: 'Custom Message Crafting',
    description: 'Personalized messages for ultra-VIP contacts',
    avgTime: '20 min per message',
    frequency: '2-3 messages/week',
    importance: 'high'
  },
  {
    name: 'Data Quality Checks',
    description: 'Review flagged contacts for accuracy',
    avgTime: '5 min per contact',
    frequency: '10-15 contacts/week',
    importance: 'medium'
  },
  {
    name: 'Campaign Performance Analysis',
    description: 'Weekly analysis and optimization recommendations',
    avgTime: '45 min',
    frequency: 'Weekly',
    importance: 'high'
  }
];

const weeklyMetrics = {
  totalContacts: 1247,
  automatedActions: 956,
  manualActions: 42,
  timeSaved: 13.1,
  efficiency: 89
};

export default function AutomationInsights() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Automation Rate</p>
                <p className="text-2xl font-bold">{weeklyMetrics.efficiency}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Time Saved</p>
                <p className="text-2xl font-bold">{weeklyMetrics.timeSaved}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Auto Actions</p>
                <p className="text-2xl font-bold">{weeklyMetrics.automatedActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Manual Tasks</p>
                <p className="text-2xl font-bold">{weeklyMetrics.manualActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="automated" className="space-y-4">
        <TabsList>
          <TabsTrigger value="automated">Automated Tasks</TabsTrigger>
          <TabsTrigger value="manual">Manual Tasks</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="automated" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automated System Tasks</CardTitle>
              <CardDescription>
                Tasks handled automatically by the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {automatedTasks.map((task, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <h4 className="font-semibold">{task.name}</h4>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{task.savedTime}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Efficiency</span>
                        <span>{task.efficiency}%</span>
                      </div>
                      <Progress value={task.efficiency} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Staff Tasks</CardTitle>
              <CardDescription>
                Tasks requiring human review and intervention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {manualTasks.map((task, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{task.name}</h4>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <Badge variant={getImportanceColor(task.importance) as any}>
                      {task.importance}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Average Time:</span> {task.avgTime}
                    </div>
                    <div>
                      <span className="font-medium">Frequency:</span> {task.frequency}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Opportunities</CardTitle>
              <CardDescription>
                Areas where automation can be improved
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">LinkedIn Auto-Enrichment</h4>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                  Implement LinkedIn API integration to automatically find missing LinkedIn profiles
                </p>
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  Potential time savings: 2.3 hours/week
                </div>
              </div>

              <div className="border rounded-lg p-4 border-green-200 bg-green-50 dark:bg-green-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-900 dark:text-green-100">Smart VIP Detection</h4>
                </div>
                <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                  Use AI to automatically flag potential VIP contacts based on company size and role
                </p>
                <div className="text-xs text-green-700 dark:text-green-300">
                  Potential time savings: 1.8 hours/week
                </div>
              </div>

              <div className="border rounded-lg p-4 border-purple-200 bg-purple-50 dark:bg-purple-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100">Smart Send Timing</h4>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
                  Optimize send times based on recipient time zones and engagement patterns
                </p>
                <div className="text-xs text-purple-700 dark:text-purple-300">
                  Potential improvement: 15% higher open rates
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}