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
import { useEstatePlanning } from '@/hooks/useEstatePlanning';
import { 
  FileText, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  Heart,
  Shield,
  Plus
} from 'lucide-react';

export function EstatePlanningPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { documents, loading } = useEstatePlanning();

  const estatePlanningStats = [
    {
      title: 'Active Plans',
      value: '12',
      description: 'Estate plans in progress',
      icon: Briefcase,
      trend: '+2 this month'
    },
    {
      title: 'Completed Wills',
      value: '34',
      description: 'Successfully drafted',
      icon: FileText,
      trend: '+5 this quarter'
    },
    {
      title: 'Trust Assets',
      value: '$2.4M',
      description: 'Under management',
      icon: Shield,
      trend: '+12% growth'
    },
    {
      title: 'Families Served',
      value: '28',
      description: 'Legacy plans created',
      icon: Heart,
      trend: 'Active clients'
    }
  ];

  const upcomingDeadlines = [
    {
      client: 'Johnson Family Trust',
      task: 'Annual Trust Review',
      due_date: '2024-02-15',
      priority: 'high',
      status: 'pending'
    },
    {
      client: 'Williams Estate',
      task: 'Will Amendment Filing',
      due_date: '2024-02-20',
      priority: 'medium',
      status: 'in_progress'
    },
    {
      client: 'Davis Living Trust',
      task: 'Beneficiary Update',
      due_date: '2024-02-28',
      priority: 'low',
      status: 'scheduled'
    }
  ];

  const documentTemplates = [
    { name: 'Last Will and Testament', category: 'Wills', usage: 'High' },
    { name: 'Revocable Living Trust', category: 'Trusts', usage: 'High' },
    { name: 'Power of Attorney', category: 'Legal Documents', usage: 'Medium' },
    { name: 'Healthcare Directive', category: 'Medical', usage: 'Medium' },
    { name: 'Beneficiary Designation', category: 'Assets', usage: 'High' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
      case 'scheduled':
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
      case 'scheduled':
        return <Badge variant="default" className="bg-purple-100 text-purple-800">Scheduled</Badge>;
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
    <ThreeColumnLayout title="Estate Planning Suite">
      <div className="space-y-6">
        <DashboardHeader 
          heading="Estate Planning Suite"
          text="Comprehensive estate planning tools including will creation, trust management, and legacy planning."
        />

        <AttorneyNavigation />

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {estatePlanningStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        {stat.trend}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Estate Planning Activity</CardTitle>
                  <CardDescription>
                    Latest updates on estate planning matters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingDeadlines.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(item.status)}
                          <div>
                            <div className="font-medium">{item.client}</div>
                            <div className="text-sm text-muted-foreground">{item.task}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Due: {item.due_date}</div>
                          {getStatusBadge(item.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Document Status</CardTitle>
                  <CardDescription>
                    Current estate planning documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documents.slice(0, 3).map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <div>
                            <div className="font-medium">{doc.document_name}</div>
                            <div className="text-sm text-muted-foreground">{doc.document_type}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(doc.status)}
                          <Button variant="outline" size="sm" className="mt-1">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                    {documents.length === 0 && (
                      <p className="text-muted-foreground text-center py-4">
                        No documents yet. Create your first estate planning document.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estate Planning Documents</CardTitle>
                <CardDescription>
                  Manage wills, trusts, and other estate planning documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <Label htmlFor="search">Search Documents</Label>
                    <Input
                      id="search"
                      placeholder="Search estate planning documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Document
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="font-medium">{doc.document_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {doc.document_type} • {doc.description}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Created: {new Date(doc.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(doc.status)}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Share</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {documents.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No estate planning documents yet. Start by creating your first document.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estate Planning Clients</CardTitle>
                <CardDescription>
                  Manage client relationships and estate planning matters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Client management features will be available soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deadlines" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>
                  Important dates and deadlines for estate planning matters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDeadlines.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(item.status)}
                        <div>
                          <div className="font-medium">{item.client}</div>
                          <div className="text-sm text-muted-foreground">{item.task}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getPriorityBadge(item.priority)}
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

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estate Planning Templates</CardTitle>
                <CardDescription>
                  Pre-built templates for common estate planning documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documentTemplates.map((template, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <Badge variant="outline">{template.usage} Usage</Badge>
                      </div>
                      <h4 className="font-medium mb-1">{template.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Category: {template.category}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">Use Template</Button>
                        <Button variant="outline" size="sm">Preview</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}