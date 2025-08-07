import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { 
  Building2, 
  FileText, 
  Calendar, 
  Shield, 
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Crown,
  Plus,
  Download,
  Share2,
  Eye,
  Settings,
  Upload,
  Bell,
  Archive,
  BarChart3,
  Network,
  Lock,
  Briefcase,
  Home,
  DollarSign,
  Phone,
  Mail,
  Star,
  ChevronRight,
  Activity,
  Target,
  Zap
} from 'lucide-react';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';

interface BusinessEntity {
  id: string;
  name: string;
  type: 'LLC' | 'S-Corp' | 'C-Corp' | 'Partnership' | 'Trust' | 'Sole Proprietorship';
  status: 'Active' | 'Inactive' | 'Pending' | 'Dissolved';
  stateOfIncorporation: string;
  ein: string;
  formationDate: string;
  nextFilingDate: string;
  annualFee: number;
  ownership: Array<{
    owner: string;
    percentage: number;
    role: string;
  }>;
  linkedAssets: Array<{
    type: 'Property' | 'Investment' | 'Bank Account';
    name: string;
    value: number;
  }>;
  documents: Array<{
    name: string;
    type: string;
    uploadDate: string;
    url: string;
  }>;
  advisors: Array<{
    name: string;
    role: string;
    contact: string;
  }>;
  complianceItems: Array<{
    item: string;
    dueDate: string;
    status: 'Complete' | 'Pending' | 'Overdue';
  }>;
}

