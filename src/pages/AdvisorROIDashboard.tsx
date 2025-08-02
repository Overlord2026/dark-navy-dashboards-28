import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Plus, Download, Upload, FileText, TrendingUp, DollarSign, Users, Target, Award } from 'lucide-react';
import { useRealROIData } from '@/hooks/useRealROIData';
import { MainLayout } from '@/components/layout/MainLayout';
import { toast } from 'sonner';
import { addDays, format } from 'date-fns';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, FunnelChart, Funnel, LabelList, Cell } from 'recharts';
import confetti from 'canvas-confetti';

interface DateRange {
  from: Date;
  to: Date;
}

interface CSVImportData {
  leads?: any[];
  adSpend?: any[];
}

export default function AdvisorROIDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [metrics, setMetrics] = useState<any>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvType, setCsvType] = useState<'leads' | 'adSpend'>('leads');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [previousMetrics, setPreviousMetrics] = useState<any>(null);
  
  const { loading, getROIMetrics, createLead, createCampaign, importLeadsFromCSV, importAdSpendFromCSV } = useRealROIData();

  // Check for ROI milestones and trigger celebrations
  const checkROIMilestones = (newMetrics: any, oldMetrics: any) => {
    if (!oldMetrics || !newMetrics) return;

    const roi = ((newMetrics.totalRevenue - newMetrics.totalSpend) / Math.max(newMetrics.totalSpend, 1)) * 100;
    const oldROI = ((oldMetrics.totalRevenue - oldMetrics.totalSpend) / Math.max(oldMetrics.totalSpend, 1)) * 100;

    // ROI Milestones
    const roiMilestones = [100, 200, 300, 500, 1000];
    const reachedMilestone = roiMilestones.find(milestone => 
      roi >= milestone && oldROI < milestone
    );

    if (reachedMilestone) {
      // Trigger celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        colors: ['#FFC700', '#00D2FF', '#34C759'],
        origin: { y: 0.6 }
      });

      toast(`🎉 ROI Milestone Achieved!`, {
        description: `You've reached ${reachedMilestone}% ROI! Outstanding performance!`,
        duration: 5000,
      });
    }

    // Lead milestones
    if (newMetrics.totalLeads >= 100 && oldMetrics.totalLeads < 100) {
      confetti({
        particleCount: 50,
        spread: 60,
        colors: ['#00D2FF', '#FFFFFF'],
        origin: { y: 0.6 }
      });
      toast(`🎯 100 Leads Milestone!`, {
        description: `You've generated 100+ leads! Keep up the great work!`,
      });
    }

    // Revenue milestones
    if (newMetrics.totalRevenue >= 1000000 && oldMetrics.totalRevenue < 1000000) {
      confetti({
        particleCount: 150,
        spread: 80,
        colors: ['#FFC700', '#34C759', '#FFFFFF'],
        origin: { y: 0.6 }
      });
      toast(`💰 $1M Revenue Milestone!`, {
        description: `You've reached $1 million in revenue! Incredible achievement!`,
      });
    }
  };

  // Fetch data on mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getROIMetrics(dateRange);
        checkROIMilestones(data, metrics);
        setPreviousMetrics(metrics);
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching ROI data:', error);
      }
    };

    fetchData();
  }, [dateRange, getROIMetrics]);

  // Filter data based on selected source
  const filteredMetrics = metrics ? {
    ...metrics,
    leadSources: selectedSource === 'all' 
      ? metrics.leadSources 
      : metrics.leadSources.filter((s: any) => s.source === selectedSource),
    timelineData: selectedSource === 'all'
      ? metrics.timelineData
      : metrics.timelineData.map((d: any) => ({
          ...d,
          // Filter timeline data would require more complex logic
          // For now, we'll show all timeline data
        }))
  } : null;

  // Export to CSV
  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) {
      toast.error('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(','))
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Handle CSV import
  const handleCSVImport = async () => {
    if (!csvFile) {
      toast.error('Please select a CSV file');
      return;
    }

    try {
      const text = await csvFile.text();
      const lines = text.split('\\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const data = lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index]?.trim().replace(/^"|"$/g, '') || '';
          return obj;
        }, {} as any);
      });

      if (csvType === 'leads') {
        await importLeadsFromCSV(data);
      } else {
        await importAdSpendFromCSV(data);
      }

      // Refresh data and check for milestones
      const refreshedData = await getROIMetrics(dateRange);
      checkROIMilestones(refreshedData, metrics);
      setPreviousMetrics(metrics);
      setMetrics(refreshedData);
      setShowImportDialog(false);
      setCsvFile(null);
    } catch (error) {
      console.error('Error importing CSV:', error);
      toast.error('Failed to import CSV file');
    }
  };

  const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-surface">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-white mb-2 font-display tracking-tight">
              ROI ANALYTICS DASHBOARD
            </h1>
            <p className="text-text-secondary text-lg">
              Track your lead generation performance and return on investment
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6 bg-surface border-border-primary">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <DatePickerWithRange
                  date={dateRange}
                  onDateChange={(newDateRange) => setDateRange(newDateRange && newDateRange.from && newDateRange.to ? { from: newDateRange.from, to: newDateRange.to } : { from: new Date(), to: new Date() })}
                  className="w-full lg:w-[300px]"
                />
                
                <Select value={selectedSource} onValueChange={setSelectedSource}>
                  <SelectTrigger className="w-full lg:w-[200px] bg-card border-border-primary text-white">
                    <SelectValue placeholder="All Sources" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-border-primary">
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="google_ads">Google Ads</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2 ml-auto flex-wrap">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setCsvType('leads');
                      setShowImportDialog(true);
                    }}
                    className="border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-primary"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Leads
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setCsvType('adSpend');
                      setShowImportDialog(true);
                    }}
                    className="border-accent-aqua text-accent-aqua hover:bg-accent-aqua hover:text-primary"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Ad Spend
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => exportToCSV(metrics?.leads || [], 'leads')}
                    disabled={!metrics?.leads?.length}
                    className="border-white text-white hover:bg-white hover:text-primary"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Leads
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => exportToCSV(metrics?.campaigns || [], 'ad-spend')}
                    disabled={!metrics?.campaigns?.length}
                    className="border-white text-white hover:bg-white hover:text-primary"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Ad Spend
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ROI Milestone Display */}
          {filteredMetrics && (
            <Card className="mb-6 bg-gradient-to-r from-accent-gold/20 to-accent-aqua/20 border-accent-gold">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">ROI Performance</h3>
                    <p className="text-3xl font-black text-accent-gold">
                      {(((filteredMetrics.totalRevenue - filteredMetrics.totalSpend) / Math.max(filteredMetrics.totalSpend, 1)) * 100).toFixed(1)}%
                    </p>
                    <p className="text-text-secondary">Current Return on Investment</p>
                  </div>
                  <Award className="h-12 w-12 text-accent-gold" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="bg-card border-border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm font-medium">Total Ad Spend</p>
                    <p className="text-2xl font-bold text-white">
                      ${(filteredMetrics?.totalSpend || 0).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-accent-gold" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm font-medium">Leads Generated</p>
                    <p className="text-2xl font-bold text-white">
                      {filteredMetrics?.totalLeads || 0}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-accent-aqua" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm font-medium">Cost Per Lead</p>
                    <p className="text-2xl font-bold text-white">
                      ${(filteredMetrics?.costPerLead || 0).toFixed(2)}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-accent-gold" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm font-medium">Conversion Rate</p>
                    <p className="text-2xl font-bold text-white">
                      {(filteredMetrics?.conversionRate || 0).toFixed(1)}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-accent-emerald" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm font-medium">Revenue</p>
                    <p className="text-2xl font-bold text-white">
                      ${(filteredMetrics?.totalRevenue || 0).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-accent-emerald" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Lead Source Performance */}
            <Card className="bg-surface border-border-primary">
              <CardHeader>
                <CardTitle className="text-white font-display">Lead Source Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredMetrics?.leadSources || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2A3458" />
                      <XAxis dataKey="source" stroke="#A6B2D1" />
                      <YAxis stroke="#A6B2D1" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E2333', 
                          border: '1px solid #2A3458',
                          borderRadius: '8px',
                          color: '#FFFFFF'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="count" name="Leads" fill="hsl(var(--accent-aqua))" />
                      <Bar dataKey="spend" name="Spend ($)" fill="hsl(var(--accent-gold))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Conversion Funnel */}
            <Card className="bg-surface border-border-primary">
              <CardHeader>
                <CardTitle className="text-white font-display">Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredMetrics?.conversionFunnel || []} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#2A3458" />
                      <XAxis type="number" stroke="#A6B2D1" />
                      <YAxis dataKey="stage" type="category" stroke="#A6B2D1" width={80} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E2333', 
                          border: '1px solid #2A3458',
                          borderRadius: '8px',
                          color: '#FFFFFF'
                        }} 
                        formatter={(value, name) => [
                          name === 'count' ? `${value} leads` : `${value}%`,
                          name === 'count' ? 'Count' : 'Conversion Rate'
                        ]}
                      />
                      <Bar dataKey="count" fill="hsl(var(--accent-emerald))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline Chart */}
          <Card className="bg-surface border-border-primary mb-8">
            <CardHeader>
              <CardTitle className="text-white font-display">Performance Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredMetrics?.timelineData || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A3458" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#A6B2D1"
                      tickFormatter={(date) => format(new Date(date), 'MMM d')}
                    />
                    <YAxis yAxisId="left" stroke="#A6B2D1" />
                    <YAxis yAxisId="right" orientation="right" stroke="#A6B2D1" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1E2333', 
                        border: '1px solid #2A3458',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                      labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                    />
                    <Legend />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="leads" 
                      stroke="hsl(var(--accent-aqua))" 
                      strokeWidth={3}
                      name="Leads"
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="spend" 
                      stroke="hsl(var(--accent-gold))" 
                      strokeWidth={3}
                      name="Ad Spend ($)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* CSV Import Dialog */}
          {showImportDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="bg-surface border-border-primary w-full max-w-md">
                <CardHeader>
                  <CardTitle className="text-white font-display">
                    Import {csvType === 'leads' ? 'Leads' : 'Ad Spend'} Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Select CSV file
                    </label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                      className="w-full p-2 border border-border-primary rounded bg-card text-white"
                    />
                  </div>
                  
                  <div className="text-xs text-text-secondary">
                    <p className="font-medium mb-1">Expected columns:</p>
                    {csvType === 'leads' ? (
                      <p>name, email, phone, status, interest, budget, source, score</p>
                    ) : (
                      <p>campaign_name, source, amount, spend_date, clicks, impressions</p>
                    )}
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowImportDialog(false);
                        setCsvFile(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCSVImport}
                      disabled={!csvFile || loading}
                      className="bg-accent-gold text-primary hover:bg-accent-gold/90"
                    >
                      Import
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}