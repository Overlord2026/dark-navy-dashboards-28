import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ToolGate } from '@/components/tools/ToolGate';
import { motion } from 'framer-motion';
import { 
  Scale, 
  FileText, 
  Gavel, 
  Building, 
  FolderLock, 
  Users, 
  MessageSquare,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Bell,
  Settings,
  Download,
  Upload,
  Eye,
  Trophy,
  DollarSign,
  UserPlus,
  Sparkles
} from 'lucide-react';
import { UnifiedClientInvitationModal } from '@/components/shared/UnifiedClientInvitationModal';
import { useUnifiedClientInvitation } from '@/hooks/useUnifiedClientInvitation';
import { EnhancedCalculatorChart } from '@/components/calculators/EnhancedCalculatorChart';

interface Case {
  id: string;
  title: string;
  client: string;
  type: string;
  status: 'active' | 'pending' | 'completed';
  deadline: string;
  priority: 'high' | 'medium' | 'low';
}

interface Document {
  id: string;
  name: string;
  type: string;
  client: string;
  size: string;
  lastModified: string;
  status: 'draft' | 'review' | 'finalized';
}

interface ComplianceItem {
  id: string;
  title: string;
  jurisdiction: string;
  dueDate: string;
  type: 'filing' | 'renewal' | 'report';
  status: 'pending' | 'completed' | 'overdue';
}

