import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Plus, Filter, Download, Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  getMockProspects, 
  getStatusStyle, 
  getSourceStyle, 
  statusOptions, 
  sourceOptions, 
  formatCurrency, 
  formatDate,
  type Prospect 
} from '../state/prospects.mock';

const ITEMS_PER_PAGE = 8;

export default function ProspectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const prospects = getMockProspects();

  // Filter and search logic
  const filteredProspects = useMemo(() => {
    return prospects.filter(prospect => {
      const matchesSearch = prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prospect.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prospect.company?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || prospect.status === statusFilter;
      const matchesSource = sourceFilter === 'all' || prospect.source === sourceFilter;
      
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [prospects, searchTerm, statusFilter, sourceFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProspects.length / ITEMS_PER_PAGE);
  const paginatedProspects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProspects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProspects, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleSourceFilter = (value: string) => {
    setSourceFilter(value);
    setCurrentPage(1);
  };

  // Row actions - these would navigate to actual pages in a real implementation
  const handleView = (prospect: Prospect) => {
    console.log('View prospect:', prospect.id);
    // TODO: Navigate to prospect detail page
  };

  const handleEdit = (prospect: Prospect) => {
    console.log('Edit prospect:', prospect.id);
    // TODO: Navigate to prospect edit page
  };

  const handleDelete = (prospect: Prospect) => {
    console.log('Delete prospect:', prospect.id);
    // TODO: Show confirmation dialog and delete prospect
  };

  return (
    <>
      <Helmet>
        <title>Prospects Management | Advisor Platform</title>
        <meta name="description" content="Manage prospects, track pipeline, and convert leads with integrated CRM tools" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
              <Users className="w-6 h-6" />
              Prospects Management
            </h1>
            <p className="text-muted-foreground">
              Track and manage your prospect pipeline with advanced CRM features
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Prospect
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Prospects</p>
                  <p className="text-2xl font-bold text-foreground">{prospects.length}</p>
                </div>
                <Badge variant="secondary">All</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Hot Leads</p>
                  <p className="text-2xl font-bold text-foreground">
                    {prospects.filter(p => p.status === 'hot').length}
                  </p>
                </div>
                <Badge variant="destructive">Hot</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Qualified</p>
                  <p className="text-2xl font-bold text-foreground">
                    {prospects.filter(p => p.status === 'qualified').length}
                  </p>
                </div>
                <Badge variant="default">Ready</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Converted</p>
                  <p className="text-2xl font-bold text-foreground">
                    {prospects.filter(p => p.status === 'converted').length}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Success</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Search className="w-5 h-5" />
              Search & Filter Prospects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sourceFilter} onValueChange={handleSourceFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prospects Table */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Prospects ({filteredProspects.length})</CardTitle>
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredProspects.length)} of {filteredProspects.length}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-foreground font-semibold">Name</TableHead>
                    <TableHead className="text-foreground font-semibold">Email</TableHead>
                    <TableHead className="text-foreground font-semibold">Status</TableHead>
                    <TableHead className="text-foreground font-semibold">Source</TableHead>
                    <TableHead className="text-foreground font-semibold">HNW Score</TableHead>
                    <TableHead className="text-foreground font-semibold">Next Meeting</TableHead>
                    <TableHead className="text-foreground font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProspects.map((prospect) => (
                    <TableRow key={prospect.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">{prospect.name}</div>
                          <div className="text-sm text-muted-foreground">{prospect.company}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-foreground">{prospect.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusStyle(prospect.status)} border`}>
                          {prospect.status.charAt(0).toUpperCase() + prospect.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getSourceStyle(prospect.source)}>
                          {prospect.source.charAt(0).toUpperCase() + prospect.source.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-foreground">{prospect.hnwScore}</div>
                          <div className={`w-12 h-2 rounded-full ${
                            prospect.hnwScore >= 90 ? 'bg-green-500' :
                            prospect.hnwScore >= 80 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`} />
                        </div>
                        <div className="text-xs text-muted-foreground">{formatCurrency(prospect.estimatedAUM)}</div>
                      </TableCell>
                      <TableCell>
                        {prospect.nextMeeting ? (
                          <div className="text-sm text-foreground">
                            {formatDate(prospect.nextMeeting)}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">Not scheduled</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(prospect)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(prospect)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(prospect)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      )
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="text-muted-foreground">...</span>
                          )}
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8"
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      ))
                    }
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}