export const BusinessEntityManagement: React.FC = () => {
  const { checkFeatureAccess } = useSubscriptionAccess();
  const isPremium = checkFeatureAccess('premium');
  
  const [selectedEntity, setSelectedEntity] = useState<BusinessEntity | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddEntityOpen, setIsAddEntityOpen] = useState(false);

  // Mock data - in real app this would come from Supabase
  const [entities, setEntities] = useState<BusinessEntity[]>([
    {
      id: '1',
      name: 'Family Investment Holdings LLC',
      type: 'LLC',
      status: 'Active',
      stateOfIncorporation: 'Delaware',
      ein: '12-3456789',
      formationDate: '2020-03-15',
      nextFilingDate: '2024-03-15',
      annualFee: 300,
      ownership: [
        { owner: 'John Smith', percentage: 60, role: 'Managing Member' },
        { owner: 'Jane Smith', percentage: 40, role: 'Member' }
      ],
      linkedAssets: [
        { type: 'Property', name: 'Main Street Office Building', value: 2500000 },
        { type: 'Investment', name: 'Real Estate Portfolio', value: 1800000 }
      ],
      documents: [
        { name: 'Operating Agreement', type: 'Legal', uploadDate: '2020-03-15', url: '#' },
        { name: 'Annual Report 2023', type: 'Filing', uploadDate: '2024-01-15', url: '#' }
      ],
      advisors: [
        { name: 'Sarah Johnson', role: 'Corporate Attorney', contact: 'sarah@legalfirm.com' },
        { name: 'Mike Davis', role: 'CPA', contact: 'mike@accounting.com' }
      ],
      complianceItems: [
        { item: 'Annual Report Filing', dueDate: '2024-03-15', status: 'Pending' },
        { item: 'Franchise Tax Payment', dueDate: '2024-03-01', status: 'Complete' }
      ]
    },
    {
      id: '2',
      name: 'Smith Family Trust',
      type: 'Trust',
      status: 'Active',
      stateOfIncorporation: 'Nevada',
      ein: '98-7654321',
      formationDate: '2018-06-20',
      nextFilingDate: '2024-12-31',
      annualFee: 0,
      ownership: [
        { owner: 'John Smith', percentage: 0, role: 'Trustee' },
        { owner: 'Jane Smith', percentage: 0, role: 'Co-Trustee' },
        { owner: 'Smith Children', percentage: 100, role: 'Beneficiaries' }
      ],
      linkedAssets: [
        { type: 'Property', name: 'Family Vacation Home', value: 1200000 },
        { type: 'Investment', name: 'Education Fund', value: 750000 }
      ],
      documents: [
        { name: 'Trust Agreement', type: 'Legal', uploadDate: '2018-06-20', url: '#' },
        { name: 'Tax Return 2023', type: 'Tax', uploadDate: '2024-02-15', url: '#' }
      ],
      advisors: [
        { name: 'Robert Wilson', role: 'Estate Attorney', contact: 'robert@estatefirm.com' },
        { name: 'Lisa Chen', role: 'Trust Administrator', contact: 'lisa@trustco.com' }
      ],
      complianceItems: [
        { item: 'Annual Tax Filing', dueDate: '2024-04-15', status: 'Pending' },
        { item: 'Distribution Review', dueDate: '2024-06-30', status: 'Pending' }
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Complete': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="h-4 w-4" />;
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'Overdue': return <AlertTriangle className="h-4 w-4" />;
      case 'Complete': return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const totalAssets = entities.reduce((sum, entity) => 
    sum + entity.linkedAssets.reduce((assetSum, asset) => assetSum + asset.value, 0), 0
  );

  const upcomingDeadlines = entities.flatMap(entity => 
    entity.complianceItems.filter(item => item.status === 'Pending')
  ).length;

  const PremiumFeatureOverlay = ({ children, feature }: { children: React.ReactNode, feature: string }) => {
    if (isPremium) return <>{children}</>;
    
    return (
      <div className="relative">
        <div className="opacity-40 pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
          <div className="text-center">
            <Crown className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm font-medium">Premium Feature</p>
            <p className="text-xs text-muted-foreground">{feature}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Business & Entity Management
              </h1>
              <p className="text-lg text-muted-foreground">
                All your family businesses, LLCs, trusts, and entities—organized, compliant, and protected.
              </p>
            </div>
            
            <Dialog open={isAddEntityOpen} onOpenChange={setIsAddEntityOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entity
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Business Entity</DialogTitle>
                  <DialogDescription>
                    Create a new entity to track and manage
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="entity-name">Entity Name</Label>
                    <Input id="entity-name" placeholder="Enter entity name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entity-type">Entity Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LLC">LLC</SelectItem>
                        <SelectItem value="S-Corp">S-Corporation</SelectItem>
                        <SelectItem value="C-Corp">C-Corporation</SelectItem>
                        <SelectItem value="Partnership">Partnership</SelectItem>
                        <SelectItem value="Trust">Trust</SelectItem>
                        <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State of Incorporation</Label>
                    <Input id="state" placeholder="e.g., Delaware" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ein">EIN</Label>
                    <Input id="ein" placeholder="XX-XXXXXXX" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="purpose">Business Purpose</Label>
                    <Textarea id="purpose" placeholder="Describe the entity's purpose..." />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddEntityOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddEntityOpen(false)}>
                    Create Entity
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Entities</p>
                    <p className="text-2xl font-bold">{entities.length}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Assets</p>
                    <p className="text-2xl font-bold">${(totalAssets / 1000000).toFixed(1)}M</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Upcoming Deadlines</p>
                    <p className="text-2xl font-bold">{upcomingDeadlines}</p>
                  </div>
                  <Bell className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Compliance Score</p>
                    <p className="text-2xl font-bold">94%</p>
                  </div>
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="entities">Entities</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="ownership">Ownership</TabsTrigger>
              <TabsTrigger value="visualization">Structure</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              {/* Entity Overview Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {entities.map((entity) => (
                  <Card key={entity.id} className="hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => setSelectedEntity(entity)}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg font-semibold">{entity.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{entity.type}</Badge>
                            <Badge className={getStatusColor(entity.status)}>
                              {getStatusIcon(entity.status)}
                              <span className="ml-1">{entity.status}</span>
                            </Badge>
                          </div>
                        </div>
                        <Briefcase className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">State</p>
                          <p className="font-medium">{entity.stateOfIncorporation}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">EIN</p>
                          <p className="font-medium">{entity.ein}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Next Filing</p>
                          <p className="font-medium">{new Date(entity.nextFilingDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Assets</p>
                          <p className="font-medium">
                            ${(entity.linkedAssets.reduce((sum, asset) => sum + asset.value, 0) / 1000000).toFixed(1)}M
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm text-muted-foreground">
                          {entity.complianceItems.filter(item => item.status === 'Pending').length} pending items
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium">Annual Report filed for Family Investment Holdings LLC</p>
                        <p className="text-sm text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Bell className="h-5 w-5 text-orange-600" />
                      <div className="flex-1">
                        <p className="font-medium">Franchise tax payment reminder for Smith Family Trust</p>
                        <p className="text-sm text-muted-foreground">1 week ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="entities" className="space-y-6">
              {/* Detailed Entity List */}
              <div className="space-y-4">
                {entities.map((entity) => (
                  <Card key={entity.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{entity.name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{entity.type}</Badge>
                            <Badge className={getStatusColor(entity.status)}>{entity.status}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {entity.stateOfIncorporation} • EIN: {entity.ein}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Manage
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Key Information</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Formation Date:</span>
                              <span>{new Date(entity.formationDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Next Filing:</span>
                              <span>{new Date(entity.nextFilingDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Annual Fee:</span>
                              <span>${entity.annualFee}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Linked Assets</h4>
                          <div className="space-y-1 text-sm">
                            {entity.linkedAssets.slice(0, 3).map((asset, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span className="text-muted-foreground">{asset.name}:</span>
                                <span>${(asset.value / 1000000).toFixed(1)}M</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Compliance Status</h4>
                          <div className="space-y-1 text-sm">
                            {entity.complianceItems.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Badge className={getStatusColor(item.status)}>
                                  {item.status}
                                </Badge>
                                <span className="text-muted-foreground">{item.item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <PremiumFeatureOverlay feature="Advanced Compliance & Automation">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Compliance Calendar */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Compliance Calendar
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {entities.flatMap(entity => 
                          entity.complianceItems.map((item, idx) => (
                            <div key={`${entity.id}-${idx}`} className="flex items-center justify-between p-3 rounded-lg border">
                              <div>
                                <p className="font-medium">{item.item}</p>
                                <p className="text-sm text-muted-foreground">{entity.name}</p>
                              </div>
                              <div className="text-right">
                                <Badge className={getStatusColor(item.status)}>
                                  {item.status}
                                </Badge>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {new Date(item.dueDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Automated Alerts */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Automated Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            <span className="font-medium">Filing Deadline Approaching</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Family Investment Holdings LLC annual report due in 15 days
                          </p>
                        </div>
                        
                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Bell className="h-5 w-5 text-blue-600" />
                            <span className="font-medium">Payment Reminder</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Delaware franchise tax payment scheduled for next month
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </PremiumFeatureOverlay>
            </TabsContent>

            <TabsContent value="ownership" className="space-y-6">
              <PremiumFeatureOverlay feature="Ownership & Asset Protection Tracker">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {entities.map((entity) => (
                    <Card key={entity.id}>
                      <CardHeader>
                        <CardTitle>{entity.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">Ownership Structure</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {entity.ownership.map((owner, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                              <div>
                                <p className="font-medium">{owner.owner}</p>
                                <p className="text-sm text-muted-foreground">{owner.role}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">{owner.percentage}%</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </PremiumFeatureOverlay>
            </TabsContent>

            <TabsContent value="visualization" className="space-y-6">
              <PremiumFeatureOverlay feature="Family Business Tree Visualization">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Network className="h-5 w-5" />
                      Entity Structure Visualization
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Visual representation of your family's business and legal entity structure
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                      <div className="text-center">
                        <Network className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-medium">Interactive Entity Tree</p>
                        <p className="text-sm text-muted-foreground">
                          Visualize relationships between entities, assets, and family members
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </PremiumFeatureOverlay>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <PremiumFeatureOverlay feature="Advanced Reporting & Analytics">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Compliance Report
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Overall Compliance Score</span>
                          <Badge className="bg-green-100 text-green-800">94%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Upcoming Deadlines</span>
                          <Badge className="bg-yellow-100 text-yellow-800">{upcomingDeadlines}</Badge>
                        </div>
                        <Button className="w-full" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download Full Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Asset Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Total Entity Assets</span>
                          <span className="font-bold">${(totalAssets / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Real Estate Holdings</span>
                          <span className="font-bold">$3.7M</span>
                        </div>
                        <Button className="w-full" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Asset Allocation Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </PremiumFeatureOverlay>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};