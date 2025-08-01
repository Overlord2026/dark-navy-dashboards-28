import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Brain,
  Merge,
  Filter,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentMetadata {
  id: string;
  name: string;
  type: string;
  year: number;
  status: string;
  source: string;
  tags: string[];
}

interface ClientData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  entityType?: string;
  source: string;
  importedAt: Date;
  documents: DocumentMetadata[];
  confidence: number;
  suggestedMatches: string[];
  aiAnalysis: {
    businessType: string;
    complexity: 'low' | 'medium' | 'high';
    suggestedServices: string[];
    riskFactors: string[];
  };
}

const mockClientData: ClientData[] = [
  {
    id: '1',
    name: 'TechStartup Solutions LLC',
    email: 'contact@techstartup.com',
    phone: '(555) 123-4567',
    taxId: '87-1234567',
    entityType: 'LLC',
    source: 'QuickBooks',
    importedAt: new Date(),
    confidence: 92,
    suggestedMatches: [],
    documents: [
      {
        id: 'd1',
        name: 'Form 1065 - 2023',
        type: 'tax_return',
        year: 2023,
        status: 'complete',
        source: 'QuickBooks',
        tags: ['partnership', 'K-1']
      },
      {
        id: 'd2',
        name: 'Financial Statements Q4 2023',
        type: 'financial',
        year: 2023,
        status: 'pending_review',
        source: 'QuickBooks',
        tags: ['quarterly', 'compilation']
      }
    ],
    aiAnalysis: {
      businessType: 'Technology Services',
      complexity: 'medium',
      suggestedServices: ['Monthly Bookkeeping', 'Tax Planning', 'R&D Credits'],
      riskFactors: ['High growth phase', 'Multiple states']
    }
  },
  {
    id: '2',
    name: 'Johnson Family Trust',
    email: 'trustee@johnsonfamily.com',
    taxId: '99-8765432',
    entityType: 'Trust',
    source: 'Lacerte',
    importedAt: new Date(),
    confidence: 88,
    suggestedMatches: ['Johnson, Robert & Mary'],
    documents: [
      {
        id: 'd3',
        name: 'Form 1041 - 2023',
        type: 'tax_return',
        year: 2023,
        status: 'draft',
        source: 'Lacerte',
        tags: ['trust', 'complex']
      }
    ],
    aiAnalysis: {
      businessType: 'Family Trust',
      complexity: 'high',
      suggestedServices: ['Estate Planning', 'Trust Administration', 'Tax Optimization'],
      riskFactors: ['Multiple beneficiaries', 'Real estate holdings']
    }
  },
  {
    id: '3',
    name: 'Corner Market Inc',
    email: 'info@cornermarket.com',
    phone: '(555) 987-6543',
    taxId: '45-9876543',
    entityType: 'C-Corp',
    source: 'Drake',
    importedAt: new Date(),
    confidence: 76,
    suggestedMatches: ['Corner Store LLC', 'Market Solutions Inc'],
    documents: [
      {
        id: 'd4',
        name: 'Form 1120 - 2023',
        type: 'tax_return',
        year: 2023,
        status: 'pending',
        source: 'Drake',
        tags: ['corporate', 'retail']
      }
    ],
    aiAnalysis: {
      businessType: 'Retail/Grocery',
      complexity: 'medium',
      suggestedServices: ['Monthly Bookkeeping', 'Payroll', 'Sales Tax'],
      riskFactors: ['Inventory management', 'Cash transactions']
    }
  }
];

export function ClientMappingEngine() {
  const [clients, setClients] = useState<ClientData[]>(mockClientData);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [filterBy, setFilterBy] = useState<'all' | 'high_confidence' | 'needs_review'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterBy === 'all' ||
      (filterBy === 'high_confidence' && client.confidence >= 85) ||
      (filterBy === 'needs_review' && (client.confidence < 85 || client.suggestedMatches.length > 0));
    
    return matchesSearch && matchesFilter;
  });

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const processClient = (clientId: string, action: 'approve' | 'merge' | 'skip') => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    toast({
      title: `Client ${action}d`,
      description: `${client.name} has been ${action}d successfully`,
    });

    // Remove from list if approved or skipped
    if (action !== 'merge') {
      setClients(prev => prev.filter(c => c.id !== clientId));
    }
  };

  const exportMapping = () => {
    toast({
      title: "Export Started",
      description: "Client mapping report is being generated...",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Smart Client Mapper
          </h3>
          <p className="text-muted-foreground">
            AI-powered client matching with duplicate detection and document meta-tagging
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportMapping}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              High Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clients.filter(c => c.confidence >= 85).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-yellow-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Needs Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clients.filter(c => c.confidence < 85 || c.suggestedMatches.length > 0).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-600 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clients.reduce((sum, c) => sum + c.documents.length, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Label htmlFor="search">Search Clients</Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="search"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div>
          <Label>Filter</Label>
          <div className="flex gap-2 mt-1">
            <Button
              variant={filterBy === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('all')}
            >
              All
            </Button>
            <Button
              variant={filterBy === 'high_confidence' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('high_confidence')}
            >
              High Confidence
            </Button>
            <Button
              variant={filterBy === 'needs_review' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('needs_review')}
            >
              Needs Review
            </Button>
          </div>
        </div>
      </div>

      {/* Client List */}
      <div className="space-y-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg">{client.name}</h4>
                      <Badge variant="outline">{client.entityType}</Badge>
                      <Badge variant="outline">{client.source}</Badge>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">{client.confidence}% confidence</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>Email: {client.email || 'Not provided'}</div>
                      <div>Phone: {client.phone || 'Not provided'}</div>
                      <div>Tax ID: {client.taxId || 'Not provided'}</div>
                      <div>Imported: {client.importedAt.toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => processClient(client.id, 'approve')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    {client.suggestedMatches.length > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => processClient(client.id, 'merge')}
                      >
                        <Merge className="w-4 h-4 mr-1" />
                        Merge
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => processClient(client.id, 'skip')}
                    >
                      Skip
                    </Button>
                  </div>
                </div>

                {/* Suggested Matches */}
                {client.suggestedMatches.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Potential Matches Found</span>
                    </div>
                    <div className="flex gap-2">
                      {client.suggestedMatches.map((match) => (
                        <Badge key={match} variant="outline" className="text-yellow-700">
                          {match}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Analysis and Documents */}
                <Tabs defaultValue="analysis" className="w-full">
                  <TabsList>
                    <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
                    <TabsTrigger value="documents">Documents ({client.documents.length})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="analysis" className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Business Type</Label>
                        <p className="text-sm text-muted-foreground">{client.aiAnalysis.businessType}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Complexity</Label>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getComplexityColor(client.aiAnalysis.complexity)}`}></div>
                          <span className="text-sm capitalize">{client.aiAnalysis.complexity}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Suggested Services</Label>
                      <div className="flex gap-2 mt-1">
                        {client.aiAnalysis.suggestedServices.map((service) => (
                          <Badge key={service} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Risk Factors</Label>
                      <div className="flex gap-2 mt-1">
                        {client.aiAnalysis.riskFactors.map((risk) => (
                          <Badge key={risk} variant="outline" className="text-xs text-red-600">
                            {risk}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="documents">
                    <div className="space-y-2">
                      {client.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium text-sm">{doc.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {doc.type} • {doc.year} • {doc.source}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={doc.status === 'complete' ? 'default' : 'outline'}
                              className="text-xs"
                            >
                              {doc.status.replace('_', ' ')}
                            </Badge>
                            <div className="flex gap-1">
                              {doc.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No clients found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search criteria' : 'No clients match the current filter'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}