import { supabase } from '@/integrations/supabase/client';

export interface IPFiling {
  family_code: string;
  fam_title: string | null;
  filing_kind: string;
  filing_title: string;
  application_no: string | null;
  filing_date: string | null;
  status: string | null;
  artifact_url_1: string | null;
  artifact_url_2: string | null;
  artifact_url_3: string | null;
  artifact_url_4: string | null;
  artifact_url_5: string | null;
  notes: string | null;
  created_at: string;
}

export interface IPFilingFilters {
  family?: string;
  kind?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  hasArtifactsOnly?: boolean;
}

export async function getIPFilings(filters: IPFilingFilters = {}): Promise<IPFiling[]> {
  let query = supabase
    .from('v_ip_filings_by_family')
    .select('*');

  // Apply filters
  if (filters.family && filters.family !== 'All') {
    query = query.eq('family_code', filters.family);
  }

  if (filters.kind && filters.kind !== 'All') {
    query = query.eq('filing_kind', filters.kind);
  }

  if (filters.search?.trim()) {
    const searchTerm = filters.search.trim();
    query = query.or(`filing_title.ilike.%${searchTerm}%,application_no.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%`);
  }

  if (filters.dateFrom) {
    query = query.gte('filing_date', filters.dateFrom);
  }

  if (filters.dateTo) {
    query = query.lte('filing_date', filters.dateTo);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching IP filings:', error);
    throw error;
  }

  let filings = data || [];

  // Filter for artifacts (client-side since it's complex SQL)
  if (filters.hasArtifactsOnly) {
    filings = filings.filter(filing => 
      filing.artifact_url_1 || filing.artifact_url_2 || filing.artifact_url_3 || 
      filing.artifact_url_4 || filing.artifact_url_5
    );
  }

  return filings;
}

export async function getIPFamilies(): Promise<Array<{ family_code: string; fam_title: string | null }>> {
  const { data, error } = await supabase
    .from('ip_families')
    .select('family_code, fam_title')
    .order('family_code');

  if (error) {
    console.error('Error fetching IP families:', error);
    throw error;
  }

  return data || [];
}

export function exportFilingsToCSV(filings: IPFiling[], filename?: string): void {
  const headers = [
    'family_code',
    'fam_title', 
    'filing_kind',
    'filing_title',
    'filing_date',
    'application_no',
    'status',
    'artifact_url_1',
    'artifact_url_2',
    'artifact_url_3',
    'artifact_url_4',
    'artifact_url_5',
    'notes'
  ];

  const csvContent = [
    headers.join(','),
    ...filings.map(filing => 
      headers.map(header => {
        const value = filing[header as keyof IPFiling];
        const stringValue = value == null ? '' : String(value);
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        return stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')
          ? `"${stringValue.replace(/"/g, '""')}"` 
          : stringValue;
      }).join(',')
    )
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `ip_filings_export_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}