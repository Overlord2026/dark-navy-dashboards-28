import React, { useState } from 'react';
import { AdminPortalLayout } from '@/components/admin/AdminPortalLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ShoppingCart, 
  Upload, 
  Search, 
  Download,
  Star,
  Users,
  MoreHorizontal,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AdminMarketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - replace with actual data fetching
  const marketplaceItems = [
    {
      id: '1',
      title: 'Advanced Estate Planning Strategies',
      description: 'Comprehensive guide covering trust structures, tax optimization, and wealth transfer strategies.',
      category: 'educational',
      type: 'premium_resource',
      status: 'available',
      provider: 'Platform',
      downloads: 1245,
      rating: 4.8,
      price: 'Premium',
      submittedBy: null,
      dateAdded: '2024-01-01'
    },
    {
      id: '2',
      title: 'Physician Financial Planning Toolkit',
      description: 'Specialized resources for medical professionals including loan forgiveness strategies and practice valuation.',
      category: 'toolkit',
      type: 'segment_resource',
      status: 'pending_review',
      provider: 'Community',
      downloads: 0,
      rating: null,
      price: 'Free',
      submittedBy: 'Sarah Johnson',
      dateAdded: '2024-01-10'
    },
    {
      id: '3',
      title: 'Tax-Loss Harvesting Calculator',
      description: 'Interactive calculator for optimizing tax-loss harvesting strategies across client portfolios.',
      category: 'tool',
      type: 'calculator',
      status: 'available',
      provider: 'Platform',
      downloads: 892,
      rating: 4.6,
      price: 'Premium',
      submittedBy: null,
      dateAdded: '2023-12-15'
    },
    {
      id: '4',
      title: 'Business Owner Exit Planning Framework',
      description: 'Step-by-step framework for helping business owners plan and execute successful exits.',
      category: 'educational',
      type: 'segment_resource',
      status: 'approved',
      provider: 'Community',
      downloads: 567,
      rating: 4.9,
      price: 'Free',
      submittedBy: 'Michael Chen',
      dateAdded: '2024-01-05'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="default" className="bg-green-100 text-green-800">Available</Badge>;
      case 'pending_review':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const categoryLabels = {
      educational: 'Educational',
      toolkit: 'Toolkit',
      tool: 'Tool',
      template: 'Template',
      calculator: 'Calculator'
    };
    return <Badge variant="outline">{categoryLabels[category as keyof typeof categoryLabels] || category}</Badge>;
  };

  const getProviderBadge = (provider: string) => {
    return provider === 'Platform' ? (
      <Badge variant="default" className="bg-purple-100 text-purple-800">Platform</Badge>
    ) : (
      <Badge variant="outline">Community</Badge>
    );
  };

  const filteredItems = marketplaceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <AdminPortalLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
            <p className="text-muted-foreground">
              Discover platform resources and manage community contributions.
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Submit Resource
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Resources</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {marketplaceItems.filter(item => item.status === 'available').length}
              </div>
              <p className="text-xs text-muted-foreground">Ready to use</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {marketplaceItems.filter(item => item.status === 'pending_review').length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {marketplaceItems.reduce((sum, item) => sum + item.downloads, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(marketplaceItems.filter(item => item.rating).reduce((sum, item) => sum + (item.rating || 0), 0) / marketplaceItems.filter(item => item.rating).length).toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">User satisfaction</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Library</CardTitle>
            <CardDescription>Browse and manage marketplace resources and community contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="toolkit">Toolkit</SelectItem>
                    <SelectItem value="tool">Tool</SelectItem>
                    <SelectItem value="template">Template</SelectItem>
                    <SelectItem value="calculator">Calculator</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="pending_review">Pending Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <div className="flex gap-2">
                      {getStatusBadge(item.status)}
                      {getCategoryBadge(item.category)}
                      {getProviderBadge(item.provider)}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Download</DropdownMenuItem>
                      {item.status === 'pending_review' && (
                        <>
                          <DropdownMenuItem>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {item.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Price:</span>
                    <Badge variant={item.price === 'Premium' ? 'default' : 'secondary'}>
                      {item.price}
                    </Badge>
                  </div>
                  
                  {item.rating && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rating:</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Downloads:</span>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{item.downloads.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {item.submittedBy && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Submitted by:</span>
                      <span>{item.submittedBy}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Date added:</span>
                    <span>{item.dateAdded}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    {item.status === 'pending_review' ? 'Review' : 'View Details'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No resources found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminPortalLayout>
  );
}