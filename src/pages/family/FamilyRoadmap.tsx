import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Target, 
  TrendingUp, 
  FileText, 
  Download, 
  Share,
  Lock,
  Shield,
  Plane,
  Heart,
  Home,
  CreditCard,
  Receipt,
  Bell,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import FamilyRoadmapBucketList from '@/components/family/roadmap/FamilyRoadmapBucketList';
import FamilyRoadmapGoals from '@/components/family/roadmap/FamilyRoadmapGoals';
import FamilyRoadmapTransactions from '@/components/family/roadmap/FamilyRoadmapTransactions';
import FamilyRoadmapVault from '@/components/family/roadmap/FamilyRoadmapVault';
import FamilyRoadmapReceipts from '@/components/family/roadmap/FamilyRoadmapReceipts';
import LoadRetireeDemoButton from '@/components/demos/LoadRetireeDemoButton';

export default function FamilyRoadmap() {
  const [isAuthenticated] = useState(false); // Demo state
  const [currentTab, setCurrentTab] = useState('overview');

  const handleRestrictedAction = (action: string) => {
    toast.error(`${action} requires login and premium plan`, {
      description: 'Sign up to unlock all roadmap features'
    });
  };

  const progressRings = [
    { label: 'Retirement Readiness', value: 78, color: 'text-emerald-500' },
    { label: 'Healthcare Planning', value: 65, color: 'text-blue-500' },
    { label: 'Estate Organization', value: 82, color: 'text-purple-500' },
    { label: 'Tax Optimization', value: 71, color: 'text-orange-500' }
  ];

  const quickTasks = [
    { id: 1, text: 'Review Q4 RMD requirements', priority: 'high', completed: false },
    { id: 2, text: 'Schedule annual health screenings', priority: 'medium', completed: true },
    { id: 3, text: 'Update beneficiaries on 401k', priority: 'high', completed: false },
    { id: 4, text: 'Review Medicare supplement options', priority: 'low', completed: false }
  ];

  const reminders = [
    { text: 'Medicare open enrollment ends Dec 7', date: '2024-12-07', type: 'deadline' },
    { text: 'Social Security increase effective Jan 1', date: '2025-01-01', type: 'info' },
    { text: 'Annual wellness visit due', date: '2024-12-15', type: 'health' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header with Demo Loader */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Family Roadmap</h1>
            <p className="text-muted-foreground">Comprehensive retirement planning dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <LoadRetireeDemoButton />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleRestrictedAction('Export')}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export
              <Lock className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Retirement Progress</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {progressRings.map((ring, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="relative w-20 h-20 mx-auto">
                  <Progress 
                    value={ring.value} 
                    className="w-full h-2 [&>div]:bg-current"
                    style={{ transform: 'rotate(-90deg)' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-lg font-bold ${ring.color}`}>
                      {ring.value}%
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium">{ring.label}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid grid-cols-5 w-full mb-6">
                <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                <TabsTrigger value="bucket-list" className="text-xs">Bucket List</TabsTrigger>
                <TabsTrigger value="goals" className="text-xs">Goals</TabsTrigger>
                <TabsTrigger value="transactions" className="text-xs">Spending</TabsTrigger>
                <TabsTrigger value="vault" className="text-xs">Vault</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Plane className="h-5 w-5 text-blue-500" />
                      Upcoming Adventures
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">European River Cruise</p>
                          <p className="text-sm text-muted-foreground">Spring 2025</p>
                        </div>
                        <Badge variant="outline">$8,500</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">Visit Grandkids</p>
                          <p className="text-sm text-muted-foreground">Summer 2025</p>
                        </div>
                        <Badge variant="outline">$3,200</Badge>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-emerald-500" />
                      Key Goals Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Income Replacement</span>
                        <div className="flex items-center gap-2">
                          <Progress value={85} className="w-16 h-2" />
                          <span className="text-sm font-medium">85%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">RMD Planning</span>
                        <div className="flex items-center gap-2">
                          <Progress value={92} className="w-16 h-2" />
                          <span className="text-sm font-medium">92%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Healthcare Coverage</span>
                        <div className="flex items-center gap-2">
                          <Progress value={78} className="w-16 h-2" />
                          <span className="text-sm font-medium">78%</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                <FamilyRoadmapReceipts />
              </TabsContent>

              <TabsContent value="bucket-list">
                <FamilyRoadmapBucketList />
              </TabsContent>

              <TabsContent value="goals">
                <FamilyRoadmapGoals />
              </TabsContent>

              <TabsContent value="transactions">
                <FamilyRoadmapTransactions />
              </TabsContent>

              <TabsContent value="vault">
                <FamilyRoadmapVault />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Tasks */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                Quick Tasks
              </h3>
              <div className="space-y-3">
                {quickTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <input 
                      type="checkbox" 
                      checked={task.completed}
                      onChange={() => handleRestrictedAction('Task completion')}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.text}
                      </p>
                      <Badge 
                        variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Reminders */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                Upcoming Reminders
              </h3>
              <div className="space-y-3">
                {reminders.map((reminder, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    {reminder.type === 'deadline' && <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />}
                    {reminder.type === 'info' && <Bell className="h-4 w-4 text-blue-500 mt-0.5" />}
                    {reminder.type === 'health' && <Heart className="h-4 w-4 text-pink-500 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{reminder.text}</p>
                      <p className="text-xs text-muted-foreground">{reminder.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => handleRestrictedAction('Automation setup')}
                >
                  <Shield className="h-4 w-4" />
                  Setup Automations
                  <Lock className="h-3 w-3 ml-auto" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => handleRestrictedAction('Share roadmap')}
                >
                  <Share className="h-4 w-4" />
                  Share with Advisor
                  <Lock className="h-3 w-3 ml-auto" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => handleRestrictedAction('Receipt export')}
                >
                  <Receipt className="h-4 w-4" />
                  Export Receipts
                  <Lock className="h-3 w-3 ml-auto" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}