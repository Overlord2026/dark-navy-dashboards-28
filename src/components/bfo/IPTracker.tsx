import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Plus, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { IPFiling } from '@/types/bfo-platform';

export function IPTracker() {
  const [filings, setFilings] = useState<IPFiling[]>([]);
  const [filteredFilings, setFilteredFilings] = useState<IPFiling[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    // Load mock data
    const mockFilings: IPFiling[] = [
      {
        id: '1',
        title: 'AI-Powered Financial Planning Algorithm',
        type: 'patent',
        status: 'filed',
        filingDate: '2024-01-15',
        priority: 'high',
        assignedTo: 'John Smith',
        cost: 15000,
        timeline: [
          { id: '1', date: '2024-01-15', action: 'Initial filing', status: 'completed' },
          { id: '2', date: '2024-02-15', action: 'Examination request', status: 'completed' },
          { id: '3', date: '2024-06-15', action: 'Office action response due', status: 'pending' }
        ],
        documents: []
      },
      {
        id: '2',
        title: 'BFO Platform Logo',
        type: 'trademark',
        status: 'approved',
        filingDate: '2023-11-20',
        priority: 'medium',
        assignedTo: 'Jane Doe',
        cost: 3500,
        timeline: [
          { id: '1', date: '2023-11-20', action: 'Trademark application filed', status: 'completed' },
          { id: '2', date: '2024-01-20', action: 'Examination completed', status: 'completed' },
          { id: '3', date: '2024-03-20', action: 'Registration granted', status: 'completed' }
        ],
        documents: []
      },
      {
        id: '3',
        title: 'Client Onboarding Process Documentation',
        type: 'trade_secret',
        status: 'draft',
        filingDate: '2024-02-01',
        priority: 'low',
        assignedTo: 'Mike Johnson',
        cost: 500,
        timeline: [
          { id: '1', date: '2024-02-01', action: 'Documentation started', status: 'completed' },
          { id: '2', date: '2024-03-01', action: 'Internal review', status: 'pending' }
        ],
        documents: []
      }
    ];
    setFilings(mockFilings);
    setFilteredFilings(mockFilings);
  }, []);

  useEffect(() => {
    let filtered = filings;

    if (searchTerm) {
      filtered = filtered.filter(filing => 
        filing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        filing.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(filing => filing.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(filing => filing.type === typeFilter);
    }

    setFilteredFilings(filtered);
  }, [filings, searchTerm, statusFilter, typeFilter]);

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary',
      filed: 'default',
      pending: 'warning',
      approved: 'success',
      rejected: 'destructive'
    } as const;

    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: 'secondary',
      medium: 'default',
      high: 'warning',
      critical: 'destructive'
    } as const;

    return <Badge variant={variants[priority as keyof typeof variants] || 'secondary'}>{priority}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'patent':
        return '🔬';
      case 'trademark':
        return '™️';
      case 'copyright':
        return '©️';
      case 'trade_secret':
        return '🔒';
      default:
        return '📄';
    }
  };

  const totalCost = filings.reduce((sum, filing) => sum + filing.cost, 0);
  const pendingFilings = filings.filter(f => f.status === 'pending' || f.status === 'filed').length;
  const approvedFilings = filings.filter(f => f.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">IP Filing Tracker</h1>
          <p className="text-muted-foreground">Manage intellectual property filings and deadlines</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Filing
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New IP Filing</DialogTitle>
            </DialogHeader>
            <CreateFilingForm onClose={() => setIsCreateModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Filings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filings.length}</div>
            <p className="text-xs text-muted-foreground">Active cases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingFilings}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedFilings}</div>
            <p className="text-xs text-muted-foreground">Successfully registered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Filing costs</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Search filings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="filed">Filed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="patent">Patent</SelectItem>
                  <SelectItem value="trademark">Trademark</SelectItem>
                  <SelectItem value="copyright">Copyright</SelectItem>
                  <SelectItem value="trade_secret">Trade Secret</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Actions</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Advanced
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filings List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFilings.map((filing) => (
          <Card key={filing.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTypeIcon(filing.type)}</span>
                  <div>
                    <CardTitle className="text-lg">{filing.title}</CardTitle>
                    <CardDescription>
                      Filed: {new Date(filing.filingDate).toLocaleDateString()} • 
                      Assigned to: {filing.assignedTo}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(filing.status)}
                  {getPriorityBadge(filing.priority)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Timeline preview */}
                <div>
                  <h4 className="font-medium mb-2">Recent Timeline</h4>
                  <div className="space-y-2">
                    {filing.timeline.slice(-2).map((item) => (
                      <div key={item.id} className="flex items-center gap-3 text-sm">
                        <div className={`w-3 h-3 rounded-full ${
                          item.status === 'completed' ? 'bg-green-500' : 
                          item.status === 'pending' ? 'bg-orange-500' : 'bg-gray-500'
                        }`}></div>
                        <span className="flex-1">{item.action}</span>
                        <span className="text-muted-foreground">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost and actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">${filing.cost.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button size="sm">Update</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFilings.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No filings found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                ? 'Try adjusting your filters to see more results.'
                : 'Create your first IP filing to get started.'
              }
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Filing
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CreateFilingForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'patent',
    priority: 'medium',
    assignedTo: '',
    cost: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Creating filing:', formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Filing Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter filing title..."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="patent">Patent</SelectItem>
              <SelectItem value="trademark">Trademark</SelectItem>
              <SelectItem value="copyright">Copyright</SelectItem>
              <SelectItem value="trade_secret">Trade Secret</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignedTo">Assigned To</Label>
          <Input
            id="assignedTo"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            placeholder="Enter assignee name..."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost">Estimated Cost</Label>
          <Input
            id="cost"
            type="number"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            placeholder="0"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the intellectual property..."
          rows={4}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Create Filing
        </Button>
      </div>
    </form>
  );
}