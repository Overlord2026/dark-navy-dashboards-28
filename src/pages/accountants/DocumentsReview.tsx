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
  FileText, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Download
} from 'lucide-react';

// Mock data
const mockDocuments = [
  {
    id: 1,
    client: 'Smith Family Trust',
    year: '2023',
    status: 'pending',
    lastUpdate: '2024-01-15',
    type: 'Individual Tax Return',
    priority: 'high'
  },
  {
    id: 2,
    client: 'Johnson LLC',
    year: '2023',
    status: 'reviewed',
    lastUpdate: '2024-01-14',
    type: 'Corporate Return',
    priority: 'medium'
  },
  {
    id: 3,
    client: 'Brown Estate',
    year: '2023',
    status: 'pending',
    lastUpdate: '2024-01-13',
    type: 'Estate Tax Return',
    priority: 'high'
  },
  {
    id: 4,
    client: 'Davis Corporation',
    year: '2023',
    status: 'completed',
    lastUpdate: '2024-01-12',
    type: 'Corporate Return',
    priority: 'low'
  },
  {
    id: 5,
    client: 'Miller Partnership',
    year: '2023',
    status: 'pending',
    lastUpdate: '2024-01-11',
    type: 'Partnership Return',
    priority: 'medium'
  },
  {
    id: 6,
    client: 'Wilson Family',
    year: '2023',
    status: 'reviewed',
    lastUpdate: '2024-01-10',
    type: 'Individual Tax Return',
    priority: 'low'
  },
  {
    id: 7,
    client: 'Taylor Trust',
    year: '2023',
    status: 'pending',
    lastUpdate: '2024-01-09',
    type: 'Trust Return',
    priority: 'high'
  },
  {
    id: 8,
    client: 'Anderson Inc',
    year: '2023',
    status: 'completed',
    lastUpdate: '2024-01-08',
    type: 'Corporate Return',
    priority: 'medium'
  }
];

export function DocumentsReview() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'reviewed':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/pros/accountants">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Documents Review</h1>
            <p className="text-muted-foreground">
              Review and manage client tax documents and returns
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  placeholder="Search clients..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Individual Tax Return">Individual</SelectItem>
                  <SelectItem value="Corporate Return">Corporate</SelectItem>
                  <SelectItem value="Partnership Return">Partnership</SelectItem>
                  <SelectItem value="Trust Return">Trust</SelectItem>
                  <SelectItem value="Estate Tax Return">Estate</SelectItem>
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
                <FileText className="w-5 h-5" />
                Client Documents ({filteredDocuments.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(doc.status)}
                      <div>
                        <h3 className="font-semibold">{doc.client}</h3>
                        <p className="text-sm text-muted-foreground">{doc.type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-medium">{doc.year}</p>
                        <p className="text-xs text-muted-foreground">Tax Year</p>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(doc.priority)}>
                          {doc.priority} priority
                        </Badge>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(doc.lastUpdate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Last updated</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
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
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No documents match your search criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}