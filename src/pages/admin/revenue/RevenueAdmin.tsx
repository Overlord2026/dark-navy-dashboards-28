import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { importRevenue, applyRules, processPayout, getRevenueSummary, explainSplit } from '@/services/revEngine';
import { DollarSign, TrendingUp, Calculator, FileText, Upload } from 'lucide-react';

interface RevenueSummary {
  total_gross: number;
  total_net: number;
  total_splits: number;
  periods_processed: number;
}

export default function RevenueAdmin() {
  const [summary, setSummary] = useState<RevenueSummary>({
    total_gross: 0,
    total_net: 0,
    total_splits: 0,
    periods_processed: 0
  });
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [selectedIar, setSelectedIar] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    if (!selectedIar) return;
    
    try {
      const summaryData = await getRevenueSummary(selectedIar);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to fetch revenue summary:', error);
    }
  };

  const handleImportRevenue = async () => {
    if (!selectedIar || !selectedPeriod) return;

    setLoading(true);
    try {
      // Mock revenue data
      const mockData = [
        { amount: 15000, product_type: 'advisory_fee', client_hash: 'client_001_hash' },
        { amount: 8500, product_type: 'commission', client_hash: 'client_002_hash' },
        { amount: 12000, product_type: 'advisory_fee', client_hash: 'client_003_hash' }
      ];

      await importRevenue(selectedPeriod, selectedIar, mockData);
      await fetchSummary();
    } catch (error) {
      console.error('Failed to import revenue:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyRules = async () => {
    if (!selectedIar || !selectedPeriod) return;

    setLoading(true);
    try {
      await applyRules(selectedPeriod, selectedIar);
      await fetchSummary();
    } catch (error) {
      console.error('Failed to apply rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayout = async () => {
    if (!selectedIar || !selectedPeriod) return;

    setLoading(true);
    try {
      await processPayout(selectedIar, selectedPeriod);
      await fetchSummary();
    } catch (error) {
      console.error('Failed to process payout:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedIar) {
      fetchSummary();
    }
  }, [selectedIar]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="h-6 w-6" />
            Revenue Share Engine
          </h1>
          <p className="text-muted-foreground">
            Rules-based revenue sharing with content-free receipts
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-01">Jan 2024</SelectItem>
              <SelectItem value="2024-02">Feb 2024</SelectItem>
              <SelectItem value="2024-03">Mar 2024</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedIar} onValueChange={setSelectedIar}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select IAR" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="iar_001">John Smith (IAR001)</SelectItem>
              <SelectItem value="iar_002">Jane Doe (IAR002)</SelectItem>
              <SelectItem value="iar_003">Bob Wilson (IAR003)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Gross</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${summary.total_gross.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Net</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${summary.total_net.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Splits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${summary.total_splits.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Periods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.periods_processed}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="import" className="space-y-4">
        <TabsList>
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="ledger">Ledger</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Revenue Import
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Button 
                  onClick={handleImportRevenue} 
                  disabled={loading || !selectedIar || !selectedPeriod}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Mock Data
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Imports revenue data and creates RevenueImport-RDS receipt
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Apply Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Button 
                  onClick={handleApplyRules} 
                  disabled={loading || !selectedIar || !selectedPeriod}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Apply Revenue Rules
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Applies revenue sharing rules and creates Recalc-RDS receipt
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ledger" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Ledger</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Gross</TableHead>
                    <TableHead>Net</TableHead>
                    <TableHead>Split</TableHead>
                    <TableHead>Rules</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{selectedPeriod}</TableCell>
                    <TableCell>$35,500</TableCell>
                    <TableCell>$31,950</TableCell>
                    <TableCell>$3,550</TableCell>
                    <TableCell>
                      <Badge variant="outline">10% split</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Process Payouts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Button 
                  onClick={handleProcessPayout} 
                  disabled={loading || !selectedIar || !selectedPeriod}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Process Payout
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Creates payout request with Payout-RDS and Tax-RDS receipts
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-xs text-muted-foreground">
        All revenue operations create content-free receipts • No PII in ledger • Tax forms generated for $600+ payouts
      </div>
    </div>
  );
}