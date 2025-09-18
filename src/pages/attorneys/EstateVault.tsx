import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Search, 
  Shield, 
  FileText,
  Download,
  Lock,
  Unlock,
  Calendar,
  User,
  Plus,
  Archive
} from 'lucide-react';

// Mock data for estate vault documents
const mockVaultDocuments = [
  {
    id: 1,
    name: 'Smith Family Will - Final',
    type: 'Will',
    client: 'John & Jane Smith',
    status: 'executed',
    lastModified: '2024-01-15',
    size: '2.4 MB',
    locked: false,
    category: 'Estate Planning'
  },
  {
    id: 2,
    name: 'Johnson Trust Agreement',
    type: 'Trust Document',
    client: 'Michael Johnson',
    status: 'draft',
    lastModified: '2024-01-12',
    size: '3.8 MB',
    locked: true,
    category: 'Trust Administration'
  },
  {
    id: 3,
    name: 'Brown Power of Attorney',
    type: 'Power of Attorney',
    client: 'Robert Brown',
    status: 'pending_signature',
    lastModified: '2024-01-10',
    size: '1.2 MB',
    locked: false,
    category: 'Legal Documents'
  },
  {
    id: 4,
    name: 'Davis Healthcare Directive',
    type: 'Healthcare Directive',
    client: 'Mary Davis',
    status: 'executed',
    lastModified: '2024-01-08',
    size: '856 KB',
    locked: false,
    category: 'Healthcare'
  },
  {
    id: 5,
    name: 'Wilson Foundation Bylaws',
    type: 'Bylaws',
    client: 'Wilson Foundation',
    status: 'active',
    lastModified: '2024-01-05',
    size: '4.2 MB',
    locked: false,
    category: 'Entity Documents'
  },
  {
    id: 6,
    name: 'Taylor Trust Amendment #3',
    type: 'Trust Amendment',
    client: 'Sarah Taylor',
    status: 'review',
    lastModified: '2024-01-03',
    size: '678 KB',
    locked: true,
    category: 'Trust Administration'
  },
  {
    id: 7,
    name: 'Anderson Estate Inventory',
    type: 'Estate Inventory',
    client: 'Anderson Estate',
    status: 'completed',
    lastModified: '2023-12-28',
    size: '5.1 MB',
    locked: false,
    category: 'Estate Administration'
  },
  {
    id: 8,
    name: 'Miller Charitable Trust Tax Returns',
    type: 'Tax Document',
    client: 'Miller Charitable Trust',
    status: 'filed',
    lastModified: '2023-12-20',
    size: '2.9 MB',
    locked: false,
    category: 'Tax Planning'
  }
];

export function EstateVault() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredDocuments = mockVaultDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'executed':
      case 'active':
      case 'completed':
      case 'filed':
        return 'bg-green-100 text-green-800';
      case 'pending_signature':
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending_signature':
        return 'Pending Signature';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const categories = [...new Set(mockVaultDocuments.map(doc => doc.category))];
  const statuses = [...new Set(mockVaultDocuments.map(doc => doc.status))];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/pros/attorneys">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Estate Vault</h1>
            <p className="text-muted-foreground">
              Secure document storage and management for estate planning matters
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {/* Vault Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Documents</p>
                  <p className="text-xl font-bold">{mockVaultDocuments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Secured</p>
                  <p className="text-xl font-bold">
                    {mockVaultDocuments.filter(doc => doc.locked).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-xl font-bold">
                    {mockVaultDocuments.filter(doc => 
                      doc.status === 'pending_signature' || doc.status === 'review'
                    ).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Archive className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Executed</p>
                  <p className="text-xl font-bold">
                    {mockVaultDocuments.filter(doc => 
                      doc.status === 'executed' || doc.status === 'completed'
                    ).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search & Filter Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  placeholder="Search documents and clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Documents Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Vault Documents ({filteredDocuments.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {doc.locked ? (
                          <Lock className="w-4 h-4 text-red-500" />
                        ) : (
                          <Unlock className="w-4 h-4 text-green-500" />
                        )}
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {doc.client}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-medium">{doc.type}</p>
                        <p className="text-xs text-muted-foreground">{doc.category}</p>
                      </div>
                      
                      <div>
                        <Badge className={getStatusColor(doc.status)}>
                          {getStatusLabel(doc.status)}
                        </Badge>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">{doc.size}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(doc.lastModified).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredDocuments.length === 0 && (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No documents match your search criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}