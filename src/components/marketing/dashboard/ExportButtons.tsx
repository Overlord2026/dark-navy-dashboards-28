import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet, Archive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getMarketingStore } from '@/marketing/adapters';

export function ExportButtons() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async (type: 'audit' | 'performance' | 'compliance') => {
    setIsExporting(true);
    
    try {
      const store = getMarketingStore();
      
      switch (type) {
        case 'audit':
          await exportAuditReport();
          break;
        case 'performance':
          await exportPerformanceReport();
          break;
        case 'compliance':
          await exportComplianceReport();
          break;
      }
      
      toast({
        title: 'Export completed',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} report has been downloaded.`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        variant: 'destructive',
        title: 'Export failed',
        description: 'Unable to generate the report. Please try again.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportAuditReport = async () => {
    // Mock audit export - in real app, this would call the audit export service
    const auditData = {
      exportDate: new Date().toISOString(),
      campaigns: [],
      retentionPolicy: '7 years as per SEC/FINRA requirements',
      complianceStatus: 'All campaigns reviewed and approved',
    };
    
    const blob = new Blob([JSON.stringify(auditData, null, 2)], { 
      type: 'application/json' 
    });
    downloadFile(blob, `marketing-audit-${new Date().toISOString().split('T')[0]}.json`);
  };

  const exportPerformanceReport = async () => {
    // Mock performance export
    const performanceData = {
      exportDate: new Date().toISOString(),
      summary: {
        totalCampaigns: 0,
        totalSpend: 0,
        totalConversions: 0,
        avgROAS: 0,
      },
      channelBreakdown: [],
      campaignDetails: [],
    };
    
    // Create CSV format for performance data
    const csvContent = [
      'Campaign,Channel,Spend,Conversions,CTR,CPC,ROAS',
      // Add rows here
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    downloadFile(blob, `marketing-performance-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportComplianceReport = async () => {
    // Mock compliance export
    const complianceData = {
      exportDate: new Date().toISOString(),
      summary: {
        totalCampaigns: 0,
        compliantCampaigns: 0,
        pendingReviews: 0,
        violations: [],
      },
      disclaimers: {
        sec: 'Applied to all investment-related campaigns',
        finra: 'Applied to all financial services campaigns',
        state: 'State-specific disclaimers applied as required',
      },
      retentionNote: 'All records maintained for 7 years per regulatory requirements',
    };
    
    const blob = new Blob([JSON.stringify(complianceData, null, 2)], { 
      type: 'application/json' 
    });
    downloadFile(blob, `marketing-compliance-${new Date().toISOString().split('T')[0]}.json`);
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport('audit')}>
          <Archive className="h-4 w-4 mr-2" />
          Audit Bundle (7-year retention)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('performance')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Performance Report (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('compliance')}>
          <FileText className="h-4 w-4 mr-2" />
          Compliance Report (JSON)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}