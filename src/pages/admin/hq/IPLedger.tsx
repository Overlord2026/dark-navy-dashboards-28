import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Download, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { exportToCSV } from '@/utils/csv';
import { FLAGS } from '@/config/flags';
import { demoService } from '@/services/demoService';

interface IPFiling {
  id: string;
  family_id: string;
  family_name: string;
  filing_type: string;
  patent_number?: string;
  trademark_number?: string;
  filing_date: string;
  status: string;
  jurisdiction: string;
  attorney_firm?: string;
  estimated_value: number;
  maintenance_due?: string;
  priority_level: string;
  classification: string;
  metadata: Record<string, any>;
}

interface FilterCounts {
  total: number;
  by_status: Record<string, number>;
  by_type: Record<string, number>;
  by_jurisdiction: Record<string, number>;
  by_priority: Record<string, number>;
}

export default function IPLedger() {
  const [filings, setFilings] = useState<IPFiling[]>([]);
  const [filteredFilings, setFilteredFilings] = useState<IPFiling[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [counts, setCounts] = useState<FilterCounts>({
    total: 0,
    by_status: {},
    by_type: {},
    by_jurisdiction: {},
    by_priority: {}
  });
  
  const { toast } = useToast();

  // Load demo data or fetch from database
  useEffect(() => {
    const loadIPFilings = async () => {
      setLoading(true);
      try {
        if (FLAGS.IS_DEVELOPMENT) {
          // Load demo fixture data
          const demoData = await loadDemoIPFilings();
          setFilings(demoData);
        } else {
          // Fetch from Supabase view (would need to be created)
          const { data, error } = await supabase
            .from('v_ip_filings_by_family')
            .select('*')
            .order('filing_date', { ascending: false });

          if (error) {
            console.error('Error loading IP filings:', error);
            toast({
              title: "Error Loading Data",
              description: "Failed to load IP filings. Using demo data.",
              variant: "destructive"
            });
            const demoData = await loadDemoIPFilings();
            setFilings(demoData);
          } else {
            // Transform the data to match IPFiling interface if needed
            const transformedData = (data || []).map((item: any) => ({
              id: item.id || `ip_${Date.now()}_${Math.random()}`,
              family_id: item.family_id || '',
              family_name: item.family_name || item.fam_title || '',
              filing_type: item.filing_type || 'Patent',
              patent_number: item.patent_number,
              trademark_number: item.trademark_number,
              filing_date: item.filing_date || item.created_at,
              status: item.status || 'Unknown',
              jurisdiction: item.jurisdiction || 'US',
              attorney_firm: item.attorney_firm,
              estimated_value: item.estimated_value || 0,
              maintenance_due: item.maintenance_due,
              priority_level: item.priority_level || 'Medium',
              classification: item.classification || 'General',
              metadata: item.metadata || {}
            }));
            setFilings(transformedData);
          }
        }
      } catch (error) {
        console.error('Error in loadIPFilings:', error);
        const demoData = await loadDemoIPFilings();
        setFilings(demoData);
      } finally {
        setLoading(false);
      }
    };

    loadIPFilings();
  }, [toast]);

  // Calculate filter counts
  useEffect(() => {
    const newCounts: FilterCounts = {
      total: filings.length,
      by_status: {},
      by_type: {},
      by_jurisdiction: {},
      by_priority: {}
    };

    filings.forEach(filing => {
      // Count by status
      newCounts.by_status[filing.status] = (newCounts.by_status[filing.status] || 0) + 1;
      
      // Count by type
      newCounts.by_type[filing.filing_type] = (newCounts.by_type[filing.filing_type] || 0) + 1;
      
      // Count by jurisdiction
      newCounts.by_jurisdiction[filing.jurisdiction] = (newCounts.by_jurisdiction[filing.jurisdiction] || 0) + 1;
      
      // Count by priority
      newCounts.by_priority[filing.priority_level] = (newCounts.by_priority[filing.priority_level] || 0) + 1;
    });

    setCounts(newCounts);
  }, [filings]);

  // Apply filters
  useEffect(() => {
    let filtered = [...filings];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(filing =>
        filing.family_name.toLowerCase().includes(term) ||
        filing.patent_number?.toLowerCase().includes(term) ||
        filing.trademark_number?.toLowerCase().includes(term) ||
        filing.attorney_firm?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(filing => filing.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(filing => filing.filing_type === typeFilter);
    }

    // Apply jurisdiction filter
    if (jurisdictionFilter !== 'all') {
      filtered = filtered.filter(filing => filing.jurisdiction === jurisdictionFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(filing => filing.priority_level === priorityFilter);
    }

    setFilteredFilings(filtered);
  }, [filings, searchTerm, statusFilter, typeFilter, jurisdictionFilter, priorityFilter]);

  const handleExportCSV = () => {
    const csvData = filteredFilings.map(filing => ({
      'Family Name': filing.family_name,
      'Filing Type': filing.filing_type,
      'Patent Number': filing.patent_number || '',
      'Trademark Number': filing.trademark_number || '',
      'Filing Date': filing.filing_date,
      'Status': filing.status,
      'Jurisdiction': filing.jurisdiction,
      'Attorney Firm': filing.attorney_firm || '',
      'Estimated Value': filing.estimated_value,
      'Maintenance Due': filing.maintenance_due || '',
      'Priority Level': filing.priority_level,
      'Classification': filing.classification
    }));

    exportToCSV(csvData, `IP_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    
    toast({
      title: "Export Complete",
      description: `Exported ${csvData.length} IP filings to CSV`
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setJurisdictionFilter('all');
    setPriorityFilter('all');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'expired': return 'destructive';
      case 'abandoned': return 'outline';
      default: return 'secondary';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading IP Ledger...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">IP Ledger</h1>
          <p className="text-muted-foreground">
            Intellectual Property filings by family with filters and analytics
          </p>
        </div>
        <Button onClick={handleExportCSV} className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="gap-1">
          Total: {counts.total}
        </Badge>
        {Object.entries(counts.by_status).map(([status, count]) => (
          <Badge key={status} variant={getStatusBadgeVariant(status)} className="gap-1">
            {status}: {count}
          </Badge>
        ))}
        {Object.entries(counts.by_type).map(([type, count]) => (
          <Badge key={type} variant="outline" className="gap-1">
            {type}: {count}
          </Badge>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search families, numbers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.keys(counts.by_status).map(status => (
                  <SelectItem key={status} value={status}>
                    {status} ({counts.by_status[status]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.keys(counts.by_type).map(type => (
                  <SelectItem key={type} value={type}>
                    {type} ({counts.by_type[type]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={jurisdictionFilter} onValueChange={setJurisdictionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Jurisdiction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jurisdictions</SelectItem>
                {Object.keys(counts.by_jurisdiction).map(jurisdiction => (
                  <SelectItem key={jurisdiction} value={jurisdiction}>
                    {jurisdiction} ({counts.by_jurisdiction[jurisdiction]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {Object.keys(counts.by_priority).map(priority => (
                  <SelectItem key={priority} value={priority}>
                    {priority} ({counts.by_priority[priority]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            IP Filings ({filteredFilings.length} of {counts.total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Family</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Filing Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Jurisdiction</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Attorney</TableHead>
                  <TableHead>Maintenance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFilings.map((filing) => (
                  <TableRow key={filing.id}>
                    <TableCell className="font-medium">
                      {filing.family_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{filing.filing_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {filing.patent_number || filing.trademark_number || '-'}
                    </TableCell>
                    <TableCell>
                      {new Date(filing.filing_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(filing.status)}>
                        {filing.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{filing.jurisdiction}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityBadgeVariant(filing.priority_level)}>
                        {filing.priority_level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      ${filing.estimated_value.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm">
                      {filing.attorney_firm || '-'}
                    </TableCell>
                    <TableCell>
                      {filing.maintenance_due ? 
                        new Date(filing.maintenance_due).toLocaleDateString() : 
                        '-'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredFilings.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No IP filings found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Demo data loader
async function loadDemoIPFilings(): Promise<IPFiling[]> {
  if (FLAGS.IS_DEVELOPMENT) {
    return demoService.mockNetworkCall('/ip-filings', [
      {
        id: 'ip_001',
        family_id: 'fam_001',
        family_name: 'Johnson Family Trust',
        filing_type: 'Patent',
        patent_number: 'US11234567B2',
        filing_date: '2023-03-15',
        status: 'Active',
        jurisdiction: 'United States',
        attorney_firm: 'IP Partners LLP',
        estimated_value: 250000,
        maintenance_due: '2027-03-15',
        priority_level: 'High',
        classification: 'Technology',
        metadata: {}
      },
      {
        id: 'ip_002',
        family_id: 'fam_001',
        family_name: 'Johnson Family Trust',
        filing_type: 'Trademark',
        trademark_number: 'TM87654321',
        filing_date: '2023-06-20',
        status: 'Active',
        jurisdiction: 'United States',
        attorney_firm: 'Brand Law Associates',
        estimated_value: 85000,
        maintenance_due: '2033-06-20',
        priority_level: 'Medium',
        classification: 'Brand',
        metadata: {}
      },
      {
        id: 'ip_003',
        family_id: 'fam_002',
        family_name: 'Smith Holdings',
        filing_type: 'Patent',
        patent_number: 'US11987654B1',
        filing_date: '2022-11-08',
        status: 'Pending',
        jurisdiction: 'United States',
        attorney_firm: 'Tech IP Group',
        estimated_value: 420000,
        maintenance_due: '2026-11-08',
        priority_level: 'High',
        classification: 'Software',
        metadata: {}
      },
      {
        id: 'ip_004',
        family_id: 'fam_002',
        family_name: 'Smith Holdings',
        filing_type: 'Copyright',
        filing_date: '2023-01-12',
        status: 'Active',
        jurisdiction: 'United States',
        attorney_firm: 'Creative Rights Law',
        estimated_value: 12000,
        priority_level: 'Low',
        classification: 'Creative',
        metadata: {}
      },
      {
        id: 'ip_005',
        family_id: 'fam_003',
        family_name: 'Chen Investment Group',
        filing_type: 'Patent',
        patent_number: 'US12345678A1',
        filing_date: '2024-02-28',
        status: 'Expired',
        jurisdiction: 'United States',
        attorney_firm: 'Innovation Legal',
        estimated_value: 180000,
        priority_level: 'Medium',
        classification: 'Healthcare',
        metadata: {}
      }
    ]);
  }
  return [];
}