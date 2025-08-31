import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface IPFiling {
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
}

interface FamilyCount {
  family_code: string;
  fam_title: string;
  count: number;
}

export function IPLedgerTab() {
  const [filings, setFilings] = useState<IPFiling[]>([]);
  const [familyCounts, setFamilyCounts] = useState<FamilyCount[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIPFilings();
  }, []);

  const fetchIPFilings = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('ip-filings');

      if (error) throw error;

      setFilings(data || []);
      
      // Calculate family counts
      const counts = (data || []).reduce((acc: Record<string, FamilyCount>, filing) => {
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
    } catch (error) {
      console.error('Error fetching IP filings:', error);
      toast.error('Failed to load IP filings');
    } finally {
      setLoading(false);
    }
  };

  const filteredFilings = filings.filter(filing => {
    const matchesFamily = !selectedFamily || filing.family_code === selectedFamily;
    const matchesSearch = !searchTerm || 
      filing.filing_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filing.application_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filing.filing_kind.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFamily && matchesSearch;
  });

  const exportToCSV = () => {
    const csvData = filteredFilings.map(filing => ({
      'Family Code': filing.family_code,
      'Filing Kind': filing.filing_kind,
      'Filing Title': filing.filing_title,
      'Filing Date': filing.filing_date || 'N/A',
      'Application No': filing.application_no,
      'Status': filing.status,
      'Notes': filing.notes || ''
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ip-filings.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getFilingKindColor = (kind: string) => {
    switch (kind.toLowerCase()) {
      case 'provisional': return 'bg-blue-100 text-blue-800';
      case 'non-provisional': return 'bg-green-100 text-green-800';
      case 'trademark': return 'bg-purple-100 text-purple-800';
      case 'pct': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading IP filings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar - Family filters */}
        <div className="lg:w-64 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Filter by Family</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={selectedFamily === '' ? 'default' : 'outline'}
                size="sm"
                className="w-full justify-between"
                onClick={() => setSelectedFamily('')}
              >
                All Families
                <Badge variant="secondary">{filings.length}</Badge>
              </Button>
              {familyCounts.map(family => (
                <Button
                  key={family.family_code}
                  variant={selectedFamily === family.family_code ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => setSelectedFamily(family.family_code)}
                >
                  <span className="truncate">{family.family_code}</span>
                  <Badge variant="secondary">{family.count}</Badge>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="flex-1 space-y-4">
          {/* Search and export controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search filings, applications, or types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Filings table */}
          <Card>
            <CardHeader>
              <CardTitle>
                IP Filings 
                {selectedFamily && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    - {familyCounts.find(f => f.family_code === selectedFamily)?.fam_title}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kind</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Filing Date</TableHead>
                      <TableHead>Application No</TableHead>
                      <TableHead>Artifacts</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFilings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No filings found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFilings.map((filing, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Badge className={getFilingKindColor(filing.filing_kind)}>
                              {filing.filing_kind}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium max-w-xs">
                            <div className="truncate" title={filing.filing_title}>
                              {filing.filing_title}
                            </div>
                          </TableCell>
                          <TableCell>
                            {filing.filing_date ? 
                              new Date(filing.filing_date).toLocaleDateString() : 
                              'Pending'
                            }
                          </TableCell>
                          <TableCell className="font-mono text-sm">
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
                                    className="h-6 w-6 p-0"
                                    onClick={() => window.open(url, '_blank')}
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                ))
                              }
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{filing.status}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            {filing.notes && (
                              <div className="truncate text-sm text-muted-foreground" title={filing.notes}>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}