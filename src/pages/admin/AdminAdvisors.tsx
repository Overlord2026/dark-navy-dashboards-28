import React, { useState } from 'react';
import { AdminPortalLayout } from '@/components/admin/AdminPortalLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  TrendingUp,
  Award
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AdminAdvisors() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSegment, setFilterSegment] = useState('all');

  // Mock data - replace with actual data fetching
  const advisors = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 (555) 123-4567',
      status: 'active',
      segment: 'physicians',
      clientCount: 45,
      aum: 12500000,
      productionYTD: 125000,
      onboardingProgress: 100,
      lastLogin: '2024-01-15',
      joinDate: '2023-06-15'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      phone: '+1 (555) 234-5678',
      status: 'pending',
      segment: 'business_owners',
      clientCount: 0,
      aum: 0,
      productionYTD: 0,
      onboardingProgress: 60,
      lastLogin: 'Never',
      joinDate: '2024-01-10'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@example.com',
      phone: '+1 (555) 345-6789',
      status: 'active',
      segment: 'executives',
      clientCount: 32,
      aum: 8900000,
      productionYTD: 89000,
      onboardingProgress: 100,
      lastLogin: '2024-01-14',
      joinDate: '2023-09-20'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Inactive</Badge>;
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

  const filteredAdvisors = advisors.filter(advisor => {
    const matchesSearch = advisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         advisor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || advisor.status === filterStatus;
    const matchesSegment = filterSegment === 'all' || advisor.segment === filterSegment;
    
    return matchesSearch && matchesStatus && matchesSegment;
  });

  return (
    <AdminPortalLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Advisors & Teams</h1>
            <p className="text-muted-foreground">
              Manage advisors, track performance, and monitor onboarding progress.
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Invite Advisor
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Advisors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{advisors.length}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Advisors</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {advisors.filter(a => a.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">87% of total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total AUM</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(advisors.reduce((sum, a) => sum + a.aum, 0) / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">+15% from last quarter</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Production YTD</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${Math.round(advisors.reduce((sum, a) => sum + a.productionYTD, 0) / advisors.length).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Per advisor</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Advisor Directory</CardTitle>
            <CardDescription>Search, filter, and manage your advisor network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search advisors..."
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterSegment} onValueChange={setFilterSegment}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Segments</SelectItem>
                    <SelectItem value="physicians">Physicians</SelectItem>
                    <SelectItem value="business_owners">Business Owners</SelectItem>
                    <SelectItem value="executives">Executives</SelectItem>
                    <SelectItem value="high_net_worth">High Net Worth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advisors Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-4">Advisor</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Segment</th>
                    <th className="text-left p-4">Clients</th>
                    <th className="text-left p-4">AUM</th>
                    <th className="text-left p-4">Production YTD</th>
                    <th className="text-left p-4">Onboarding</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdvisors.map((advisor) => (
                    <tr key={advisor.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{advisor.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            {advisor.email}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {advisor.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(advisor.status)}
                      </td>
                      <td className="p-4">
                        {getSegmentBadge(advisor.segment)}
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{advisor.clientCount}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">
                          ${(advisor.aum / 1000000).toFixed(1)}M
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">
                          ${advisor.productionYTD.toLocaleString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="h-2 bg-primary rounded-full"
                              style={{ width: `${advisor.onboardingProgress}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {advisor.onboardingProgress}%
                          </span>
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
                            <DropdownMenuItem>Assign Clients</DropdownMenuItem>
                            <DropdownMenuItem>View Performance</DropdownMenuItem>
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