import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useROIData } from './useROIData';

// CSV parsing and validation utilities
export interface CSVParseResult<T> {
  data: T[];
  errors: string[];
  validRows: number;
  totalRows: number;
}

export interface LeadCSVRow {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: string;
  campaign: string;
  leadDate: string;
  status: string;
  amountClosed: string;
  ltv: string;
  notes: string;
}

export interface CampaignCSVRow {
  name: string;
  source: string;
  startDate: string;
  endDate: string;
  spend: string;
  notes: string;
}

export function useCSVOperations() {
  const { toast } = useToast();
  const { createLead, createCampaign, getLeads, getCampaigns } = useROIData();
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const parseCSV = (csvText: string): string[][] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    });
  };

  const validateLeadRow = (row: string[], headers: string[]): { isValid: boolean; errors: string[]; data?: Partial<LeadCSVRow> } => {
    const errors: string[] = [];
    const data: Partial<LeadCSVRow> = {};

    // Required field mappings
    const requiredFields = ['firstName', 'lastName', 'email', 'leadDate', 'status'];
    const headerMap: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      const normalizedHeader = header.toLowerCase().replace(/[\s-_]/g, '');
      if (normalizedHeader.includes('first') && normalizedHeader.includes('name')) headerMap.firstName = header;
      if (normalizedHeader.includes('last') && normalizedHeader.includes('name')) headerMap.lastName = header;
      if (normalizedHeader.includes('email')) headerMap.email = header;
      if (normalizedHeader.includes('phone')) headerMap.phone = header;
      if (normalizedHeader.includes('source')) headerMap.source = header;
      if (normalizedHeader.includes('campaign')) headerMap.campaign = header;
      if (normalizedHeader.includes('date')) headerMap.leadDate = header;
      if (normalizedHeader.includes('status')) headerMap.status = header;
      if (normalizedHeader.includes('amount')) headerMap.amountClosed = header;
      if (normalizedHeader.includes('ltv')) headerMap.ltv = header;
      if (normalizedHeader.includes('notes')) headerMap.notes = header;
    });

    // Map row data
    headers.forEach((header, index) => {
      const value = row[index] || '';
      if (headerMap.firstName === header) data.firstName = value;
      if (headerMap.lastName === header) data.lastName = value;
      if (headerMap.email === header) data.email = value;
      if (headerMap.phone === header) data.phone = value;
      if (headerMap.source === header) data.source = value;
      if (headerMap.campaign === header) data.campaign = value;
      if (headerMap.leadDate === header) data.leadDate = value;
      if (headerMap.status === header) data.status = value;
      if (headerMap.amountClosed === header) data.amountClosed = value;
      if (headerMap.ltv === header) data.ltv = value;
      if (headerMap.notes === header) data.notes = value;
    });

    // Validate required fields
    requiredFields.forEach(field => {
      if (!data[field as keyof LeadCSVRow] || data[field as keyof LeadCSVRow]?.trim() === '') {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Validate email format
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Invalid email format');
    }

    // Validate status
    const validStatuses = ['new', 'contacted', 'appointment_set', 'showed', 'closed'];
    if (data.status && !validStatuses.includes(data.status.toLowerCase().replace(/\s+/g, '_'))) {
      errors.push(`Invalid status: ${data.status}. Must be one of: New, Contacted, Appointment Set, Showed, Closed`);
    }

    return { isValid: errors.length === 0, errors, data };
  };

  const validateCampaignRow = (row: string[], headers: string[]): { isValid: boolean; errors: string[]; data?: Partial<CampaignCSVRow> } => {
    const errors: string[] = [];
    const data: Partial<CampaignCSVRow> = {};

    const requiredFields = ['name', 'source', 'startDate'];
    const headerMap: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      const normalizedHeader = header.toLowerCase().replace(/[\s-_]/g, '');
      if (normalizedHeader.includes('name') || normalizedHeader.includes('campaign')) headerMap.name = header;
      if (normalizedHeader.includes('source')) headerMap.source = header;
      if (normalizedHeader.includes('start')) headerMap.startDate = header;
      if (normalizedHeader.includes('end')) headerMap.endDate = header;
      if (normalizedHeader.includes('spend') || normalizedHeader.includes('budget')) headerMap.spend = header;
      if (normalizedHeader.includes('notes')) headerMap.notes = header;
    });

    // Map row data
    headers.forEach((header, index) => {
      const value = row[index] || '';
      if (headerMap.name === header) data.name = value;
      if (headerMap.source === header) data.source = value;
      if (headerMap.startDate === header) data.startDate = value;
      if (headerMap.endDate === header) data.endDate = value;
      if (headerMap.spend === header) data.spend = value;
      if (headerMap.notes === header) data.notes = value;
    });

    // Validate required fields
    requiredFields.forEach(field => {
      if (!data[field as keyof CampaignCSVRow] || data[field as keyof CampaignCSVRow]?.trim() === '') {
        errors.push(`Missing required field: ${field}`);
      }
    });

    return { isValid: errors.length === 0, errors, data };
  };

  const parseLeadsCSV = (csvText: string): CSVParseResult<LeadCSVRow> => {
    const rows = parseCSV(csvText);
    if (rows.length === 0) {
      return { data: [], errors: ['Empty CSV file'], validRows: 0, totalRows: 0 };
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);
    const validData: LeadCSVRow[] = [];
    const allErrors: string[] = [];

    dataRows.forEach((row, index) => {
      const { isValid, errors, data } = validateLeadRow(row, headers);
      if (isValid && data) {
        validData.push(data as LeadCSVRow);
      } else {
        allErrors.push(`Row ${index + 2}: ${errors.join(', ')}`);
      }
    });

    return {
      data: validData,
      errors: allErrors,
      validRows: validData.length,
      totalRows: dataRows.length
    };
  };

  const parseCampaignsCSV = (csvText: string): CSVParseResult<CampaignCSVRow> => {
    const rows = parseCSV(csvText);
    if (rows.length === 0) {
      return { data: [], errors: ['Empty CSV file'], validRows: 0, totalRows: 0 };
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);
    const validData: CampaignCSVRow[] = [];
    const allErrors: string[] = [];

    dataRows.forEach((row, index) => {
      const { isValid, errors, data } = validateCampaignRow(row, headers);
      if (isValid && data) {
        validData.push(data as CampaignCSVRow);
      } else {
        allErrors.push(`Row ${index + 2}: ${errors.join(', ')}`);
      }
    });

    return {
      data: validData,
      errors: allErrors,
      validRows: validData.length,
      totalRows: dataRows.length
    };
  };

  const importLeadsFromCSV = async (csvData: LeadCSVRow[]) => {
    setIsImporting(true);
    try {
      let successCount = 0;
      for (const leadData of csvData) {
        try {
      await createLead({
        first_name: leadData.firstName,
        last_name: leadData.lastName,
        email: leadData.email,
        phone: leadData.phone || '',
        source: leadData.source || 'CSV Import',
        campaign_id: null,
        stage: leadData.status.toLowerCase().replace(/\s+/g, '_') as any,
        closed: leadData.status.toLowerCase() === 'closed',
        revenue: leadData.amountClosed ? parseFloat(leadData.amountClosed) : 0
      });
          successCount++;
        } catch (error) {
          console.error('Error importing lead:', error);
        }
      }
      
      toast({
        title: "Import Successful",
        description: `Successfully imported ${successCount} out of ${csvData.length} leads.`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import leads. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const importCampaignsFromCSV = async (csvData: CampaignCSVRow[]) => {
    setIsImporting(true);
    try {
      let successCount = 0;
      for (const campaignData of csvData) {
        try {
      await createCampaign({
        name: campaignData.name,
        source: campaignData.source,
        start_date: campaignData.startDate,
        end_date: campaignData.endDate || null,
        spend: campaignData.spend ? parseFloat(campaignData.spend) : 0
      });
          successCount++;
        } catch (error) {
          console.error('Error importing campaign:', error);
        }
      }
      
      toast({
        title: "Import Successful",
        description: `Successfully imported ${successCount} out of ${csvData.length} campaigns.`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import campaigns. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const exportLeadsToCSV = async () => {
    setIsExporting(true);
    try {
      const leads = await getLeads();
      const csvHeaders = ['First Name', 'Last Name', 'Email', 'Phone', 'Source', 'Campaign', 'Lead Date', 'Status', 'Amount Closed', 'LTV', 'Notes'];
      const csvRows = leads.map(lead => [
        lead.first_name,
        lead.last_name,
        lead.email,
        lead.phone || '',
        lead.source || '',
        '', // Campaign name would need lookup
        lead.created_at,
        lead.stage,
        lead.revenue?.toString() || '0',
        '', // LTV not in current schema
        '' // Notes not in current schema
      ]);

      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Exported ${leads.length} leads to CSV.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export leads. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportCampaignsToCSV = async () => {
    setIsExporting(true);
    try {
      const campaigns = await getCampaigns();
      const csvHeaders = ['Campaign Name', 'Source', 'Start Date', 'End Date', 'Budget/Spend', 'Notes'];
      const csvRows = campaigns.map(campaign => [
        campaign.name,
        campaign.source,
        campaign.start_date,
        campaign.end_date || '',
        campaign.spend?.toString() || '0',
        '' // Notes not in current schema
      ]);

      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `campaigns-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Exported ${campaigns.length} campaigns to CSV.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export campaigns. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return {
    parseLeadsCSV,
    parseCampaignsCSV,
    importLeadsFromCSV,
    importCampaignsFromCSV,
    exportLeadsToCSV,
    exportCampaignsToCSV,
    isImporting,
    isExporting
  };
}