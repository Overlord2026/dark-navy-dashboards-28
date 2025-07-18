import React, { useState } from 'react';
import { AdminPortalLayout } from '@/components/admin/AdminPortalLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  UserCheck, 
  UserPlus, 
  Search, 
  MoreHorizontal,
  Mail,
  User,
  DollarSign,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AdminClients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAdvisor, setFilterAdvisor] = useState('all');

  // Mock data - replace with actual data fetching
  const clients = [
    {
      id: '1',
      name: 'Robert Williams',
      email: 'robert.williams@email.com',
      status: 'active',
      segment: 'physicians',
      advisorId: '1',
      advisorName: 'Sarah Johnson',
      aum: 2500000,
      onboardingProgress: 100,
      lastActivity: '2024-01-14',
      joinDate: '2023-08-15',
      riskTolerance: 'moderate'
    },
    {
      id: '2',
      name: 'Jennifer Davis',
      email: 'jennifer.davis@email.com',
      status: 'prospect',
      segment: 'business_owners',
      advisorId: null,
      advisorName: 'Unassigned',
      aum: 0,
      onboardingProgress: 25,
      lastActivity: '2024-01-12',
      joinDate: '2024-01-10',
      riskTolerance: 'aggressive'
    },
    {
      id: '3',
      name: 'David Thompson',
      email: 'david.thompson@email.com',
      status: 'active',
      segment: 'executives',
      advisorId: '3',
      advisorName: 'Emily Rodriguez',
      aum: 1800000,
      onboardingProgress: 100,
      lastActivity: '2024-01-13',
      joinDate: '2023-11-05',
      riskTolerance: 'conservative'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'prospect':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Prospect</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'onboarding':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Onboarding</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSegmentBadge = (segment: string) => {
    const segmentLabels = {
      physicians: 'Physicians',
      business_owners: 'Business Owners',
      executives: 'Executives',
      high_net_worth: 'High Net Worth'
    };
    return <Badge variant="outline">{segmentLabels[segment as keyof typeof segmentLabels] || segment}</Badge>;
  };

  const getRiskBadge = (risk: string) => {
    const colors = {
      conservative: 'bg-green-100 text-green-800',
      moderate: 'bg-yellow-100 text-yellow-800',
      aggressive: 'bg-red-100 text-red-800'
    };
    return <Badge variant="outline" className={colors[risk as keyof typeof colors]}>{risk}</Badge>;
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    const matchesAdvisor = filterAdvisor === 'all' || client.advisorId === filterAdvisor;
    
    return matchesSearch && matchesStatus && matchesAdvisor;
  });

  return (
    <AdminPortalLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clients & Prospects</h1>
            <p className="text-muted-foreground">
              CRM-style management of all clients and prospects in your tenant.
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Invite Client
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {clients.filter(c => c.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">Active clients</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prospects</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {clients.filter(c => c.status === 'prospect').length}
              </div>
              <p className="text-xs text-muted-foreground">In pipeline</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total AUM</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(clients.reduce((sum, c) => sum + c.aum, 0) / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">Client assets</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg AUM</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${Math.round(clients.filter(c => c.aum > 0).reduce((sum, c) => sum + c.aum, 0) / clients.filter(c => c.aum > 0).length / 1000000 * 10) / 10}M
              </div>
              <p className="text-xs text-muted-foreground">Per active client</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Client Directory</CardTitle>
            <CardDescription>Manage client relationships and track onboarding progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterAdvisor} onValueChange={setFilterAdvisor}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Advisor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Advisors</SelectItem>
                    <SelectItem value="1">Sarah Johnson</SelectItem>
                    <SelectItem value="3">Emily Rodriguez</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clients Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-4">Client</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Segment</th>
                    <th className="text-left p-4">Advisor</th>
                    <th className="text-left p-4">AUM</th>
                    <th className="text-left p-4">Risk Profile</th>
                    <th className="text-left p-4">Onboarding</th>
                    <th className="text-left p-4">Last Activity</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            Joined {client.joinDate}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(client.status)}
                      </td>
                      <td className="p-4">
                        {getSegmentBadge(client.segment)}
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {client.advisorName === 'Unassigned' ? (
                            <Badge variant="outline" className="bg-gray-100 text-gray-800">Unassigned</Badge>
                          ) : (
                            client.advisorName
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">
                          {client.aum > 0 ? `$${(client.aum / 1000000).toFixed(1)}M` : '-'}
                        </div>
                      </td>
                      <td className="p-4">
                        {getRiskBadge(client.riskTolerance)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="h-2 bg-primary rounded-full"
                              style={{ width: `${client.onboardingProgress}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {client.onboardingProgress}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-muted-foreground">
                          {client.lastActivity}
                        </div>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                            <DropdownMenuItem>Assign Advisor</DropdownMenuItem>
                            <DropdownMenuItem>View Portfolio</DropdownMenuItem>
                            <DropdownMenuItem>Send Message</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPortalLayout>
  );
}