import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Plus, Download, Upload } from 'lucide-react';
import { ROIKPICards } from '@/components/roi/ROIKPICards';
import { LeadsFunnelChart } from '@/components/roi/LeadsFunnelChart';
import { CampaignPerformanceTable } from '@/components/roi/CampaignPerformanceTable';
import { NewLeadDialog } from '@/components/roi/NewLeadDialog';
import { NewCampaignDialog } from '@/components/roi/NewCampaignDialog';
import { CSVImportDialog } from '@/components/roi/CSVImportDialog';
import { addDays } from 'date-fns';

interface DateRange {
  from?: Date;
  to?: Date;
}

export default function AdvisorROIDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [isCSVImportOpen, setIsCSVImportOpen] = useState(false);

  const handleExportCSV = () => {
    // TODO: Implement CSV export
    console.log('Exporting CSV...');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Advisor Leads & ROI Dashboard</h1>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <DatePickerWithRange
              date={dateRange}
              onDateChange={(newDateRange) => setDateRange(newDateRange || {})}
              className="w-[300px]"
            />
            
            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Campaigns" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all">All Campaigns</SelectItem>
                <SelectItem value="facebook">Facebook Ads</SelectItem>
                <SelectItem value="google">Google Ads</SelectItem>
                <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2 ml-auto">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsCSVImportOpen(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportCSV}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <ROIKPICards dateRange={dateRange} />

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={() => setIsNewLeadOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Lead
        </Button>
        <Button variant="outline" onClick={() => setIsNewCampaignOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Leads Funnel Chart */}
      <LeadsFunnelChart dateRange={dateRange} />

      {/* Campaign Performance Table */}
      <CampaignPerformanceTable 
        dateRange={dateRange}
        selectedCampaign={selectedCampaign}
        selectedSource={selectedSource}
      />

      {/* Dialogs */}
      <NewLeadDialog 
        open={isNewLeadOpen} 
        onOpenChange={setIsNewLeadOpen} 
      />
      <NewCampaignDialog 
        open={isNewCampaignOpen} 
        onOpenChange={setIsNewCampaignOpen} 
      />
      <CSVImportDialog 
        open={isCSVImportOpen} 
        onOpenChange={setIsCSVImportOpen} 
      />
    </div>
  );
}