import React, { useState } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { AttorneyNavigation } from '@/components/attorney/AttorneyNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Building, 
  FileText, 
  Scale, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Users,
  Briefcase,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function BusinessLawPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const activeCases = [
    {
      id: 1,
      client: 'TechStart Inc.',
      matter: 'Corporate Formation',
      type: 'Business Formation',
      status: 'in_progress',
      deadline: '2024-02-15',
      priority: 'high',
      billing_rate: '$450/hr'
    },
    {
      id: 2,
      client: 'GreenEnergy LLC',
      matter: 'Partnership Agreement',
      type: 'Contract Negotiation',
      status: 'review',
      deadline: '2024-02-20',
      priority: 'medium',
      billing_rate: '$425/hr'
    },
    {
      id: 3,
      client: 'RetailMax Corp',
      matter: 'Employment Compliance',
      type: 'Compliance',
      status: 'pending',
      deadline: '2024-02-28',
      priority: 'low',
      billing_rate: '$400/hr'
    }
  ];

  const businessDocuments = [
    { name: 'Articles of Incorporation', category: 'Formation', last_used: '2024-01-20' },
    { name: 'Operating Agreement Template', category: 'Governance', last_used: '2024-01-18' },
    { name: 'Employment Agreement', category: 'HR', last_used: '2024-01-15' },
    { name: 'Non-Disclosure Agreement', category: 'IP', last_used: '2024-01-12' },
    { name: 'Share Purchase Agreement', category: 'Transaction', last_used: '2024-01-10' }
  ];

  const complianceItems = [
    { task: 'Annual Report Filing', entity: 'TechStart Inc.', due_date: '2024-03-31', status: 'pending' },
    { task: 'Board Resolution Review', entity: 'GreenEnergy LLC', due_date: '2024-02-28', status: 'in_progress' },
    { task: 'Registered Agent Update', entity: 'RetailMax Corp', due_date: '2024-02-15', status: 'completed' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
      case 'review':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'review':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">In Review</Badge>;
      case 'pending':
        return <Badge variant="default" className="bg-red-100 text-red-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  return (
    <ThreeColumnLayout title="Business Law Practice">
      <div className="space-y-6">
        <DashboardHeader 
          heading="Business Law Practice"
          text="Manage corporate matters, business formation, and commercial legal services."
        />

        <AttorneyNavigation />

        <Tabs defaultValue="matters" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="matters">Matters</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="matters" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Matters</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">
                    Currently open
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">
                    New matters opened
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$42,500</div>
                  <p className="text-xs text-muted-foreground">
                    This month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Rate</CardTitle>
                  <Scale className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$425</div>
                  <p className="text-xs text-muted-foreground">
                    Per hour
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Active Business Law Matters</CardTitle>
                <CardDescription>
                  Current cases and legal matters for your business clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeCases.map((case_item) => (
                    <div key={case_item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(case_item.status)}
                        <div>
                          <div className="font-medium">{case_item.client}</div>
                          <div className="text-sm text-muted-foreground">{case_item.matter}</div>
                          <div className="text-xs text-muted-foreground">
                            {case_item.type} • Due: {case_item.deadline}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getPriorityBadge(case_item.priority)}
                        {getStatusBadge(case_item.status)}
                        <div className="text-right">
                          <div className="text-sm font-medium">{case_item.billing_rate}</div>
                          <Button variant="outline" size="sm" className="mt-1">
                            View Matter
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Law Document Library</CardTitle>
                <CardDescription>
                  Templates and documents for business legal matters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <Label htmlFor="search">Search Documents</Label>
                    <Input
                      id="search"
                      placeholder="Search templates and documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button>
                      <FileText className="h-4 w-4 mr-2" />
                      New Document
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {businessDocuments.map((doc, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <Badge variant="outline">{doc.category}</Badge>
                      </div>
                      <h4 className="font-medium mb-1">{doc.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Last used: {doc.last_used}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Use</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Compliance Tracking</CardTitle>
                <CardDescription>
                  Monitor compliance requirements and deadlines for business clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(item.status)}
                        <div>
                          <div className="font-medium">{item.task}</div>
                          <div className="text-sm text-muted-foreground">{item.entity}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-medium">Due: {item.due_date}</div>
                          {getStatusBadge(item.status)}
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Law Billing</CardTitle>
                <CardDescription>
                  Track time and billing for business law matters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Billable Hours (This Month)</h4>
                    <div className="text-2xl font-bold">127.5</div>
                    <p className="text-sm text-muted-foreground">Hours logged</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Outstanding Invoices</h4>
                    <div className="text-2xl font-bold text-orange-600">$23,400</div>
                    <p className="text-sm text-muted-foreground">Pending payment</p>
                  </div>
                </div>
                <Button className="w-full">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Generate Invoices
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Law Analytics</CardTitle>
                <CardDescription>
                  Performance metrics and insights for your business law practice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="h-5 w-5 text-blue-500" />
                      <h4 className="font-medium">Active Business Clients</h4>
                    </div>
                    <div className="text-2xl font-bold">18</div>
                    <p className="text-sm text-muted-foreground">Companies served</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-green-500" />
                      <h4 className="font-medium">Matter Success Rate</h4>
                    </div>
                    <div className="text-2xl font-bold">94%</div>
                    <p className="text-sm text-muted-foreground">Successful outcomes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}