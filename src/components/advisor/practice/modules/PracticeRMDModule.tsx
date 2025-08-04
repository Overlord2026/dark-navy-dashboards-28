import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Calculator, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  User,
  DollarSign,
  FileText,
  Mail,
  Phone,
  Download,
  Send
} from 'lucide-react';

export function PracticeRMDModule() {
  const rmdMetrics = {
    totalEligibleClients: 23,
    completedRMDs: 18,
    pendingRMDs: 5,
    totalRMDAmount: '$485,000',
    deadline: 'Dec 31, 2024',
    complianceScore: 78
  };

  const rmdClients = [
    {
      id: '1',
      name: 'Robert Johnson',
      age: 75,
      accountValue: '$850,000',
      rmdAmount: '$35,416',
      dueDate: 'Dec 31, 2024',
      status: 'Completed',
      lastCalculated: 'Jan 15, 2024',
      distributionMethod: 'Monthly'
    },
    {
      id: '2',
      name: 'Margaret Davis',
      age: 73,
      accountValue: '$420,000',
      rmdAmount: '$17,500',
      dueDate: 'Dec 31, 2024',
      status: 'Pending',
      lastCalculated: 'Mar 1, 2024',
      distributionMethod: 'Lump Sum'
    },
    {
      id: '3',
      name: 'William Chen',
      age: 78,
      accountValue: '$1,200,000',
      rmdAmount: '$54,545',
      dueDate: 'Dec 31, 2024',
      status: 'In Progress',
      lastCalculated: 'Mar 10, 2024',
      distributionMethod: 'Quarterly'
    },
    {
      id: '4',
      name: 'Helen Rodriguez',
      age: 72,
      accountValue: '$315,000',
      rmdAmount: '$13,125',
      dueDate: 'Dec 31, 2024',
      status: 'Overdue',
      lastCalculated: 'Feb 20, 2024',
      distributionMethod: 'Semi-Annual'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': 
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'In Progress': 
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
      case 'Pending': 
        return <Badge variant="outline"><Calendar className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'Overdue': 
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Overdue</Badge>;
      default: 
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const completionPercentage = (rmdMetrics.completedRMDs / rmdMetrics.totalEligibleClients) * 100;

  return (
    <div className="space-y-6">
      {/* RMD Overview */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold">{rmdMetrics.totalEligibleClients}</div>
            <p className="text-sm text-muted-foreground">Eligible Clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold text-green-600">{rmdMetrics.completedRMDs}</div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold text-yellow-600">{rmdMetrics.pendingRMDs}</div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold">{rmdMetrics.totalRMDAmount}</div>
            <p className="text-sm text-muted-foreground">Total RMD Amount</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold">{Math.round(completionPercentage)}%</div>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold">{rmdMetrics.complianceScore}%</div>
            <p className="text-sm text-muted-foreground">Compliance Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>2024 RMD Progress</span>
            <Badge variant="secondary">{rmdMetrics.deadline}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Progress value={completionPercentage} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{rmdMetrics.completedRMDs} of {rmdMetrics.totalEligibleClients} clients completed</span>
              <span>{Math.round(completionPercentage)}% complete</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RMD Calculator */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              RMD Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Client Age</label>
              <input 
                type="number" 
                placeholder="75" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Account Balance (Dec 31 prior year)</label>
              <input 
                type="text" 
                placeholder="$850,000" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Distribution Period</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Single Life Expectancy (Table III)</option>
                <option>Joint Life Expectancy (Table II)</option>
                <option>Uniform Lifetime (Table III)</option>
              </select>
            </div>
            <Button className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate RMD
            </Button>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Required Minimum Distribution</div>
              <div className="text-2xl font-bold">$35,416.67</div>
              <div className="text-sm text-muted-foreground">for 2024</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Automated Workflows
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <div className="font-medium text-sm">RMD Reminder Email</div>
                  <div className="text-xs text-muted-foreground">Send 90 days before deadline</div>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <div className="font-medium text-sm">Calculation Notification</div>
                  <div className="text-xs text-muted-foreground">Auto-notify when RMD calculated</div>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <div className="font-medium text-sm">Follow-up Sequence</div>
                  <div className="text-xs text-muted-foreground">Progressive reminders for pending RMDs</div>
                </div>
                <Badge variant="secondary">Inactive</Badge>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              <Mail className="h-4 w-4 mr-2" />
              Customize Email Templates
            </Button>
            
            <Button className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Send Batch Reminders
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* RMD Client Dashboard */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>RMD-Eligible Clients</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Batch Update
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rmdClients.map((client) => (
              <div key={client.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Age {client.age} • Account: {client.accountValue} • {client.distributionMethod}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold">{client.rmdAmount}</div>
                    <div className="text-xs text-muted-foreground">RMD Amount</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm">{client.lastCalculated}</div>
                    <div className="text-xs text-muted-foreground">Last Calculated</div>
                  </div>
                  
                  {getStatusBadge(client.status)}

                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <Calculator className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-3 w-3" />
                    </Button>
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