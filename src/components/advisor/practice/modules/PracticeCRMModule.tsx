import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Upload, 
  UserPlus, 
  MoreHorizontal,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Star,
  Tag
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function PracticeCRMModule() {
  const [searchTerm, setSearchTerm] = useState('');

  const clients = [
    {
      id: '1',
      name: 'Johnson Family',
      type: 'Household',
      status: 'Active',
      segment: 'High Net Worth',
      lastActivity: '2 days ago',
      nextReview: 'Mar 15, 2024',
      aum: '$2.4M',
      relationship: 'Primary',
      tags: ['Annual Review Due', 'RMD Eligible']
    },
    {
      id: '2',
      name: 'Sarah Chen',
      type: 'Individual',
      status: 'Prospect',
      segment: 'Professional',
      lastActivity: '1 week ago',
      nextReview: 'Mar 20, 2024',
      aum: 'TBD',
      relationship: 'Lead',
      tags: ['First Meeting Scheduled']
    },
    {
      id: '3',
      name: 'Miller Corporation 401(k)',
      type: 'Corporate',
      status: 'Active',
      segment: 'Institutional',
      lastActivity: '3 days ago',
      nextReview: 'Apr 1, 2024',
      aum: '$1.8M',
      relationship: 'Plan Sponsor',
      tags: ['Quarterly Review', 'Compliance']
    },
    {
      id: '4',
      name: 'Robert & Lisa Davis',
      type: 'Household',
      status: 'Active',
      segment: 'Mass Affluent',
      lastActivity: '1 day ago',
      nextReview: 'Mar 25, 2024',
      aum: '$875K',
      relationship: 'Joint',
      tags: ['Retirement Planning']
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return <Badge variant="default">Active</Badge>;
      case 'Prospect': return <Badge variant="secondary">Prospect</Badge>;
      case 'Inactive': return <Badge variant="outline">Inactive</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'High Net Worth': return 'text-purple-600 bg-purple-50';
      case 'Professional': return 'text-blue-600 bg-blue-50';
      case 'Institutional': return 'text-green-600 bg-green-50';
      case 'Mass Affluent': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search clients, households, or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Clients
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Import Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Import</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Upload className="h-5 w-5" />
              <span className="text-sm">CSV/Excel</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <span className="text-blue-600 font-bold text-lg">in</span>
              <span className="text-sm">LinkedIn</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <span className="text-green-600 font-bold text-sm">Redtail</span>
              <span className="text-sm">Import</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <span className="text-purple-600 font-bold text-sm">Wealthbox</span>
              <span className="text-sm">Import</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Client & Prospect Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name & Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Next Review</TableHead>
                <TableHead>AUM</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-muted">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">{client.type} • {client.relationship}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(client.status)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getSegmentColor(client.segment)}>
                      {client.segment}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {client.lastActivity}
                  </TableCell>
                  <TableCell className="text-sm">
                    {client.nextReview}
                  </TableCell>
                  <TableCell className="font-medium">
                    {client.aum}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {client.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {client.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{client.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}