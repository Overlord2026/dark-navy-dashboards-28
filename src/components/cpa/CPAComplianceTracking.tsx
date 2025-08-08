import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  FileText,
  Plus,
  Filter,
  Download,
  Bell
} from 'lucide-react';

interface CPAComplianceTrackingProps {
  isPremium?: boolean;
}

export const CPAComplianceTracking: React.FC<CPAComplianceTrackingProps> = ({ isPremium }) => {
  const [selectedState, setSelectedState] = useState('all');

  const ceCredits = [
    {
      id: 1,
      course: 'Ethics in Tax Practice',
      provider: 'AICPA',
      credits: 4,
      category: 'Ethics',
      completedDate: '2024-02-15',
      expiryDate: '2024-12-31',
      status: 'Completed'
    },
    {
      id: 2,
      course: 'Advanced Corporate Taxation',
      provider: 'Tax Institute',
      credits: 8,
      category: 'Technical',
      completedDate: '2024-01-22',
      expiryDate: '2024-12-31',
      status: 'Completed'
    },
    {
      id: 3,
      course: 'Cybersecurity for CPAs',
      provider: 'NASBA',
      credits: 2,
      category: 'Technical',
      completedDate: null,
      expiryDate: '2024-12-31',
      status: 'In Progress'
    }
  ];

  const complianceItems = [
    {
      id: 1,
      requirement: 'Annual State License Renewal',
      state: 'California',
      dueDate: '2024-05-31',
      status: 'Pending',
      priority: 'High'
    },
    {
      id: 2,
      requirement: 'IRS PTIN Renewal',
      state: 'Federal',
      dueDate: '2024-12-31',
      status: 'Completed',
      priority: 'Medium'
    },
    {
      id: 3,
      requirement: 'Peer Review Submission',
      state: 'AICPA',
      dueDate: '2024-06-30',
      status: 'In Progress',
      priority: 'High'
    }
  ];

  const ceRequirements = [
    { state: 'California', required: 40, completed: 28, category: 'General' },
    { state: 'California', required: 4, completed: 4, category: 'Ethics' },
    { state: 'Federal', required: 15, completed: 12, category: 'Tax' }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'Completed': 'default',
      'In Progress': 'secondary',
      'Pending': 'outline',
      'Overdue': 'destructive'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'High': 'text-red-600',
      'Medium': 'text-yellow-600',
      'Low': 'text-green-600'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="ce-tracking" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ce-tracking">CE Credits</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="ce-tracking" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {ceRequirements.map((req, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    {req.state}
                  </CardTitle>
                  <CardDescription>{req.category} Credits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{req.completed}/{req.required} credits</span>
                    </div>
                    <Progress value={(req.completed / req.required) * 100} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {req.required - req.completed} credits remaining
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Continuing Education Log</CardTitle>
                  <CardDescription>Track your completed and planned CE courses</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ceCredits.map((credit) => (
                  <motion.div
                    key={credit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        credit.status === 'Completed' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        {credit.status === 'Completed' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{credit.course}</div>
                        <div className="text-sm text-muted-foreground">
                          {credit.provider} • {credit.credits} credits • {credit.category}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center text-sm">
                        {credit.completedDate ? (
                          <>
                            <div className="text-muted-foreground">Completed</div>
                            <div className="font-medium">{credit.completedDate}</div>
                          </>
                        ) : (
                          <>
                            <div className="text-muted-foreground">Due</div>
                            <div className="font-medium">{credit.expiryDate}</div>
                          </>
                        )}
                      </div>
                      {getStatusBadge(credit.status)}
                      <Button variant="outline" size="sm">
                        {credit.status === 'Completed' ? 'View Certificate' : 'Continue'}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Compliance Checklist</h3>
              <p className="text-muted-foreground">Track IRS, state, and professional requirements</p>
            </div>
            <div className="flex gap-2">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="california">California</SelectItem>
                  <SelectItem value="federal">Federal</SelectItem>
                  <SelectItem value="aicpa">AICPA</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Requirement
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {complianceItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        item.status === 'Completed' ? 'bg-green-100' : 
                        item.status === 'In Progress' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        {item.status === 'Completed' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : item.status === 'In Progress' ? (
                          <Clock className="h-5 w-5 text-yellow-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{item.requirement}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.state} • Due: {item.dueDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge 
                        variant="outline" 
                        className={getPriorityColor(item.priority)}
                      >
                        {item.priority} Priority
                      </Badge>
                      {getStatusBadge(item.status)}
                      <Button variant="outline" size="sm">
                        {item.status === 'Completed' ? 'View' : 'Update'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automated Reminders</CardTitle>
              <CardDescription>Configure alerts for important compliance deadlines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reminder-type">Reminder Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ce">CE Credit Deadline</SelectItem>
                        <SelectItem value="license">License Renewal</SelectItem>
                        <SelectItem value="filing">Tax Filing Deadline</SelectItem>
                        <SelectItem value="custom">Custom Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="advance-notice">Advance Notice</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-week">1 Week Before</SelectItem>
                        <SelectItem value="2-weeks">2 Weeks Before</SelectItem>
                        <SelectItem value="1-month">1 Month Before</SelectItem>
                        <SelectItem value="3-months">3 Months Before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notification-method">Notification Method</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="both">Email + SMS</SelectItem>
                        <SelectItem value="dashboard">Dashboard Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">One Time</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <Button className="w-full">
                <Bell className="h-4 w-4 mr-2" />
                Create Reminder
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Reminders</CardTitle>
              <CardDescription>Your current notification schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium">California License Renewal</div>
                      <div className="text-sm text-muted-foreground">Email reminder 2 weeks before due date</div>
                    </div>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-medium">CE Credit Deadlines</div>
                      <div className="text-sm text-muted-foreground">SMS + Email 1 month before expiry</div>
                    </div>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};