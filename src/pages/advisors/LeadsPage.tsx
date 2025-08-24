import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LeadCaptureModal } from "@/components/advisors/LeadCaptureModal";
import { useLeads, useUpdateLead, useDeleteLead, type LeadsFilters } from "@/hooks/useLeads";
import { Download, MoreHorizontal, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-green-100 text-green-800',
  converted: 'bg-purple-100 text-purple-800',
  closed: 'bg-gray-100 text-gray-800'
};

export default function LeadsPage() {
  const [filters, setFilters] = useState<LeadsFilters>({});
  const { data: leads = [], isLoading, refetch } = useLeads(filters);
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const handleStatusUpdate = async (id: string, status: string) => {
    updateLead.mutate({ id, updates: { lead_status: status } });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      deleteLead.mutate(id);
    }
  };

  const exportToCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Status', 'Source', 'Created Date', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => [
        `"${lead.first_name}"`,
        `"${lead.last_name}"`,
        `"${lead.email || ''}"`,
        `"${lead.phone || ''}"`,
        `"${lead.lead_status || ''}"`,
        `"${lead.lead_source || ''}"`,
        `"${format(new Date(lead.created_at), 'yyyy-MM-dd HH:mm:ss')}"`,
        `"${lead.notes || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Helmet>
        <title>Leads Management | Prospect Tracking & Conversion</title>
        <meta name="description" content="Manage and track your prospects with comprehensive lead management tools" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Leads</h1>
            <p className="text-muted-foreground">Manage your prospect pipeline</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <LeadCaptureModal onLeadCreated={() => refetch()} />
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={filters.search || ''}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={filters.status || ''} onValueChange={(value) => setFilters({ ...filters, status: value || undefined })}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Source</label>
                <Select value={filters.utm_source || ''} onValueChange={(value) => setFilters({ ...filters, utm_source: value || undefined })}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All sources</SelectItem>
                    <SelectItem value="manual_entry">Manual Entry</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                onClick={() => setFilters({})}
                disabled={!filters.search && !filters.status && !filters.utm_source}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{leads.length}</div>
              <p className="text-xs text-muted-foreground">Total Leads</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{leads.filter(l => l.lead_status === 'new').length}</div>
              <p className="text-xs text-muted-foreground">New Leads</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{leads.filter(l => l.lead_status === 'qualified').length}</div>
              <p className="text-xs text-muted-foreground">Qualified</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{leads.filter(l => l.lead_status === 'converted').length}</div>
              <p className="text-xs text-muted-foreground">Converted</p>
            </CardContent>
          </Card>
        </div>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Leads ({leads.length})</CardTitle>
            <CardDescription>
              Prospect information with consent tracking and source attribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading leads...</div>
            ) : leads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No leads found. Use the filters above or capture new leads.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">
                          {lead.first_name} {lead.last_name}
                        </TableCell>
                        <TableCell>{lead.email || '-'}</TableCell>
                        <TableCell>{lead.phone || '-'}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[lead.lead_status as keyof typeof statusColors] || statusColors.new}>
                            {lead.lead_status || 'new'}
                          </Badge>
                        </TableCell>
                        <TableCell>{lead.lead_source}</TableCell>
                        <TableCell>{format(new Date(lead.created_at), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleStatusUpdate(lead.id, 'contacted')}>
                                Mark as Contacted
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusUpdate(lead.id, 'qualified')}>
                                Mark as Qualified
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusUpdate(lead.id, 'converted')}>
                                Mark as Converted
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(lead.id)}
                                className="text-destructive"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}