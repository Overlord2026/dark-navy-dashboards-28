import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, ExternalLink, Calendar, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { toast } from 'sonner';

interface IPFiling {
  id: string;
  family_code: string;
  fam_title: string;
  filing_kind: string;
  filing_title: string;
  filing_date: string | null;
  application_no: string;
  artifact_url_1: string | null;
  artifact_url_2: string | null;
  artifact_url_3: string | null;
  artifact_url_4: string | null;
  artifact_url_5: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

interface FamilyCount {
  family_code: string;
  fam_title: string;
  count: number;
}

// Demo fixtures for IP filings
const DEMO_IP_FILINGS: IPFiling[] = [
  {
    id: '1',
    family_code: 'BFO-001',
    fam_title: 'Financial Planning Interface Methods',
    filing_kind: 'Provisional',
    filing_title: 'Method and System for Automated Financial Goal Optimization',
    filing_date: '2024-08-15',
    application_no: 'US63/123456',
    artifact_url_1: '/docs/BFO-001-provisional.pdf',
    artifact_url_2: '/docs/BFO-001-drawings.pdf',
    artifact_url_3: '/docs/BFO-001-claims.pdf',
    artifact_url_4: null,
    artifact_url_5: null,
    notes: 'Core financial planning algorithm',
    status: 'Filed',
    created_at: '2024-08-15T10:00:00Z'
  },
  {
    id: '2',
    family_code: 'BFO-002',
    fam_title: 'Retirement Income Calculation Systems',
    filing_kind: 'Non-Provisional',
    filing_title: 'Automated Retirement Income Stream Optimization',
    filing_date: '2024-07-22',
    application_no: 'US17/987654',
    artifact_url_1: '/docs/BFO-002-application.pdf',
    artifact_url_2: '/docs/BFO-002-specification.pdf',
    artifact_url_3: '/docs/BFO-002-drawings.pdf',
    artifact_url_4: '/docs/BFO-002-abstract.pdf',
    artifact_url_5: '/docs/BFO-002-claims.pdf',
    notes: 'Monte Carlo simulation improvements',
    status: 'Under Review',
    created_at: '2024-07-22T14:30:00Z'
  },
  {
    id: '3',
    family_code: 'BFO-001',
    fam_title: 'Financial Planning Interface Methods',
    filing_kind: 'PCT',
    filing_title: 'International Filing for Financial Goal Optimization',
    filing_date: '2024-09-01',
    application_no: 'PCT/US2024/123456',
    artifact_url_1: '/docs/BFO-001-pct.pdf',
    artifact_url_2: '/docs/BFO-001-intl-search.pdf',
    artifact_url_3: null,
    artifact_url_4: null,
    artifact_url_5: null,
    notes: 'International protection filing',
    status: 'Filed',
    created_at: '2024-09-01T09:15:00Z'
  }
];

export default function IPLedgerPage() {
  const [filings, setFilings] = useState<IPFiling[]>(DEMO_IP_FILINGS);
  const [familyCounts, setFamilyCounts] = useState<FamilyCount[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<string>('');
  const [selectedKind, setSelectedKind] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Calculate family counts from demo data
    const counts = DEMO_IP_FILINGS.reduce((acc: Record<string, FamilyCount>, filing) => {
      const key = filing.family_code;
      if (!acc[key]) {
        acc[key] = {
          family_code: filing.family_code,
          fam_title: filing.fam_title,
          count: 0
        };
      }
      acc[key].count++;
      return acc;
    }, {});
    
    setFamilyCounts(Object.values(counts));
  }, []);

  const filteredFilings = filings.filter(filing => {
    const matchesFamily = !selectedFamily || filing.family_code === selectedFamily;
    const matchesKind = !selectedKind || filing.filing_kind.toLowerCase() === selectedKind.toLowerCase();
    const matchesSearch = !searchTerm || 
      filing.filing_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filing.application_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filing.filing_kind.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filing.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (dateRange?.from && filing.filing_date) {
      const filingDate = new Date(filing.filing_date);
      matchesDate = filingDate >= dateRange.from;
      if (dateRange.to) {
        matchesDate = matchesDate && filingDate <= dateRange.to;
      }
    }
    
    return matchesFamily && matchesKind && matchesSearch && matchesDate;
  });

