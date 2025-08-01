import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface DateRange {
  from?: Date;
  to?: Date;
}

interface CampaignPerformanceTableProps {
  dateRange: DateRange | undefined;
  selectedCampaign: string;
  selectedSource: string;
}

export function CampaignPerformanceTable({ 
  dateRange, 
  selectedCampaign, 
  selectedSource 
}: CampaignPerformanceTableProps) {
  // TODO: Fetch real data based on filters
  const campaigns = [
    {
      id: '1',
      campaign: 'Facebook Q4',
      source: 'FB Ad1',
      spend: 4000,
      cpl: 32,
      leads: 124,
      shows: 29,
      closes: 7,
      firstClose: 1400,
      ltv: 8000,
      roi: 324,
    },
    {
      id: '2',
      campaign: 'Google Search',
      source: 'G Ads',
      spend: 1800,
      cpl: 50,
      leads: 36,
      shows: 14,
      closes: 3,
      firstClose: 900,
      ltv: 7000,
      roi: 278,
    },
    {
      id: '3',
      campaign: 'LinkedIn Pro',
      source: 'LI Ads',
      spend: 2200,
      cpl: 73,
      leads: 30,
      shows: 12,
      closes: 4,
      firstClose: 1200,
      ltv: 9500,
      roi: 373,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Spend</TableHead>
                <TableHead className="text-right">CPL</TableHead>
                <TableHead className="text-right"># Leads</TableHead>
                <TableHead className="text-right"># Shows</TableHead>
                <TableHead className="text-right">Closes</TableHead>
                <TableHead className="text-right">1st Close $</TableHead>
                <TableHead className="text-right">LTV</TableHead>
                <TableHead className="text-right">ROI %</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.campaign}</TableCell>
                  <TableCell>{campaign.source}</TableCell>
                  <TableCell className="text-right">{formatCurrency(campaign.spend)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(campaign.cpl)}</TableCell>
                  <TableCell className="text-right">{campaign.leads}</TableCell>
                  <TableCell className="text-right">{campaign.shows}</TableCell>
                  <TableCell className="text-right">{campaign.closes}</TableCell>
                  <TableCell className="text-right">{formatCurrency(campaign.firstClose)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(campaign.ltv)}</TableCell>
                  <TableCell className="text-right text-green-600 font-semibold">
                    {campaign.roi}%
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}