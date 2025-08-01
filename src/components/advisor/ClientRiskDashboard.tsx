import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  Clock, 
  Target, 
  TrendingDown, 
  FileX, 
  Shield,
  Filter,
  Search,
  ArrowRight,
  Calendar,
  DollarSign,
  Users,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export interface ClientRisk {
  id: string;
  name: string;
  email: string;
  tier: 'Basic' | 'Premium' | 'Elite';
  aum: number;
  lastContact: string;
  riskFlags: {
    type: 'RMD' | 'SecureAct' | 'RothOpportunity' | 'HighTaxDrag' | 'MissingReturn' | 'InheritancePlanning' | 'TaxLossHarvesting';
    urgency: 'High' | 'Medium' | 'Low';
    description: string;
    estimatedSavings?: number;
    dueDate?: string;
  }[];
}

const mockClients: ClientRisk[] = [
  {
    id: '1',
    name: 'Johnson Family Trust',
    email: 'contact@johnsonfamily.com',
    tier: 'Elite',
    aum: 15800000,
    lastContact: '2024-01-10',
    riskFlags: [
      { type: 'RMD', urgency: 'High', description: 'RMD due in 30 days', estimatedSavings: 45000, dueDate: '2024-02-15' },
      { type: 'RothOpportunity', urgency: 'Medium', description: 'Tax-efficient Roth conversion window', estimatedSavings: 125000 }
    ]
  },
  {
    id: '2',
    name: 'Chen Holdings LLC',
    email: 'admin@chenholdings.com',
    tier: 'Premium',
    aum: 8500000,
    lastContact: '2024-01-08',
    riskFlags: [
      { type: 'HighTaxDrag', urgency: 'High', description: 'Portfolio tax inefficiency detected', estimatedSavings: 78000 },
      { type: 'TaxLossHarvesting', urgency: 'Medium', description: 'Unrealized losses available for harvesting', estimatedSavings: 35000 }
    ]
  },
  {
    id: '3',
    name: 'Wilson Retirement Fund',
    email: 'info@wilsonretirement.com',
    tier: 'Basic',
    aum: 3200000,
    lastContact: '2024-01-05',
    riskFlags: [
      { type: 'MissingReturn', urgency: 'High', description: '2023 tax return not filed', dueDate: '2024-04-15' },
      { type: 'SecureAct', urgency: 'Medium', description: 'SECURE Act compliance review needed' }
    ]
  },
  {
    id: '4',
    name: 'Rodriguez Estate',
    email: 'estate@rodriguez.com',
    tier: 'Elite',
    aum: 22000000,
    lastContact: '2024-01-12',
    riskFlags: [
      { type: 'InheritancePlanning', urgency: 'High', description: 'Estate tax planning window closing', estimatedSavings: 890000, dueDate: '2024-03-01' }
    ]
  }
];

