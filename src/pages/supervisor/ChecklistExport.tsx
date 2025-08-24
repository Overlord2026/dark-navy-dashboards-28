import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Download, 
  RefreshCw, 
  FileSpreadsheet, 
  BarChart3,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllChecklists } from '@/features/estate/checklist/store';
import { recomputeAllChecklists } from '@/features/estate/checklist/recompute';
import { 
  CHECKLIST_ITEM_LABELS, 
  type Checklist, 
  type ChecklistItemKey 
} from '@/features/estate/checklist/types';

type ChecklistExportRow = {
  clientId: string;
  state: string;
  lastUpdated: string;
  completionPercentage: number;
  [key: string]: string | number; // For individual checklist items
};

export default function ChecklistExportPage() {
  const { toast } = useToast();
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [recomputing, setRecomputing] = useState(false);
  const [filterClientId, setFilterClientId] = useState('');

  useEffect(() => {
    loadChecklists();
  }, []);

  const loadChecklists = async () => {
    setLoading(true);
    try {
      const allChecklists = await getAllChecklists();
      setChecklists(allChecklists);
    } catch (error) {
      console.error('Failed to load checklists:', error);
      toast({
        title: 'Error',
        description: 'Failed to load checklists.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecomputeAll = async () => {
    setRecomputing(true);
    try {
      const result = await recomputeAllChecklists();
      
      await loadChecklists(); // Reload after recompute
      
      toast({
        title: 'Recompute Complete',
        description: `Processed ${result.processed} checklists${result.errors.length > 0 ? ` with ${result.errors.length} errors` : ''}.`,
      });
    } catch (error) {
      console.error('Failed to recompute checklists:', error);
      toast({
        title: 'Error',
        description: 'Failed to recompute checklists.',
        variant: 'destructive',
      });
    } finally {
      setRecomputing(false);
    }
  };

  const exportToCSV = () => {
    const filteredChecklists = filterClientId 
      ? checklists.filter(c => c.clientId.includes(filterClientId))
      : checklists;

    if (filteredChecklists.length === 0) {
      toast({
        title: 'No Data',
        description: 'No checklists to export.',
        variant: 'destructive',
      });
      return;
    }

    // Prepare CSV data
    const headers = [
      'clientId',
      'state', 
      'lastUpdated',
      'completionPercentage',
      ...Object.keys(CHECKLIST_ITEM_LABELS)
    ];

    const rows: ChecklistExportRow[] = filteredChecklists.map(checklist => {
      const completedItems = Object.values(checklist.items).filter(
        item => item.status === 'COMPLETE'
      ).length;
      const totalItems = Object.values(checklist.items).length;
      const completionPercentage = Math.round((completedItems / totalItems) * 100);

      const row: ChecklistExportRow = {
        clientId: checklist.clientId,
        state: checklist.state || '',
        lastUpdated: checklist.lastUpdated,
        completionPercentage
      };

      // Add individual checklist item statuses
      Object.keys(CHECKLIST_ITEM_LABELS).forEach(key => {
        const item = checklist.items[key as ChecklistItemKey];
        row[key] = item?.status || 'PENDING';
      });

      return row;
    });

    // Convert to CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        headers.map(header => {
          const value = row[header];
          // Wrap in quotes if contains comma
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `estate_checklist_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    toast({
      title: 'Export Complete',
      description: `Exported ${filteredChecklists.length} checklists to CSV.`,
    });
  };

  const getStatusStats = () => {
    const stats = {
      total: checklists.length,
      complete: 0,
      inProgress: 0,
      needsAttention: 0
    };

    checklists.forEach(checklist => {
      const items = Object.values(checklist.items);
      const hasNeedsAttention = items.some(item => item.status === 'NEEDS_ATTENTION');
      const completedItems = items.filter(item => item.status === 'COMPLETE').length;
      const totalItems = items.length;

      if (completedItems === totalItems) {
        stats.complete++;
      } else if (hasNeedsAttention) {
        stats.needsAttention++;
      } else {
        stats.inProgress++;
      }
    });

    return stats;
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Estate Checklist Export</h1>
        <p className="text-muted-foreground">
          Export and analyze estate planning checklist data for compliance and reporting.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Total Clients</span>
                </div>
                <div className="text-2xl font-bold mt-2">{stats.total}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-xs">Complete</Badge>
                </div>
                <div className="text-2xl font-bold mt-2 text-green-700">{stats.complete}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">In Progress</Badge>
                </div>
                <div className="text-2xl font-bold mt-2">{stats.inProgress}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-xs">Needs Attention</Badge>
                </div>
                <div className="text-2xl font-bold mt-2 text-amber-700">{stats.needsAttention}</div>
              </CardContent>
            </Card>
          </div>

          {/* Recompute All */}
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Refresh checklist data and run bulk operations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button 
                  onClick={loadChecklists}
                  variant="outline"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Reload Data
                </Button>
                <Button 
                  onClick={handleRecomputeAll}
                  disabled={recomputing}
                >
                  <BarChart3 className={`h-4 w-4 mr-2 ${recomputing ? 'animate-spin' : ''}`} />
                  Recompute All Checklists
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                CSV Export
              </CardTitle>
              <CardDescription>
                Export estate planning checklist data for analysis and reporting.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="filter-client">Filter by Client ID (optional)</Label>
                <Input
                  id="filter-client"
                  value={filterClientId}
                  onChange={(e) => setFilterClientId(e.target.value)}
                  placeholder="Enter client ID to filter..."
                />
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  {filterClientId 
                    ? `${checklists.filter(c => c.clientId.includes(filterClientId)).length} filtered checklists`
                    : `${checklists.length} total checklists`
                  }
                </div>
                <Button onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export to CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Data Preview</CardTitle>
              <CardDescription>
                Preview of the first few records that will be exported.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-gray-300 p-2 text-left">Client ID</th>
                      <th className="border border-gray-300 p-2 text-left">State</th>
                      <th className="border border-gray-300 p-2 text-left">Completion</th>
                      <th className="border border-gray-300 p-2 text-left">Will</th>
                      <th className="border border-gray-300 p-2 text-left">Trust</th>
                      <th className="border border-gray-300 p-2 text-left">Healthcare</th>
                      <th className="border border-gray-300 p-2 text-left">...</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checklists.slice(0, 5).map((checklist) => {
                      const completed = Object.values(checklist.items).filter(i => i.status === 'COMPLETE').length;
                      const total = Object.values(checklist.items).length;
                      const percentage = Math.round((completed / total) * 100);
                      
                      return (
                        <tr key={checklist.clientId}>
                          <td className="border border-gray-300 p-2">{checklist.clientId}</td>
                          <td className="border border-gray-300 p-2">{checklist.state || '-'}</td>
                          <td className="border border-gray-300 p-2">{percentage}%</td>
                          <td className="border border-gray-300 p-2">{checklist.items.will?.status || 'PENDING'}</td>
                          <td className="border border-gray-300 p-2">{checklist.items.rlt?.status || 'PENDING'}</td>
                          <td className="border border-gray-300 p-2">{checklist.items.hc_poa?.status || 'PENDING'}</td>
                          <td className="border border-gray-300 p-2 text-muted-foreground">...</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {checklists.length > 5 && (
                <div className="text-sm text-muted-foreground mt-2">
                  ...and {checklists.length - 5} more records
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Completion Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <p>Advanced analytics coming soon...</p>
                <p className="text-sm">Charts and trend analysis will be available here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}