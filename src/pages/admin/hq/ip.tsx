import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, TrendingUp } from 'lucide-react';
import { IPFilters } from '@/components/ip/Filters';
import { IPTable } from '@/components/ip/Table';
import { getIPFilings, getIPFamilies, exportFilingsToCSV, IPFiling, IPFilingFilters } from '@/lib/db/ip';
import { toast } from '@/hooks/use-toast';

export default function IPLedgerPage() {
  const [filings, setFilings] = useState<IPFiling[]>([]);
  const [families, setFamilies] = useState<Array<{ family_code: string; fam_title: string | null }>>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<IPFilingFilters>({});

  // Parse URL params on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilters: IPFilingFilters = {};
    
    if (urlParams.get('family')) initialFilters.family = urlParams.get('family')!;
    if (urlParams.get('kind')) initialFilters.kind = urlParams.get('kind')!;
    if (urlParams.get('search')) initialFilters.search = urlParams.get('search')!;
    if (urlParams.get('dateFrom')) initialFilters.dateFrom = urlParams.get('dateFrom')!;
    if (urlParams.get('dateTo')) initialFilters.dateTo = urlParams.get('dateTo')!;
    if (urlParams.get('hasArtifactsOnly')) initialFilters.hasArtifactsOnly = urlParams.get('hasArtifactsOnly') === 'true';

    setFilters(initialFilters);
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.family) params.set('family', filters.family);
    if (filters.kind) params.set('kind', filters.kind);
    if (filters.search) params.set('search', filters.search);
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.hasArtifactsOnly) params.set('hasArtifactsOnly', 'true');

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [filters]);

  // Load families once
  useEffect(() => {
    const loadFamilies = async () => {
      try {
        const familiesData = await getIPFamilies();
        setFamilies(familiesData);
      } catch (error) {
        console.error('Error loading families:', error);
        toast.error('Failed to load IP families');
      }
    };

    loadFamilies();
  }, []);

  // Load filings when filters change
  useEffect(() => {
    const loadFilings = async () => {
      setLoading(true);
      try {
        const filingsData = await getIPFilings(filters);
        setFilings(filingsData);
      } catch (error) {
        console.error('Error loading filings:', error);
        toast.error('Failed to load IP filings');
      } finally {
        setLoading(false);
      }
    };

    loadFilings();
  }, [filters]);

  // Calculate counts by family
  const countsByFamily = useMemo(() => {
    const counts = new Map<string, number>();
    filings.forEach(filing => {
      counts.set(filing.family_code, (counts.get(filing.family_code) || 0) + 1);
    });
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filings]);

  const handleFiltersChange = (newFilters: IPFilingFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleExportCSV = () => {
    try {
      exportFilingsToCSV(filings);
      toast.success(`Exported ${filings.length} IP filings to CSV`);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export CSV');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            IP Ledger
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage intellectual property filings and artifacts
          </p>
        </div>
        <Button onClick={handleExportCSV} disabled={filings.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV ({filings.length})
        </Button>
      </div>

      {/* Filters */}
      <IPFilters
        filters={filters}
        families={families}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      {/* Summary Stats */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Total: {filings.length} filings</span>
          </div>
          {countsByFamily.map(([familyCode, count]) => (
            <Badge key={familyCode} variant="secondary" className="px-3 py-1">
              {familyCode}: {count}
            </Badge>
          ))}
        </div>
      </div>

      {/* Table */}
      <IPTable filings={filings} loading={loading} />
    </div>
  );
}