const riskTypeConfig = {
  'RMD': { label: 'RMD Required', icon: Clock, color: 'bg-red-100 text-red-800 border-red-200' },
  'SecureAct': { label: 'SECURE Act', icon: Shield, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  'RothOpportunity': { label: 'Roth Opportunity', icon: Target, color: 'bg-green-100 text-green-800 border-green-200' },
  'HighTaxDrag': { label: 'High Tax Drag', icon: TrendingDown, color: 'bg-orange-100 text-orange-800 border-orange-200' },
  'MissingReturn': { label: 'Missing Return', icon: FileX, color: 'bg-red-100 text-red-800 border-red-200' },
  'InheritancePlanning': { label: 'Inheritance Planning', icon: Users, color: 'bg-purple-100 text-purple-800 border-purple-200' },
  'TaxLossHarvesting': { label: 'Tax Loss Harvesting', icon: DollarSign, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
};

const urgencyConfig = {
  'High': { color: 'bg-red-500', textColor: 'text-red-700' },
  'Medium': { color: 'bg-yellow-500', textColor: 'text-yellow-700' },
  'Low': { color: 'bg-green-500', textColor: 'text-green-700' }
};

export const ClientRiskDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterUrgency, setFilterUrgency] = useState<string>('all');

  const filteredClients = useMemo(() => {
    return mockClients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || 
                         client.riskFlags.some(flag => flag.type === filterType);
      
      const matchesTier = filterTier === 'all' || client.tier === filterTier;
      
      const matchesUrgency = filterUrgency === 'all' || 
                            client.riskFlags.some(flag => flag.urgency === filterUrgency);
      
      return matchesSearch && matchesType && matchesTier && matchesUrgency;
    });
  }, [searchTerm, filterType, filterTier, filterUrgency]);

  const totalRisks = useMemo(() => {
    return filteredClients.reduce((sum, client) => sum + client.riskFlags.length, 0);
  }, [filteredClients]);

  const highUrgencyRisks = useMemo(() => {
    return filteredClients.reduce((sum, client) => 
      sum + client.riskFlags.filter(flag => flag.urgency === 'High').length, 0);
  }, [filteredClients]);

  const potentialSavings = useMemo(() => {
    return filteredClients.reduce((sum, client) => 
      sum + client.riskFlags.reduce((flagSum, flag) => flagSum + (flag.estimatedSavings || 0), 0), 0);
  }, [filteredClients]);

  const launchWorkflow = (clientId: string, workflowType: string) => {
    const client = mockClients.find(c => c.id === clientId);
    toast.success(`Launching ${workflowType} workflow for ${client?.name}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getWorkflowType = (flagType: string) => {
    const workflowMap: Record<string, string> = {
      'RMD': 'RMD Optimizer',
      'RothOpportunity': 'Roth Conversion',
      'InheritancePlanning': 'Inheritance Planning',
      'MissingReturn': 'Tax Return Review',
      'HighTaxDrag': 'Tax Optimization',
      'TaxLossHarvesting': 'Tax Loss Harvesting',
      'SecureAct': 'SECURE Act Review'
    };
    return workflowMap[flagType] || 'Tax Analysis';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Total Risks</p>
                <p className="text-2xl font-bold">{totalRisks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">High Urgency</p>
                <p className="text-2xl font-bold text-destructive">{highUrgencyRisks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Potential Savings</p>
                <p className="text-2xl font-bold text-success">{formatCurrency(potentialSavings)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Clients</p>
                <p className="text-2xl font-bold">{filteredClients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by alert type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alert Types</SelectItem>
                {Object.entries(riskTypeConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterTier} onValueChange={setFilterTier}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Elite">Elite</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterUrgency} onValueChange={setFilterUrgency}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgency Levels</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Client Risk List */}
      <div className="space-y-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{client.name}</h3>
                    <Badge variant="outline" className={
                      client.tier === 'Elite' ? 'border-purple-300 text-purple-700' :
                      client.tier === 'Premium' ? 'border-blue-300 text-blue-700' :
                      'border-gray-300 text-gray-700'
                    }>
                      {client.tier}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <span>AUM: {formatCurrency(client.aum)}</span>
                    <span>Last Contact: {new Date(client.lastContact).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Risk Count</p>
                  <p className="text-2xl font-bold">{client.riskFlags.length}</p>
                </div>
              </div>

              <div className="space-y-3">
                {client.riskFlags.map((flag, index) => {
                  const config = riskTypeConfig[flag.type];
                  const urgencyConfig_local = urgencyConfig[flag.urgency];
                  const Icon = config.icon;

                  return (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${config.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{config.label}</span>
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${urgencyConfig_local.color}`} />
                              <span className={`text-xs font-medium ${urgencyConfig_local.textColor}`}>
                                {flag.urgency}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{flag.description}</p>
                          {flag.estimatedSavings && (
                            <p className="text-sm font-medium text-success">
                              Potential Savings: {formatCurrency(flag.estimatedSavings)}
                            </p>
                          )}
                          {flag.dueDate && (
                            <div className="flex items-center gap-1 mt-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                Due: {new Date(flag.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => launchWorkflow(client.id, getWorkflowType(flag.type))}
                        className="ml-4"
                        size="sm"
                      >
                        Launch {getWorkflowType(flag.type)}
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No clients found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find clients with risk alerts.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};