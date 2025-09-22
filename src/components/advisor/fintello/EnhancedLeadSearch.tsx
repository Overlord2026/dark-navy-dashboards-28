import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter,
  Users,
  Phone,
  Mail,
  Building,
  MapPin,
  Star,
  Plus,
  Eye,
  Calendar
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  location: string;
  swagScore: number;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed';
  value?: number;
  lastContact?: string;
  notes?: string;
}

export function EnhancedLeadSearch() {
  const [leads] = useState<Lead[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '555-0123',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      swagScore: 85,
      source: 'LinkedIn',
      status: 'qualified',
      value: 250000,
      lastContact: '2024-01-20',
      notes: 'CEO of tech startup, interested in tax optimization'
    },
    {
      id: '2', 
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      phone: '555-0456',
      company: 'Johnson Enterprises',
      location: 'Austin, TX',
      swagScore: 92,
      source: 'Referral',
      status: 'proposal',
      value: 500000,
      lastContact: '2024-01-22',
      notes: 'Business owner looking for comprehensive wealth management'
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'mbrown@email.com', 
      phone: '555-0789',
      location: 'Denver, CO',
      swagScore: 78,
      source: 'Facebook Ad',
      status: 'contacted',
      value: 150000,
      lastContact: '2024-01-18',
      notes: 'Recently inherited assets, needs estate planning guidance'
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@corp.com',
      phone: '555-0321',
      company: 'Davis Holdings',
      location: 'Miami, FL',
      swagScore: 88,
      source: 'Website',
      status: 'new',
      value: 350000,
      notes: 'High net worth individual, retirement planning focus'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statuses = ['all', 'new', 'contacted', 'qualified', 'proposal', 'closed'];
  
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm) ||
                         (lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSWAGBadge = (score: number) => {
    if (score >= 90) return { label: 'Gold', color: 'bg-yellow-100 text-yellow-800' };
    if (score >= 75) return { label: 'Silver', color: 'bg-gray-100 text-gray-800' };
    return { label: 'Bronze', color: 'bg-orange-100 text-orange-800' };
  };

  const totalValue = filteredLeads.reduce((acc, lead) => acc + (lead.value || 0), 0);
  const averageSWAG = Math.round(filteredLeads.reduce((acc, lead) => acc + lead.swagScore, 0) / filteredLeads.length);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads by name, email, company, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{filteredLeads.length}</p>
                <p className="text-xs text-muted-foreground">Total Leads</p>
              </div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">${(totalValue / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground">Pipeline Value</p>
              </div>
              <Star className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{averageSWAG}</p>
                <p className="text-xs text-muted-foreground">Avg SWAG Score</p>
              </div>
              <Star className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{filteredLeads.filter(l => l.status === 'qualified').length}</p>
                <p className="text-xs text-muted-foreground">Qualified</p>
              </div>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(status)}
          >
            {status === 'all' ? 'All Leads' : status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.map((lead) => {
          const swagBadge = getSWAGBadge(lead.swagScore);
          
          return (
            <Card key={lead.id}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-lg">{lead.name}</h4>
                        {lead.company && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {lead.company}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {lead.location}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-3">
                    <div className="space-y-1">
                      <p className="text-sm flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </p>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="flex flex-col gap-2">
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </Badge>
                      <Badge className={swagBadge.color}>
                        {swagBadge.label} ({lead.swagScore})
                      </Badge>
                      <Badge variant="outline">
                        {lead.source}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="text-right">
                      {lead.value && (
                        <p className="text-lg font-bold text-green-600">
                          ${(lead.value / 1000).toFixed(0)}K
                        </p>
                      )}
                      {lead.lastContact && (
                        <p className="text-xs text-muted-foreground">
                          Last: {new Date(lead.lastContact).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="md:col-span-1">
                    <div className="flex flex-col gap-1">
                      <Button size="sm" variant="outline" className="h-8">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8">
                        <Calendar className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {lead.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">{lead.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add New Lead */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center">
            <Plus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <h4 className="font-medium">Add New Lead</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Import from LinkedIn, Facebook, or add manually
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm">
                Import from LinkedIn
              </Button>
              <Button variant="outline" size="sm">
                Import from Facebook
              </Button>
              <Button size="sm">
                Add Manually
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}