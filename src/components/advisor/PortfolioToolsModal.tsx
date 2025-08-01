import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Shield, 
  FileText, 
  Download, 
  Search,
  TrendingUp,
  AlertTriangle,
  User,
  DollarSign,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  portfolioValue: number;
  riskScore: number;
  lastReview: string;
  status: 'active' | 'review-needed' | 'proposal-sent';
}

interface PortfolioToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    portfolioValue: 850000,
    riskScore: 72,
    lastReview: '2024-01-15',
    status: 'review-needed'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    portfolioValue: 1250000,
    riskScore: 45,
    lastReview: '2024-02-20',
    status: 'active'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    portfolioValue: 650000,
    riskScore: 63,
    lastReview: '2024-01-08',
    status: 'proposal-sent'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    portfolioValue: 950000,
    riskScore: 38,
    lastReview: '2024-03-01',
    status: 'active'
  },
  {
    id: '5',
    name: 'Robert Wilson',
    email: 'robert.wilson@email.com',
    portfolioValue: 1150000,
    riskScore: 85,
    lastReview: '2024-01-22',
    status: 'review-needed'
  }
];

export function PortfolioToolsModal({ isOpen, onClose }: PortfolioToolsModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState('clients');

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskBadge = (score: number) => {
    if (score <= 30) return { label: 'Conservative', color: 'bg-green-100 text-green-800' };
    if (score <= 60) return { label: 'Moderate', color: 'bg-blue-100 text-blue-800' };
    if (score <= 80) return { label: 'Growth', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Aggressive', color: 'bg-red-100 text-red-800' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'review-needed':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'proposal-sent':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleGenerateProposal = (client: Client) => {
    console.log('Generating portfolio proposal for:', client.name);
    // Navigate to portfolio generator with client data pre-filled
    window.open(`/portfolio?client=${encodeURIComponent(client.name)}&value=${client.portfolioValue}`, '_blank');
  };

  const handleRiskAnalysis = (client: Client) => {
    console.log('Running risk analysis for:', client.name);
    // Open risk analysis tool with client data
    setSelectedClient(client);
    setActiveTab('risk-analysis');
  };

  const handleExportReport = (client: Client) => {
    console.log('Exporting report for:', client.name);
    // Export comprehensive portfolio report
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Portfolio Tools & Client Management
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="clients">Client Selection</TabsTrigger>
            <TabsTrigger value="portfolio-generator">Portfolio Generator</TabsTrigger>
            <TabsTrigger value="risk-analysis">Risk Analysis</TabsTrigger>
            <TabsTrigger value="reports">Reports & Export</TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <User className="h-4 w-4 mr-2" />
                Add New Client
              </Button>
            </div>

            <div className="grid gap-4">
              {filteredClients.map((client) => {
                const riskBadge = getRiskBadge(client.riskScore);
                return (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              {getStatusIcon(client.status)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{client.name}</h3>
                              <p className="text-sm text-muted-foreground">{client.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={riskBadge.color}>
                                  {riskBadge.label} ({client.riskScore})
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  ${(client.portfolioValue / 1000000).toFixed(1)}M portfolio
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateProposal(client)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Generate Proposal
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRiskAnalysis(client)}
                            >
                              <Shield className="h-4 w-4 mr-1" />
                              Risk Analysis
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExportReport(client)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Export
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="portfolio-generator" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Proposal Generator</CardTitle>
                <CardDescription>
                  Create comprehensive portfolio proposals with risk analysis and performance projections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Current Portfolio Analysis</h4>
                        <p className="text-sm text-muted-foreground">Upload statements or connect accounts</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Target className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Model Proposals</h4>
                        <p className="text-sm text-muted-foreground">Generate recommendations from models</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Performance Projections</h4>
                        <p className="text-sm text-muted-foreground">Risk-adjusted return analysis</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1" onClick={() => window.open('/portfolio', '_blank')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Open Portfolio Generator
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      window.open('/portfolio?loadSample=true', '_blank');
                    }}
                  >
                    Load Sample Portfolio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk-analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Risk Analysis Tools</CardTitle>
                <CardDescription>
                  {selectedClient 
                    ? `Analyzing risk profile for ${selectedClient.name}` 
                    : 'Comprehensive risk assessment and scenario analysis'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedClient ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{selectedClient.riskScore}</div>
                          <div className="text-sm text-muted-foreground">Current Risk Score</div>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            ${(selectedClient.portfolioValue / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-sm text-muted-foreground">Portfolio Value</div>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">12.5%</div>
                          <div className="text-sm text-muted-foreground">Portfolio Volatility</div>
                        </div>
                      </Card>
                    </div>

                    <div className="flex gap-4">
                      <Button>
                        <Shield className="h-4 w-4 mr-2" />
                        Run Full Risk Analysis
                      </Button>
                      <Button variant="outline">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Scenario Analysis
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Risk Report
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a client to run risk analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Export</CardTitle>
                <CardDescription>
                  Generate professional reports and export portfolio analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium">Portfolio Proposal Report</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Comprehensive proposal with current vs. proposed analysis
                    </p>
                    <Button variant="outline" className="w-full">
                      Generate Proposal Report
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="h-5 w-5 text-red-600" />
                      <h4 className="font-medium">Risk Assessment Report</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Detailed risk analysis with scenario modeling
                    </p>
                    <Button variant="outline" className="w-full">
                      Generate Risk Report
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium">Performance Review</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Historical performance and benchmark comparison
                    </p>
                    <Button variant="outline" className="w-full">
                      Generate Performance Report
                    </Button>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                      <h4 className="font-medium">Fee Analysis</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Cost comparison and fee structure analysis
                    </p>
                    <Button variant="outline" className="w-full">
                      Generate Fee Report
                    </Button>
                  </Card>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Bulk Operations</h4>
                  <div className="flex gap-4">
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Export All Client Reports
                    </Button>
                    <Button variant="outline">
                      Schedule Automated Reports
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}