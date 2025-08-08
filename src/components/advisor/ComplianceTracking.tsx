import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PremiumUpgradePrompt } from './PremiumUpgradePrompt';
import { 
  Shield, 
  Award, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  FileText,
  Crown,
  Plus,
  ExternalLink
} from 'lucide-react';

interface ComplianceTrackingProps {
  isPremium?: boolean;
}

export const ComplianceTracking: React.FC<ComplianceTrackingProps> = ({ isPremium = false }) => {
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (!isPremium) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="text-center">
            <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Compliance & CE Tracking</CardTitle>
            <CardDescription className="text-base">
              Automated compliance monitoring and continuing education management
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-background/50 rounded-lg">
                <Award className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">CE Credit Tracking</h3>
                <p className="text-sm text-muted-foreground">Automated logging and reminders</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Compliance Checklists</h3>
                <p className="text-sm text-muted-foreground">State and federal requirements</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Alert System</h3>
                <p className="text-sm text-muted-foreground">Proactive deadline monitoring</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowUpgrade(true)} 
              size="lg" 
              className="w-full md:w-auto"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
        
        {showUpgrade && (
          <PremiumUpgradePrompt 
            isOpen={showUpgrade}
            onClose={() => setShowUpgrade(false)}
            feature="Compliance & CE Tracking"
          />
        )}
      </div>
    );
  }

  const ceRecords = [
    {
      id: 1,
      course: 'Ethics in Financial Planning',
      provider: 'CFP Board',
      credits: 4,
      completed: '2024-01-10',
      expires: '2026-01-10',
      category: 'Ethics',
      status: 'completed'
    },
    {
      id: 2,
      course: 'Tax Planning Strategies 2024',
      provider: 'FPA',
      credits: 6,
      completed: '2023-12-15',
      expires: '2025-12-15',
      category: 'Tax Planning',
      status: 'completed'
    },
    {
      id: 3,
      course: 'Estate Planning Updates',
      provider: 'NAPFA',
      credits: 3,
      completed: '2023-11-20',
      expires: '2025-11-20',
      category: 'Estate Planning',
      status: 'expiring_soon'
    }
  ];

  const complianceItems = [
    {
      id: 1,
      requirement: 'Form ADV Update',
      dueDate: '2024-03-31',
      status: 'pending',
      description: 'Annual form ADV update required by SEC',
      priority: 'high'
    },
    {
      id: 2,
      requirement: 'State Registration Renewal',
      dueDate: '2024-02-28',
      status: 'completed',
      description: 'Annual state registration renewal for FL',
      priority: 'medium'
    },
    {
      id: 3,
      requirement: 'Client Privacy Policy Review',
      dueDate: '2024-06-30',
      status: 'pending',
      description: 'Annual review and update of privacy policies',
      priority: 'medium'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: 'default',
      pending: 'secondary',
      overdue: 'destructive',
      expiring_soon: 'outline'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'text-red-500',
      medium: 'text-yellow-500',
      low: 'text-green-500'
    };
    return colors[priority as keyof typeof colors];
  };

  const currentCredits = 28;
  const requiredCredits = 40;
  const progressPercentage = (currentCredits / requiredCredits) * 100;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{currentCredits}</div>
            <div className="text-sm text-muted-foreground">CE Credits Earned</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">Compliant States</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">2</div>
            <div className="text-sm text-muted-foreground">Pending Items</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">45</div>
            <div className="text-sm text-muted-foreground">Days to Deadline</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ce-tracking" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ce-tracking">CE Tracking</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="ce-tracking" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Continuing Education Progress</h3>
              <p className="text-sm text-muted-foreground">
                Current cycle: January 2024 - December 2025
              </p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add CE Credit
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Progress Toward Requirements
                <Badge variant="secondary">{currentCredits}/{requiredCredits} Credits</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progressPercentage} className="mb-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{currentCredits} credits completed</span>
                <span>{requiredCredits - currentCredits} credits remaining</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {ceRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{record.course}</h3>
                        <div className="text-sm text-muted-foreground">
                          {record.provider} • {record.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{record.credits}</div>
                        <div className="text-xs text-muted-foreground">Credits</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm">
                          Completed: {new Date(record.completed).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Expires: {new Date(record.expires).toLocaleDateString()}
                        </div>
                      </div>

                      {getStatusBadge(record.status)}

                      <Button size="sm" variant="ghost">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Compliance Requirements</h3>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Requirement
            </Button>
          </div>

          <div className="grid gap-4">
            {complianceItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.requirement}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className={`text-sm font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority.toUpperCase()}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          Due: {new Date(item.dueDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.ceil((new Date(item.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
                        </div>
                      </div>

                      {getStatusBadge(item.status)}

                      <Button size="sm" variant="ghost">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <h3 className="text-lg font-semibold">Upcoming Deadlines & Alerts</h3>
          
          <div className="grid gap-4">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-800">CE Credits Due Soon</h3>
                    <p className="text-sm text-yellow-700">
                      You need 12 more credits by December 31, 2024 to maintain compliance.
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    View Options
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-800">Form ADV Update Required</h3>
                    <p className="text-sm text-red-700">
                      Annual Form ADV update due March 31, 2024. 45 days remaining.
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Start Update
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-800">State Registration Renewed</h3>
                    <p className="text-sm text-green-700">
                      Florida state registration has been successfully renewed for 2024.
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    View Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};