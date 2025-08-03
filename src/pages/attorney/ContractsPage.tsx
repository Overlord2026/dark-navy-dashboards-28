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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Search, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Edit,
  Download,
  Upload,
  Copy,
  Calendar,
  User,
  Building
} from 'lucide-react';

export default function ContractsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const contracts = [
    {
      id: 1,
      title: 'Software Development Agreement',
      client: 'TechStart Inc.',
      status: 'active',
      type: 'Service Agreement',
      start_date: '2024-01-15',
      end_date: '2024-12-15',
      value: '$125,000',
      last_modified: '2024-01-20'
    },
    {
      id: 2,
      title: 'Employment Contract - CEO',
      client: 'GreenEnergy LLC',
      status: 'draft',
      type: 'Employment',
      start_date: '2024-02-01',
      end_date: '2026-02-01',
      value: '$200,000/year',
      last_modified: '2024-01-18'
    },
    {
      id: 3,
      title: 'Lease Agreement - Office Space',
      client: 'RetailMax Corp',
      status: 'under_review',
      type: 'Real Estate',
      start_date: '2024-03-01',
      end_date: '2029-02-28',
      value: '$8,500/month',
      last_modified: '2024-01-15'
    }
  ];

  const templates = [
    { name: 'Non-Disclosure Agreement', category: 'Confidentiality', downloads: 45, last_updated: '2024-01-20' },
    { name: 'Service Agreement Template', category: 'Service Contracts', downloads: 32, last_updated: '2024-01-18' },
    { name: 'Employment Contract', category: 'HR', downloads: 28, last_updated: '2024-01-15' },
    { name: 'Partnership Agreement', category: 'Business', downloads: 21, last_updated: '2024-01-12' },
    { name: 'Software License Agreement', category: 'Technology', downloads: 19, last_updated: '2024-01-10' }
  ];

  const recentActivity = [
    { action: 'Contract signed', contract: 'Software Development Agreement', client: 'TechStart Inc.', time: '2 hours ago' },
    { action: 'Review completed', contract: 'Employment Contract - CEO', client: 'GreenEnergy LLC', time: '4 hours ago' },
    { action: 'Draft created', contract: 'Lease Agreement - Office Space', client: 'RetailMax Corp', time: '1 day ago' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'draft':
        return <Edit className="h-4 w-4 text-blue-500" />;
      case 'under_review':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'expired':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'draft':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Draft</Badge>;
      case 'under_review':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <ThreeColumnLayout title="Contract Management">
      <div className="space-y-6">
        <DashboardHeader 
          heading="Contract Management"
          text="Manage contracts, templates, and document workflows for your legal practice."
        />

        <AttorneyNavigation />

        <Tabs defaultValue="contracts" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="contracts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">34</div>
                  <p className="text-xs text-muted-foreground">
                    Currently active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                  <Edit className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">
                    In progress
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    Pending approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    Next 30 days
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Contracts</CardTitle>
                <CardDescription>
                  Manage and track all client contracts and agreements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search">Search Contracts</Label>
                    <Input
                      id="search"
                      placeholder="Search by title, client, or type..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Filter by Type</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Types</SelectItem>
                        <SelectItem value="employment">Employment</SelectItem>
                        <SelectItem value="service">Service Agreement</SelectItem>
                        <SelectItem value="real-estate">Real Estate</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={() => {
                        // TODO: Open new contract creation
                        console.log('Create new contract');
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      New Contract
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {contracts.map((contract) => (
                    <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(contract.status)}
                        <div>
                          <div className="font-medium">{contract.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {contract.client} • {contract.type}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {contract.start_date} - {contract.end_date} • Value: {contract.value}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(contract.status)}
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              // TODO: Edit contract
                              console.log('Edit contract:', contract.id);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              // TODO: Download contract
                              console.log('Download contract:', contract.id);
                            }}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
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
                <CardTitle>Contract Templates</CardTitle>
                <CardDescription>
                  Pre-built contract templates to streamline document creation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <Input 
                      placeholder="Search templates..." 
                      className="w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      // TODO: Open template upload
                      console.log('Upload template');
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Template
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <h4 className="font-medium mb-2">{template.name}</h4>
                      <div className="text-sm text-muted-foreground mb-3">
                        <p>Downloaded {template.downloads} times</p>
                        <p>Updated: {template.last_updated}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // TODO: Use template
                            console.log('Use template:', template.name);
                          }}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Use
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // TODO: Edit template
                            console.log('Edit template:', template.name);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contract Workflows</CardTitle>
                <CardDescription>
                  Automated workflows for contract creation, review, and approval
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Standard Review Process</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Draft → Legal Review → Client Review → Execution
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // TODO: Configure workflow
                        console.log('Configure standard review workflow');
                      }}
                    >
                      Configure
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Employment Contract Flow</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Template → HR Review → Legal Approval → Signing
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // TODO: Configure employment workflow
                        console.log('Configure employment contract workflow');
                      }}
                    >
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contract Analytics</CardTitle>
                <CardDescription>
                  Performance metrics and insights for contract management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <h4 className="font-medium">Avg. Review Time</h4>
                    </div>
                    <div className="text-2xl font-bold">3.2 days</div>
                    <p className="text-sm text-muted-foreground">Contract to signature</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-green-500" />
                      <h4 className="font-medium">Monthly Volume</h4>
                    </div>
                    <div className="text-2xl font-bold">28</div>
                    <p className="text-sm text-muted-foreground">Contracts processed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates and actions on your contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div className="flex-1">
                        <div className="font-medium">{activity.action}</div>
                        <div className="text-sm text-muted-foreground">
                          {activity.contract} • {activity.client}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{activity.time}</div>
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