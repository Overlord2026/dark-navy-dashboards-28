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
  Building2, 
  Scale,
  Eye,
  Edit,
  FileText,
  Calendar,
  Plus
} from 'lucide-react';

// Mock data for entities and trusts
const mockEntities = [
  {
    id: 1,
    name: 'Smith Family LLC',
    type: 'LLC',
    status: 'active',
    established: '2023-05-15',
    jurisdiction: 'Delaware',
    owners: 'John & Jane Smith'
  },
  {
    id: 2,
    name: 'Johnson Holdings Corp',
    type: 'Corporation',
    status: 'active',
    established: '2023-03-22',
    jurisdiction: 'Nevada',
    owners: 'Michael Johnson'
  },
  {
    id: 3,
    name: 'Brown Investment Partnership',
    type: 'Partnership',
    status: 'pending',
    established: '2024-01-10',
    jurisdiction: 'Wyoming',
    owners: 'Brown Family'
  },
  {
    id: 4,
    name: 'Davis Revocable Trust',
    type: 'Trust',
    status: 'active',
    established: '2022-11-08',
    jurisdiction: 'California',
    owners: 'Robert & Mary Davis'
  },
  {
    id: 5,
    name: 'Wilson Family Foundation',
    type: 'Foundation',
    status: 'active',
    established: '2021-08-30',
    jurisdiction: 'Florida',
    owners: 'Wilson Family'
  },
  {
    id: 6,
    name: 'Taylor Irrevocable Trust',
    type: 'Trust',
    status: 'active',
    established: '2023-07-12',
    jurisdiction: 'Texas',
    owners: 'Sarah Taylor'
  },
  {
    id: 7,
    name: 'Anderson Properties LLC',
    type: 'LLC',
    status: 'inactive',
    established: '2020-12-03',
    jurisdiction: 'Delaware',
    owners: 'Anderson Family'
  },
  {
    id: 8,
    name: 'Miller Charitable Trust',
    type: 'Trust',
    status: 'active',
    established: '2023-09-18',
    jurisdiction: 'New York',
    owners: 'Dr. Miller'
  }
];

export function EntitiesAndTrusts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredEntities = mockEntities.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entity.owners.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || entity.status === statusFilter;
    const matchesType = typeFilter === 'all' || entity.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Trust':
        return <Scale className="w-4 h-4" />;
      default:
        return <Building2 className="w-4 h-4" />;
    }
  };

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
            <h1 className="text-3xl font-bold text-foreground">Entities & Trusts</h1>
            <p className="text-muted-foreground">
              Manage legal entities, trusts, and business structures
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Entity
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">LLCs</p>
                  <p className="text-xl font-bold">
                    {mockEntities.filter(e => e.type === 'LLC').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Trusts</p>
                  <p className="text-xl font-bold">
                    {mockEntities.filter(e => e.type === 'Trust').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Corporations</p>
                  <p className="text-xl font-bold">
                    {mockEntities.filter(e => e.type === 'Corporation').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Active</p>
                  <p className="text-xl font-bold">
                    {mockEntities.filter(e => e.status === 'active').length}
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
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  placeholder="Search entities and trusts..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="LLC">LLC</SelectItem>
                  <SelectItem value="Corporation">Corporation</SelectItem>
                  <SelectItem value="Partnership">Partnership</SelectItem>
                  <SelectItem value="Trust">Trust</SelectItem>
                  <SelectItem value="Foundation">Foundation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Entities Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Entities & Trusts ({filteredEntities.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEntities.map((entity) => (
                <div key={entity.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getTypeIcon(entity.type)}
                      <div>
                        <h3 className="font-semibold">{entity.name}</h3>
                        <p className="text-sm text-muted-foreground">{entity.owners}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-medium">{entity.type}</p>
                        <p className="text-xs text-muted-foreground">{entity.jurisdiction}</p>
                      </div>
                      
                      <div>
                        <Badge className={getStatusColor(entity.status)}>
                          {entity.status}
                        </Badge>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(entity.established).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Established</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredEntities.length === 0 && (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No entities match your search criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}