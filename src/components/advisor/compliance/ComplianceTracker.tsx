import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  Download,
  Plus,
  Search,
  Filter,
  Eye,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ComplianceItem {
  id: string;
  type: 'sec_filing' | 'finra_requirement' | 'state_registration' | 'continuing_education' | 'audit' | 'disclosure';
  title: string;
  description: string;
  status: 'compliant' | 'warning' | 'overdue' | 'upcoming';
  due_date: Date;
  completed_date?: Date;
  assigned_to: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  regulatory_body: string;
  evidence_required: string[];
  notes: string;
  created_at: Date;
}

interface AuditTrail {
  id: string;
  action: string;
  user_id: string;
  user_name: string;
  resource_type: string;
  resource_id: string;
  timestamp: Date;
  ip_address: string;
  details: any;
}

export const ComplianceTracker: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [auditTrail, setAuditTrail] = useState<AuditTrail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (user) {
      loadComplianceData();
      loadAuditTrail();
    }
  }, [user]);

  const loadComplianceData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Mock compliance data - in production this would come from your database
      const mockItems: ComplianceItem[] = [
        {
          id: '1',
          type: 'sec_filing',
          title: 'Form ADV Annual Update',
          description: 'Annual amendment to Form ADV due within 90 days of fiscal year end',
          status: 'upcoming',
          due_date: new Date('2024-03-31'),
          assigned_to: 'John Advisor',
          priority: 'high',
          regulatory_body: 'SEC',
          evidence_required: ['Form ADV Part 1A', 'Form ADV Part 2A', 'Form ADV Part 2B'],
          notes: 'Schedule meeting with compliance team by March 1st',
          created_at: new Date('2024-01-01')
        },
        {
          id: '2',
          type: 'continuing_education',
          title: 'CFP Continuing Education',
          description: '30 hours of continuing education required every 2 years',
          status: 'compliant',
          due_date: new Date('2024-12-31'),
          completed_date: new Date('2024-01-15'),
          assigned_to: 'John Advisor',
          priority: 'medium',
          regulatory_body: 'CFP Board',
          evidence_required: ['CE certificates', 'Completion records'],
          notes: 'Completed ethics course and financial planning update',
          created_at: new Date('2024-01-01')
        },
        {
          id: '3',
          type: 'state_registration',
          title: 'State Investment Adviser Registration Renewal',
          description: 'Annual renewal of state investment adviser registration',
          status: 'warning',
          due_date: new Date('2024-02-28'),
          assigned_to: 'John Advisor',
          priority: 'high',
          regulatory_body: 'State Securities Commission',
          evidence_required: ['Renewal application', 'Filing fee payment', 'Updated disclosure documents'],
          notes: 'Renewal notice received - need to submit by end of February',
          created_at: new Date('2024-01-01')
        },
        {
          id: '4',
          type: 'disclosure',
          title: 'Client Disclosure Updates',
          description: 'Update all client disclosure documents with new fee schedule',
          status: 'overdue',
          due_date: new Date('2024-01-31'),
          assigned_to: 'John Advisor',
          priority: 'critical',
          regulatory_body: 'SEC/State',
          evidence_required: ['Updated ADV Part 2', 'Client acknowledgments'],
          notes: 'New fee schedule effective January 1st - all clients must receive updated disclosures',
          created_at: new Date('2023-12-15')
        }
      ];

      setComplianceItems(mockItems);

    } catch (error) {
      console.error('Error loading compliance data:', error);
      toast({
        title: "Error",
        description: "Failed to load compliance data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadAuditTrail = async () => {
    if (!user) return;

    try {
      // Mock audit trail data
      const mockAudit: AuditTrail[] = [
        {
          id: '1',
          action: 'compliance_item_created',
          user_id: user.id,
          user_name: 'John Advisor',
          resource_type: 'compliance_item',
          resource_id: '1',
          timestamp: new Date(),
          ip_address: '192.168.1.1',
          details: { item_type: 'sec_filing', title: 'Form ADV Annual Update' }
        },
        {
          id: '2',
          action: 'compliance_item_completed',
          user_id: user.id,
          user_name: 'John Advisor',
          resource_type: 'compliance_item',
          resource_id: '2',
          timestamp: new Date(Date.now() - 86400000),
          ip_address: '192.168.1.1',
          details: { item_type: 'continuing_education', completed_on_time: true }
        }
      ];

      setAuditTrail(mockAudit);

    } catch (error) {
      console.error('Error loading audit trail:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'upcoming':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const markAsCompleted = async (itemId: string) => {
    try {
      setComplianceItems(items =>
        items.map(item =>
          item.id === itemId
            ? { ...item, status: 'compliant' as const, completed_date: new Date() }
            : item
        )
      );

      toast({
        title: "Compliance Item Completed",
        description: "Item marked as completed successfully",
      });

    } catch (error) {
      console.error('Error marking item as completed:', error);
      toast({
        title: "Error",
        description: "Failed to update compliance item",
        variant: "destructive"
      });
    }
  };

  const filteredItems = complianceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getComplianceScore = () => {
    const total = complianceItems.length;
    const compliant = complianceItems.filter(item => item.status === 'compliant').length;
    return total > 0 ? Math.round((compliant / total) * 100) : 100;
  };

  const overdueItems = complianceItems.filter(item => item.status === 'overdue').length;
  const upcomingItems = complianceItems.filter(item => item.status === 'upcoming').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Compliance Tracking</h1>
          <p className="text-muted-foreground">Monitor regulatory requirements and audit trails</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Requirement
        </Button>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">Compliance Score</span>
            </div>
            <div className="text-2xl font-bold">{getComplianceScore()}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-muted-foreground">Overdue Items</span>
            </div>
            <div className="text-2xl font-bold">{overdueItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-muted-foreground">Upcoming</span>
            </div>
            <div className="text-2xl font-bold">{upcomingItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-green-600" />
              <span className="text-sm text-muted-foreground">Total Items</span>
            </div>
            <div className="text-2xl font-bold">{complianceItems.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {overdueItems > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have {overdueItems} overdue compliance item{overdueItems !== 1 ? 's' : ''} that require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs defaultValue="requirements" className="w-full">
        <TabsList>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search compliance items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="compliant">Compliant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Compliance Items */}
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(item.status)}
                        <h3 className="font-semibold">{item.title}</h3>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority} priority
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{item.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Due: {format(item.due_date, 'MMM dd, yyyy')}</span>
                        <span>•</span>
                        <span>{item.regulatory_body}</span>
                        <span>•</span>
                        <span>Assigned to: {item.assigned_to}</span>
                      </div>
                      {item.completed_date && (
                        <div className="text-sm text-green-600">
                          Completed: {format(item.completed_date, 'MMM dd, yyyy')}
                        </div>
                      )}
                      {item.notes && (
                        <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                          <strong>Notes:</strong> {item.notes}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {item.status !== 'compliant' && (
                        <Button 
                          size="sm" 
                          onClick={() => markAsCompleted(item.id)}
                        >
                          Mark Complete
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditTrail.map((entry) => (
                  <div key={entry.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{entry.action.replace(/_/g, ' ')}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(entry.timestamp, 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {entry.user_name} performed action on {entry.resource_type}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        IP: {entry.ip_address}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Download className="h-5 w-5 mb-2" />
                  Compliance Summary
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Download className="h-5 w-5 mb-2" />
                  Audit Trail Export
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Download className="h-5 w-5 mb-2" />
                  Regulatory Calendar
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Download className="h-5 w-5 mb-2" />
                  Evidence Checklist
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};