  const exportToCSV = () => {
    const csvData = filteredFilings.map(filing => ({
      'Family Code': filing.family_code,
      'Family Title': filing.fam_title,
      'Filing Kind': filing.filing_kind,
      'Filing Title': filing.filing_title,
      'Filing Date': filing.filing_date || 'N/A',
      'Application No': filing.application_no,
      'Status': filing.status,
      'Notes': filing.notes || '',
      'Artifacts': [filing.artifact_url_1, filing.artifact_url_2, filing.artifact_url_3, filing.artifact_url_4, filing.artifact_url_5]
        .filter(Boolean).length
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ip-filings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('CSV export downloaded successfully');
  };

  const getFilingKindColor = (kind: string) => {
    switch (kind.toLowerCase()) {
      case 'provisional': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'non-provisional': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'trademark': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'pct': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'filed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'under review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--bfo-bg))] text-white p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading IP filings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--bfo-bg))] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--bfo-gold)]">IP Ledger</h1>
            <p className="text-white/70 mt-1">Intellectual Property filing management and tracking</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={exportToCSV} className="btn-gold">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bfo-card p-4">
              <h3 className="text-lg font-semibold text-[var(--bfo-gold)] mb-4">Filters</h3>
              
              {/* Family Filter */}
              <div className="space-y-3 mb-4">
                <label className="text-sm font-medium text-white">Family</label>
                <Select value={selectedFamily} onValueChange={setSelectedFamily}>
                  <SelectTrigger className="bg-black/30 border-white/20">
                    <SelectValue placeholder="All Families" />
                  </SelectTrigger>
                  <SelectContent className="bg-[hsl(var(--bfo-bg))] border-white/20">
                    <SelectItem value="">All Families ({filings.length})</SelectItem>
                    {familyCounts.map(family => (
                      <SelectItem key={family.family_code} value={family.family_code}>
                        {family.family_code} ({family.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Kind Filter */}
              <div className="space-y-3 mb-4">
                <label className="text-sm font-medium text-white">Filing Kind</label>
                <Select value={selectedKind} onValueChange={setSelectedKind}>
                  <SelectTrigger className="bg-black/30 border-white/20">
                    <SelectValue placeholder="All Kinds" />
                  </SelectTrigger>
                  <SelectContent className="bg-[hsl(var(--bfo-bg))] border-white/20">
                    <SelectItem value="">All Kinds</SelectItem>
                    <SelectItem value="provisional">Provisional</SelectItem>
                    <SelectItem value="non-provisional">Non-Provisional</SelectItem>
                    <SelectItem value="pct">PCT</SelectItem>
                    <SelectItem value="trademark">Trademark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-white">Filing Date Range</label>
                <DatePickerWithRange 
                  value={dateRange} 
                  onChange={setDateRange}
                  className="bg-black/30 border-white/20"
                />
              </div>
            </div>

            {/* Summary Stats */}
            <div className="bfo-card p-4">
              <h3 className="text-lg font-semibold text-[var(--bfo-gold)] mb-4">Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Total Filings:</span>
                  <span className="text-[var(--bfo-gold)] font-semibold">{filteredFilings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Families:</span>
                  <span className="text-[var(--bfo-gold)] font-semibold">{familyCounts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Filed This Year:</span>
                  <span className="text-[var(--bfo-gold)] font-semibold">
                    {filteredFilings.filter(f => f.filing_date && new Date(f.filing_date).getFullYear() === 2024).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                placeholder="Search filings, applications, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/30 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            {/* Filings Table */}
            <div className="bfo-card overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-[var(--bfo-gold)]">
                  IP Filings
                  {selectedFamily && (
                    <span className="text-sm font-normal text-white/70 ml-2">
                      - {familyCounts.find(f => f.family_code === selectedFamily)?.fam_title}
                    </span>
                  )}
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-white/70">Kind</TableHead>
                      <TableHead className="text-white/70">Title</TableHead>
                      <TableHead className="text-white/70">Filing Date</TableHead>
                      <TableHead className="text-white/70">Application No</TableHead>
                      <TableHead className="text-white/70">Artifacts</TableHead>
                      <TableHead className="text-white/70">Status</TableHead>
                      <TableHead className="text-white/70">Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFilings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-white/50 py-8">
                          No filings found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFilings.map((filing) => (
                        <TableRow key={filing.id} className="border-white/10 hover:bg-white/5">
                          <TableCell>
                            <Badge className={getFilingKindColor(filing.filing_kind)}>
                              {filing.filing_kind}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium max-w-xs text-white">
                            <div className="truncate" title={filing.filing_title}>
                              {filing.filing_title}
                            </div>
                            <div className="text-xs text-white/50">
                              {filing.family_code}
                            </div>
                          </TableCell>
                          <TableCell className="text-white">
                            {filing.filing_date ? 
                              new Date(filing.filing_date).toLocaleDateString() : 
                              <span className="text-white/50">Pending</span>
                            }
                          </TableCell>
                          <TableCell className="font-mono text-sm text-white">
                            {filing.application_no}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {[filing.artifact_url_1, filing.artifact_url_2, filing.artifact_url_3, filing.artifact_url_4, filing.artifact_url_5]
                                .filter(Boolean)
                                .map((url, i) => (
                                  <Button
                                    key={i}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-[var(--bfo-gold)] hover:bg-white/10"
                                    onClick={() => {
                                      toast.info(`Artifact ${i + 1}: ${url}`);
                                    }}
                                    title={`Artifact ${i + 1}`}
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                ))
                              }
                              {[filing.artifact_url_1, filing.artifact_url_2, filing.artifact_url_3, filing.artifact_url_4, filing.artifact_url_5]
                                .filter(Boolean).length === 0 && (
                                <span className="text-white/50 text-xs">None</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(filing.status)}>
                              {filing.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs text-white">
                            {filing.notes && (
                              <div className="truncate text-sm text-white/70" title={filing.notes}>
                                {filing.notes}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}