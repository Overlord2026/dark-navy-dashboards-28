import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  AlertTriangle, 
  Download, 
  Send, 
  BarChart,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Filter,
  Search,
  Mail
} from 'lucide-react';
import { DashboardWidgets } from './DashboardWidgets';
import { ClientStatusCards } from './ClientStatusCards';
import { BatchActions } from './BatchActions';

interface Client {
  id: string;
  name: string;
  email: string;
  status: 'action-needed' | 'pending-review' | 'up-to-date';
  lastActivity: string;
  documentsRequired: number;
  aiOpportunities: number;
  priority: 'high' | 'medium' | 'low';
  taxSavingsEstimate: number;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    status: 'action-needed',
    lastActivity: '3 days ago',
    documentsRequired: 2,
    aiOpportunities: 3,
    priority: 'high',
    taxSavingsEstimate: 15000
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    status: 'pending-review',
    lastActivity: '1 day ago',
    documentsRequired: 0,
    aiOpportunities: 1,
    priority: 'medium',
    taxSavingsEstimate: 8500
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    status: 'up-to-date',
    lastActivity: 'Today',
    documentsRequired: 0,
    aiOpportunities: 2,
    priority: 'low',
    taxSavingsEstimate: 12000
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    status: 'action-needed',
    lastActivity: '5 days ago',
    documentsRequired: 4,
    aiOpportunities: 5,
    priority: 'high',
    taxSavingsEstimate: 22000
  },
  {
    id: '5',
    name: 'Robert Wilson',
    email: 'robert.wilson@email.com',
    status: 'pending-review',
    lastActivity: '2 days ago',
    documentsRequired: 1,
    aiOpportunities: 2,
    priority: 'medium',
    taxSavingsEstimate: 9800
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    status: 'up-to-date',
    lastActivity: 'Today',
    documentsRequired: 0,
    aiOpportunities: 1,
    priority: 'low',
    taxSavingsEstimate: 5500
  }
];

export function AdvisorDashboard() {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate dashboard metrics
  const metrics = {
    clientsRequiringAction: mockClients.filter(c => c.status === 'action-needed').length,
    pendingDocReviews: mockClients.filter(c => c.status === 'pending-review').length,
    aiFlaggedOpportunities: mockClients.reduce((sum, c) => sum + c.aiOpportunities, 0),
    totalTaxSavings: mockClients.reduce((sum, c) => sum + c.taxSavingsEstimate, 0),
    totalClients: mockClients.length
  };

  const filteredClients = mockClients.filter(client => {
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleClientSelect = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSelectAll = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map(c => c.id));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="space-y-6 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Advisor Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage your clients and streamline your tax advisory practice
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2 min-h-[44px] px-4 py-2"
              aria-label="Add new client"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Add Client</span>
            </Button>
            <Button 
              className="flex items-center justify-center gap-2 min-h-[44px] px-4 py-2"
              aria-label="Export dashboard report"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Export Report</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Dashboard Widgets */}
      <motion.div variants={itemVariants}>
        <DashboardWidgets metrics={metrics} />
      </motion.div>

      {/* Main Content Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="clients" className="space-y-4">
          <TabsList className="w-full sm:w-auto" role="tablist">
            <TabsTrigger value="clients" className="flex-1 sm:flex-none" role="tab">
              Client Management
            </TabsTrigger>
            <TabsTrigger value="batch" className="flex-1 sm:flex-none" role="tab">
              Batch Actions
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex-1 sm:flex-none" role="tab">
              Reports & Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="space-y-4" role="tabpanel">
            {/* Filters and Search */}
            <Card>
              <CardHeader className="px-4 sm:px-6">
                <div className="flex flex-col gap-4">
                  <CardTitle className="text-lg sm:text-xl">Client Portfolio</CardTitle>
                  
                  {/* Mobile-first responsive layout */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" aria-hidden="true" />
                      <input
                        type="search"
                        inputMode="search"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 sm:py-2 border rounded-md text-sm min-h-[44px] sm:min-h-[36px]"
                        aria-label="Search clients by name or email"
                      />
                    </div>
                    
                    {/* Status Filter */}
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-3 sm:py-2 border rounded-md text-sm min-h-[44px] sm:min-h-[36px] bg-white"
                      aria-label="Filter clients by status"
                    >
                      <option value="all">All Status</option>
                      <option value="action-needed">Action Needed</option>
                      <option value="pending-review">Pending Review</option>
                      <option value="up-to-date">Up to Date</option>
                    </select>
                  </div>

                  {/* Bulk Actions - Mobile responsive */}
                  {selectedClients.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2" role="region" aria-label="Bulk actions">
                      <Badge variant="secondary" className="text-xs">
                        {selectedClients.length} selected
                      </Badge>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 sm:flex-none min-h-[44px] px-3 py-2"
                          aria-label={`Request documents from ${selectedClients.length} selected clients`}
                        >
                          <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
                          <span>Request Docs</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 sm:flex-none min-h-[44px] px-3 py-2"
                          aria-label={`Run analysis for ${selectedClients.length} selected clients`}
                        >
                          <BarChart className="h-4 w-4 mr-2" aria-hidden="true" />
                          <span>Run Analysis</span>
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Selection controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                      className="w-full sm:w-auto min-h-[44px] px-4 py-2"
                      aria-label={selectedClients.length === filteredClients.length ? 'Deselect all clients' : 'Select all filtered clients'}
                    >
                      {selectedClients.length === filteredClients.length ? 'Deselect All' : 'Select All'}
                    </Button>
                    <span className="text-sm text-muted-foreground" aria-live="polite">
                      Showing {filteredClients.length} of {mockClients.length} clients
                    </span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Client Status Cards */}
            <div role="region" aria-label="Client portfolio cards">
              <ClientStatusCards 
                clients={filteredClients}
                selectedClients={selectedClients}
                onClientSelect={handleClientSelect}
              />
            </div>
          </TabsContent>

          <TabsContent value="batch" className="space-y-4">
            <BatchActions clients={mockClients} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
                <CardDescription>
                  Generate comprehensive reports and insights for your practice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Client Portfolio Summary</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Comprehensive overview of all client statuses and opportunities
                    </p>
                    <Button size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Tax Savings Analysis</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Detailed breakdown of identified tax-saving opportunities
                    </p>
                    <Button size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Practice Performance</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Key metrics and trends for your advisory practice
                    </p>
                    <Button size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}