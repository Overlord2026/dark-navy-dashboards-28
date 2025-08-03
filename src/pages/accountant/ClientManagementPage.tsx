import React, { useState } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  Search, 
  MessageSquare, 
  Upload,
  Download,
  UserPlus,
  Mail,
  Phone,
  Building
} from 'lucide-react';
import { useCelebration } from '@/hooks/useCelebration';

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'inactive';
  last_contact: string;
  services: string[];
}

export default function ClientManagementPage() {
  const { triggerCelebration, CelebrationComponent } = useCelebration();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const clients: Client[] = [
    {
      id: '1',
      name: 'John Smith',
      company: 'TechCorp Inc',
      email: 'john@techcorp.com',
      phone: '(555) 123-4567',
      status: 'active',
      last_contact: '2024-03-15',
      services: ['Tax Preparation', 'Bookkeeping', 'Audit']
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      company: 'BuildCorp LLC',
      email: 'sarah@buildcorp.com',
      phone: '(555) 234-5678',
      status: 'active',
      last_contact: '2024-03-12',
      services: ['Tax Planning', 'Financial Statements']
    },
    {
      id: '3',
      name: 'Mike Davis',
      company: 'StartupXYZ',
      email: 'mike@startupxyz.com',
      phone: '(555) 345-6789',
      status: 'pending',
      last_contact: '2024-03-10',
      services: ['Entity Formation', 'Tax Preparation']
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || client.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const activeClients = clients.filter(c => c.status === 'active').length;
  const pendingClients = clients.filter(c => c.status === 'pending').length;

  const handleClientOnboarded = () => {
    triggerCelebration('client-won', 'New Client Successfully Onboarded! 🎉');
  };

  return (
    <ThreeColumnLayout title="Client Management">
      <div className="space-y-6">
        {CelebrationComponent}
        
        <DashboardHeader 
          heading="Client Management Center"
          text="Manage client relationships, onboarding, and communications."
        />

        <Tabs defaultValue="clients" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="clients">Client List</TabsTrigger>
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="import">Bulk Import</TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                  <Users className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">{activeClients}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Onboarding</CardTitle>
                  <UserPlus className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">{pendingClients}</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting completion
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{clients.length}</div>
                  <p className="text-xs text-muted-foreground">
                    All time
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Client Directory</CardTitle>
                    <CardDescription>
                      Manage your client relationships and contact information
                    </CardDescription>
                  </div>
                  <Button onClick={handleClientOnboarded}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Client
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="flex h-10 w-[140px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {filteredClients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{client.name}</div>
                          {getStatusBadge(client.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">{client.company}</div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {client.phone}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {client.services.map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
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

          <TabsContent value="onboarding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Onboarding Workflow</CardTitle>
                <CardDescription>
                  Streamlined process for bringing new clients into your practice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <UserPlus className="h-6 w-6 mb-2" />
                    Start New Onboarding
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Upload className="h-6 w-6 mb-2" />
                    Upload Client Documents
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Pending Onboarding</h4>
                  <div className="space-y-2">
                    {clients.filter(c => c.status === 'pending').map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-muted-foreground">{client.company}</div>
                        </div>
                        <Button size="sm">Complete Onboarding</Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Secure Message Center</CardTitle>
                <CardDescription>
                  Encrypted communication with clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Message
                    </Button>
                    <Button variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      View All Messages
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Recent Messages</h4>
                    <div className="space-y-2">
                      <div className="p-3 border rounded bg-primary/5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">John Smith - TechCorp Inc</div>
                          <div className="text-xs text-muted-foreground">2 hours ago</div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          "Could you please review the Q4 financial statements..."
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Client Import</CardTitle>
                <CardDescription>
                  Import multiple clients via CSV file upload
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload Client CSV</h3>
                  <p className="text-muted-foreground mb-4">
                    Drag and drop your CSV file or click to browse
                  </p>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose CSV File
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Get the CSV template with required fields
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}