export const AttorneyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [chartData, setChartData] = useState([]);
  const { invitations, fetchInvitations } = useUnifiedClientInvitation();

  useEffect(() => {
    // Generate mock revenue data for chart
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const revenueData = months.map((month, index) => ({
      month,
      revenue: 195000 + (index * 8000) + (Math.random() * 12000)
    }));
    setChartData(revenueData);
    
    // Fetch invitations on component mount
    fetchInvitations();
  }, []);

  // Enhanced attorney metrics
  const metrics = {
    activeCases: 12,
    pendingDeadlines: 5,
    totalDocuments: 47,
    newLeads: 8,
    monthlyRevenue: '$289,500',
    clientsRequiringAction: 3,
    billableHours: 210,
    complianceItems: 2
  };
  
  // Mock data
  const cases: Case[] = [
    {
      id: '1',
      title: 'Estate Planning - Johnson Family Trust',
      client: 'Robert Johnson',
      type: 'Estate Planning',
      status: 'active',
      deadline: '2024-01-15',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Business Formation - Tech Startup LLC',
      client: 'Sarah Chen',
      type: 'Business Law',
      status: 'pending',
      deadline: '2024-01-20',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Real Estate Contract Review',
      client: 'Michael Rodriguez',
      type: 'Real Estate',
      status: 'active',
      deadline: '2024-01-18',
      priority: 'medium'
    }
  ];

  const documents: Document[] = [
    {
      id: '1',
      name: 'Johnson_Family_Trust_V2.pdf',
      type: 'Trust Document',
      client: 'Robert Johnson',
      size: '2.4 MB',
      lastModified: '2024-01-10',
      status: 'review'
    },
    {
      id: '2',
      name: 'TechStartup_Articles_of_Incorporation.docx',
      type: 'Corporate Document',
      client: 'Sarah Chen',
      size: '1.2 MB',
      lastModified: '2024-01-09',
      status: 'draft'
    }
  ];

  const complianceItems: ComplianceItem[] = [
    {
      id: '1',
      title: 'California Bar Annual Fees',
      jurisdiction: 'California',
      dueDate: '2024-02-01',
      type: 'renewal',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Client Trust Account Report',
      jurisdiction: 'California',
      dueDate: '2024-01-31',
      type: 'report',
      status: 'pending'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Cases</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Gavel className="w-8 h-8 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Deadlines</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">3 due this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Documents</p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">8.2 GB used</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New Leads</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">+60% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Compliance Alerts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Compliance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {complianceItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.jurisdiction} • Due {item.dueDate}</p>
                  </div>
                  <Badge variant={item.status === 'overdue' ? 'destructive' : 'secondary'}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
            <ToolGate toolKey="compliance-tracker" fallbackRoute="/tools/compliance-tracker">
              <Button variant="outline" size="sm" className="w-full mt-4" data-tool-card="compliance-tracker">
                View All Compliance Items
              </Button>
            </ToolGate>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cases.slice(0, 3).map((case_) => (
                <div key={case_.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{case_.title}</p>
                    <p className="text-xs text-muted-foreground">{case_.client} • {case_.deadline}</p>
                  </div>
                  <Badge variant={case_.priority === 'high' ? 'destructive' : 'secondary'}>
                    {case_.priority}
                  </Badge>
                </div>
              ))}
            </div>
            <ToolGate toolKey="legal-calendar" fallbackRoute="/tools/legal-calendar">
              <Button variant="outline" size="sm" className="w-full mt-4" data-tool-card="legal-calendar">
                View Calendar
              </Button>
            </ToolGate>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCases = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Client Cases</h2>
        <ToolGate toolKey="case-management" fallbackRoute="/tools/case-management">
          <Button data-tool-card="case-management">
            <Plus className="w-4 h-4 mr-2" />
            New Case
          </Button>
        </ToolGate>
      </div>
      
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input placeholder="Search cases..." className="pl-9" />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>
      
      <div className="space-y-4">
        {cases.map((case_) => (
          <Card key={case_.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{case_.title}</h3>
                    <Badge variant={case_.status === 'active' ? 'default' : 'secondary'}>
                      {case_.status}
                    </Badge>
                    <Badge variant={case_.priority === 'high' ? 'destructive' : 'secondary'}>
                      {case_.priority} priority
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Client: {case_.client}</p>
                  <p className="text-sm text-muted-foreground">Type: {case_.type} • Deadline: {case_.deadline}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Document Vault</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FolderLock className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium">Storage Used</p>
                <p className="text-sm text-muted-foreground">8.2 GB / 10 GB</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <p className="font-medium">Total Documents</p>
                <p className="text-sm text-muted-foreground">47 files</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-green-500" />
              <div>
                <p className="font-medium">Shared Files</p>
                <p className="text-sm text-muted-foreground">23 files</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        {documents.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doc.client} • {doc.type} • {doc.size} • Modified {doc.lastModified}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={doc.status === 'finalized' ? 'default' : 'secondary'}>
                    {doc.status}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Litigation & Compliance Tracker</h2>
        <Badge variant="secondary">Premium Feature</Badge>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="w-5 h-5" />
              Active Litigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Johnson v. State Insurance Co.</h4>
                <p className="text-sm text-muted-foreground mb-3">Discovery deadline: Jan 25, 2024</p>
                <div className="flex gap-2">
                  <Badge variant="outline">Discovery</Badge>
                  <Badge variant="destructive">High Priority</Badge>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Chen Business Dissolution</h4>
                <p className="text-sm text-muted-foreground mb-3">Filing due: Feb 1, 2024</p>
                <div className="flex gap-2">
                  <Badge variant="outline">Filing</Badge>
                  <Badge variant="secondary">Medium Priority</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Compliance Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceItems.map((item) => (
                <div key={item.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{item.title}</h4>
                    <Badge variant={item.status === 'overdue' ? 'destructive' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.jurisdiction} • Due {item.dueDate}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Enhanced Header */}
      <Card className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-primary-foreground text-white mb-6">
        <div className="absolute inset-0 bg-black/10" />
        <CardContent className="relative z-10 p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Scale className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">Legal Practice Hub</h1>
                  <p className="text-white/90 text-lg">Complete estate planning and legal practice management</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{metrics.activeCases}</div>
                  <div className="text-white/80 text-sm">Active Cases</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{metrics.totalDocuments}</div>
                  <div className="text-white/80 text-sm">Documents</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{metrics.newLeads}</div>
                  <div className="text-white/80 text-sm">New Leads</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{metrics.billableHours}</div>
                  <div className="text-white/80 text-sm">Billable Hours</div>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex flex-col gap-2">
              <UnifiedClientInvitationModal 
                professionalType="attorney"
                trigger={
                  <Button variant="secondary" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Invite Client
                  </Button>
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cases">Client Cases</TabsTrigger>
            <TabsTrigger value="estate">Estate Planning</TabsTrigger>
            <TabsTrigger value="compliance">
              <div className="flex items-center gap-2">
                Litigation & Compliance
                <Badge variant="secondary" className="text-xs">Premium</Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger value="entities">Business Entities</TabsTrigger>
            <TabsTrigger value="vault">Secure Vault</TabsTrigger>
            <TabsTrigger value="leads">Marketplace Leads</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {renderOverview()}
          </TabsContent>
          
          <TabsContent value="cases">
            {renderCases()}
          </TabsContent>
          
          <TabsContent value="estate">
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Estate Planning Tools</h3>
              <p className="text-muted-foreground mb-4">
                Automated document generation and trust management tools
              </p>
              <ToolGate toolKey="estate-templates" fallbackRoute="/tools/estate-templates">
                <Button data-tool-card="estate-templates">Explore Templates</Button>
              </ToolGate>
            </div>
          </TabsContent>
          
          <TabsContent value="compliance">
            {renderCompliance()}
          </TabsContent>
          
          <TabsContent value="entities">
            <div className="text-center py-12">
              <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Business Entity Management</h3>
              <p className="text-muted-foreground mb-4">
                Track ownership structures and business relationships
              </p>
              <ToolGate toolKey="entity-management" fallbackRoute="/tools/entity-management">
                <Button data-tool-card="entity-management">Manage Entities</Button>
              </ToolGate>
            </div>
          </TabsContent>
          
          <TabsContent value="vault">
            {renderDocuments()}
          </TabsContent>
          
          <TabsContent value="leads">
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Marketplace Leads</h3>
              <p className="text-muted-foreground mb-4">
                Manage incoming client requests and referrals
              </p>
              <ToolGate toolKey="legal-leads" fallbackRoute="/tools/legal-leads">
                <Button data-tool-card="legal-leads">View Leads</Button>
              </ToolGate>
            </div>
          </TabsContent>
          
          <TabsContent value="collaboration">
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Collaboration Center</h3>
              <p className="text-muted-foreground mb-4">
                Secure communication with clients and professional team members
              </p>
              <ToolGate toolKey="legal-collaboration" fallbackRoute="/tools/legal-collaboration">
                <Button data-tool-card="legal-collaboration">Open Messages</Button>
              </ToolGate>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};