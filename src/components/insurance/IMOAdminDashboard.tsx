import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Users, 
  Filter, 
  Download, 
  Mail, 
  Bell, 
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  FileText,
  Calendar,
  Send,
  UserCheck,
  TrendingUp,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import confetti from 'canvas-confetti';

interface AgentSummary {
  id: string;
  name: string;
  email: string;
  license_type: string;
  state: string;
  license_number: string;
  license_expiry: Date | null;
  ce_credits_required: number;
  ce_credits_completed: number;
  ce_reporting_period_end: Date | null;
  status: 'active' | 'inactive' | 'suspended';
  compliance_status: 'compliant' | 'at_risk' | 'deficient' | 'expired';
  days_until_expiry: number | null;
  days_until_ce_deadline: number | null;
  pending_courses: number;
}

interface ComplianceStats {
  total_agents: number;
  compliant: number;
  at_risk: number;
  deficient: number;
  expired: number;
}

export function IMOAdminDashboard() {
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<AgentSummary[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingReminders, setIsSendingReminders] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [complianceFilter, setComplianceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [stats, setStats] = useState<ComplianceStats>({
    total_agents: 0,
    compliant: 0,
    at_risk: 0,
    deficient: 0,
    expired: 0
  });

  // Mock data for testing - in real implementation would fetch from Supabase
  useEffect(() => {
    loadAgentsData();
  }, []);

  const loadAgentsData = async () => {
    setIsLoading(true);
    
    // Simulate API call - in real implementation would fetch from insurance_agents table
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockAgents: AgentSummary[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@agency.com',
        license_type: 'Life & Health',
        state: 'CA',
        license_number: 'LH12345',
        license_expiry: new Date('2024-12-31'),
        ce_credits_required: 24,
        ce_credits_completed: 18,
        ce_reporting_period_end: new Date('2024-05-31'),
        status: 'active',
        compliance_status: 'at_risk',
        days_until_expiry: 95,
        days_until_ce_deadline: 25,
        pending_courses: 2
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael.chen@agency.com',
        license_type: 'Life & Health',
        state: 'TX',
        license_number: 'LH67890',
        license_expiry: new Date('2025-03-15'),
        ce_credits_required: 20,
        ce_credits_completed: 20,
        ce_reporting_period_end: new Date('2024-12-31'),
        status: 'active',
        compliance_status: 'compliant',
        days_until_expiry: 185,
        days_until_ce_deadline: 150,
        pending_courses: 0
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@agency.com',
        license_type: 'Life & Health',
        state: 'FL',
        license_number: 'LH54321',
        license_expiry: new Date('2024-08-15'),
        ce_credits_required: 20,
        ce_credits_completed: 8,
        ce_reporting_period_end: new Date('2024-07-31'),
        status: 'active',
        compliance_status: 'deficient',
        days_until_expiry: 45,
        days_until_ce_deadline: 15,
        pending_courses: 3
      },
      {
        id: '4',
        name: 'David Wilson',
        email: 'david.wilson@agency.com',
        license_type: 'Property & Casualty',
        state: 'NY',
        license_number: 'PC98765',
        license_expiry: new Date('2025-01-20'),
        ce_credits_required: 15,
        ce_credits_completed: 12,
        ce_reporting_period_end: new Date('2024-09-30'),
        status: 'active',
        compliance_status: 'at_risk',
        days_until_expiry: 110,
        days_until_ce_deadline: 75,
        pending_courses: 1
      },
      {
        id: '5',
        name: 'Lisa Thompson',
        email: 'lisa.thompson@agency.com',
        license_type: 'Life & Health',
        state: 'IL',
        license_number: 'LH11111',
        license_expiry: new Date('2024-06-30'),
        ce_credits_required: 15,
        ce_credits_completed: 2,
        ce_reporting_period_end: new Date('2024-05-31'),
        status: 'suspended',
        compliance_status: 'expired',
        days_until_expiry: -15,
        days_until_ce_deadline: -5,
        pending_courses: 4
      }
    ];

    setAgents(mockAgents);
    
    // Calculate stats
    const newStats = {
      total_agents: mockAgents.length,
      compliant: mockAgents.filter(a => a.compliance_status === 'compliant').length,
      at_risk: mockAgents.filter(a => a.compliance_status === 'at_risk').length,
      deficient: mockAgents.filter(a => a.compliance_status === 'deficient').length,
      expired: mockAgents.filter(a => a.compliance_status === 'expired').length,
    };
    
    setStats(newStats);
    setIsLoading(false);
  };

  // Filter and sort agents
  useEffect(() => {
    let filtered = [...agents];

    // Apply filters
    if (searchTerm) {
      filtered = filtered.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.license_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(agent => agent.status === statusFilter);
    }

    if (stateFilter !== 'all') {
      filtered = filtered.filter(agent => agent.state === stateFilter);
    }

    if (complianceFilter !== 'all') {
      filtered = filtered.filter(agent => agent.compliance_status === complianceFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'state':
          aValue = a.state;
          bValue = b.state;
          break;
        case 'compliance':
          aValue = a.compliance_status;
          bValue = b.compliance_status;
          break;
        case 'expiry':
          aValue = a.days_until_expiry || 999;
          bValue = b.days_until_expiry || 999;
          break;
        case 'ce_deadline':
          aValue = a.days_until_ce_deadline || 999;
          bValue = b.days_until_ce_deadline || 999;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    setFilteredAgents(filtered);
  }, [agents, searchTerm, statusFilter, stateFilter, complianceFilter, sortBy, sortOrder]);

  const handleSelectAgent = (agentId: string, checked: boolean) => {
    if (checked) {
      setSelectedAgents(prev => [...prev, agentId]);
    } else {
      setSelectedAgents(prev => prev.filter(id => id !== agentId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAgents(filteredAgents.map(agent => agent.id));
    } else {
      setSelectedAgents([]);
    }
  };

  const getAgentsDueWithin30Days = () => {
    return agents.filter(agent => 
      (agent.days_until_ce_deadline !== null && agent.days_until_ce_deadline <= 30 && agent.days_until_ce_deadline >= 0) ||
      (agent.days_until_expiry !== null && agent.days_until_expiry <= 30 && agent.days_until_expiry >= 0)
    );
  };

  const sendBatchReminders = async () => {
    setIsSendingReminders(true);
    
    try {
      const agentsDue = selectedAgents.length > 0 
        ? agents.filter(a => selectedAgents.includes(a.id))
        : getAgentsDueWithin30Days();

      if (agentsDue.length === 0) {
        toast.error('No agents selected or due within 30 days');
        return;
      }

      // Call edge function to send batch emails
      const { data, error } = await supabase.functions.invoke('batch-communicate', {
        body: {
          type: 'reminder',
          agents: agentsDue.map(agent => ({
            id: agent.id,
            email: agent.email,
            name: agent.name,
            days_until_ce_deadline: agent.days_until_ce_deadline,
            days_until_expiry: agent.days_until_expiry,
            compliance_status: agent.compliance_status
          }))
        }
      });

      if (error) {
        console.error('Error sending batch reminders:', error);
        toast.error('Failed to send some reminders');
      } else {
        toast.success(`Batch reminders sent to ${agentsDue.length} agents!`);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (error) {
      console.error('Error in batch reminders:', error);
      toast.error('Failed to send batch reminders');
    } finally {
      setIsSendingReminders(false);
    }
  };

  const downloadComplianceReport = (format: 'csv' | 'pdf') => {
    const reportData = filteredAgents.map(agent => ({
      Name: agent.name,
      Email: agent.email,
      'License Type': agent.license_type,
      State: agent.state,
      'License Number': agent.license_number,
      'License Expiry': agent.license_expiry?.toLocaleDateString() || 'N/A',
      'CE Required': agent.ce_credits_required,
      'CE Completed': agent.ce_credits_completed,
      'CE Progress': `${Math.round((agent.ce_credits_completed / agent.ce_credits_required) * 100)}%`,
      'Compliance Status': agent.compliance_status,
      'Days Until Expiry': agent.days_until_expiry || 'N/A',
      'Days Until CE Deadline': agent.days_until_ce_deadline || 'N/A',
      'Pending Courses': agent.pending_courses
    }));

    if (format === 'csv') {
      const headers = Object.keys(reportData[0]);
      const csvContent = [
        headers.join(','),
        ...reportData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compliance-report-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('CSV report downloaded successfully!');
    } else {
      // For PDF, would implement with jsPDF or similar
      toast.success('PDF download would be implemented with jsPDF library');
    }
  };

  const getComplianceStatusBadge = (status: string) => {
    const styles = {
      compliant: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      at_risk: 'bg-amber-100 text-amber-800 border-amber-200', 
      deficient: 'bg-red-100 text-red-800 border-red-200',
      expired: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const icons = {
      compliant: CheckCircle2,
      at_risk: AlertTriangle,
      deficient: AlertTriangle,
      expired: Clock
    };

    const Icon = icons[status as keyof typeof icons];
    
    return (
      <Badge className={`${styles[status as keyof typeof styles]} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">IMO/FMO Admin Dashboard</h1>
          <p className="text-gray-600">Manage compliance for all your agents</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => sendBatchReminders()}
            disabled={isSendingReminders}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isSendingReminders ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Batch Reminders ({getAgentsDueWithin30Days().length})
              </>
            )}
          </Button>
          <Button 
            variant="outline"
            onClick={() => downloadComplianceReport('csv')}
          >
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
          <Button 
            variant="outline"
            onClick={() => downloadComplianceReport('pdf')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.total_agents}</div>
            <div className="text-sm text-gray-600">Total Agents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-600">{stats.compliant}</div>
            <div className="text-sm text-gray-600">Compliant</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-600">{stats.at_risk}</div>
            <div className="text-sm text-gray-600">At Risk</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{stats.deficient}</div>
            <div className="text-sm text-gray-600">Deficient</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-600">{stats.expired}</div>
            <div className="text-sm text-gray-600">Expired</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>

            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="CA">California</SelectItem>
                <SelectItem value="TX">Texas</SelectItem>
                <SelectItem value="FL">Florida</SelectItem>
                <SelectItem value="NY">New York</SelectItem>
                <SelectItem value="IL">Illinois</SelectItem>
              </SelectContent>
            </Select>

            <Select value={complianceFilter} onValueChange={setComplianceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Compliance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Compliance</SelectItem>
                <SelectItem value="compliant">Compliant</SelectItem>
                <SelectItem value="at_risk">At Risk</SelectItem>
                <SelectItem value="deficient">Deficient</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="state">State</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="expiry">License Expiry</SelectItem>
                <SelectItem value="ce_deadline">CE Deadline</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'} {sortOrder.toUpperCase()}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Agents Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Agents ({filteredAgents.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedAgents.length === filteredAgents.length && filteredAgents.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">
                Select All ({selectedAgents.length} selected)
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 w-12"></th>
                  <th className="text-left p-2">Agent</th>
                  <th className="text-left p-2">License</th>
                  <th className="text-left p-2">State</th>
                  <th className="text-left p-2">CE Progress</th>
                  <th className="text-left p-2">Compliance</th>
                  <th className="text-left p-2">Deadlines</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((agent) => (
                  <tr key={agent.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <Checkbox
                        checked={selectedAgents.includes(agent.id)}
                        onCheckedChange={(checked) => handleSelectAgent(agent.id, checked as boolean)}
                      />
                    </td>
                    <td className="p-2">
                      <div>
                        <div className="font-semibold">{agent.name}</div>
                        <div className="text-sm text-gray-600">{agent.email}</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{agent.license_type}</div>
                        <div className="text-sm text-gray-600">{agent.license_number}</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">{agent.state}</Badge>
                    </td>
                    <td className="p-2">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{agent.ce_credits_completed}/{agent.ce_credits_required}</span>
                          <span>{Math.round((agent.ce_credits_completed / agent.ce_credits_required) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(agent.ce_credits_completed / agent.ce_credits_required) * 100}
                          className="h-2"
                        />
                      </div>
                    </td>
                    <td className="p-2">
                      {getComplianceStatusBadge(agent.compliance_status)}
                    </td>
                    <td className="p-2">
                      <div className="text-sm space-y-1">
                        {agent.days_until_expiry !== null && (
                          <div className={`flex items-center gap-1 ${agent.days_until_expiry <= 30 ? 'text-red-600' : 'text-gray-600'}`}>
                            <Calendar className="h-3 w-3" />
                            License: {agent.days_until_expiry > 0 ? `${agent.days_until_expiry}d` : 'Expired'}
                          </div>
                        )}
                        {agent.days_until_ce_deadline !== null && (
                          <div className={`flex items-center gap-1 ${agent.days_until_ce_deadline <= 30 ? 'text-red-600' : 'text-gray-600'}`}>
                            <Clock className="h-3 w-3" />
                            CE: {agent.days_until_ce_deadline > 0 ? `${agent.days_until_ce_deadline}d` : 'Overdue'}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}