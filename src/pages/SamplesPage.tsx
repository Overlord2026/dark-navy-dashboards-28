import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Download, Package, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReceiptSummary {
  id: string;
  org_id: string;
  domain: string;
  use_case: string;
  close_cycle_id: string;
  as_of_date: string;
  materiality_bucket: string;
}

export default function SamplesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [receipts, setReceipts] = useState<ReceiptSummary[]>([]);
  const [selectedCycle, setSelectedCycle] = useState('');
  const [sampleSize, setSampleSize] = useState(10);
  const [selectedReceipts, setSelectedReceipts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const { data, error } = await supabase
        .from('aies_receipts')
        .select('id, org_id, domain, use_case, close_cycle_id, as_of_date, materiality_bucket')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReceipts(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load receipts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const uniqueCycles = Array.from(new Set(receipts.map(r => r.close_cycle_id))).sort();

  const filteredReceipts = selectedCycle 
    ? receipts.filter(r => r.close_cycle_id === selectedCycle)
    : receipts;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const sampleIds = filteredReceipts.slice(0, sampleSize).map(r => r.id);
      setSelectedReceipts(sampleIds);
    } else {
      setSelectedReceipts([]);
    }
  };

  const handleSelectReceipt = (receiptId: string, checked: boolean) => {
    if (checked) {
      setSelectedReceipts(prev => [...prev, receiptId]);
    } else {
      setSelectedReceipts(prev => prev.filter(id => id !== receiptId));
    }
  };

  const handleExportSamples = async () => {
    if (selectedReceipts.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one receipt",
        variant: "destructive"
      });
      return;
    }

    setExporting(true);
    try {
      // TODO: Call batch export API
      const { data, error } = await supabase.functions.invoke('aies-export-batch', {
        body: { 
          receipt_ids: selectedReceipts,
          export_name: `sample_${selectedCycle || 'all'}_${new Date().toISOString().split('T')[0]}`
        }
      });

      if (error) throw error;
      
      if (data?.download_url) {
        window.open(data.download_url, '_blank');
        toast({
          title: "Success",
          description: `Exported ${selectedReceipts.length} receipts successfully`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export samples",
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  const sampledReceipts = filteredReceipts.slice(0, sampleSize);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/receipts')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Receipts
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Export Samples</h1>
          <p className="text-muted-foreground">Download evidence bundles for selected receipts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Export Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cycle">Close Cycle ID</Label>
              <Select value={selectedCycle} onValueChange={setSelectedCycle}>
                <SelectTrigger>
                  <SelectValue placeholder="All cycles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Cycles</SelectItem>
                  {uniqueCycles.map(cycle => (
                    <SelectItem key={cycle} value={cycle}>{cycle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sampleSize">Sample Size</Label>
              <Input
                id="sampleSize"
                type="number"
                min="1"
                max="100"
                value={sampleSize}
                onChange={(e) => setSampleSize(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Maximum 100 receipts per export
              </p>
            </div>

            <div className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <Label>Selected Receipts</Label>
                <span className="text-sm text-muted-foreground">
                  {selectedReceipts.length} of {sampledReceipts.length}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 mb-3">
                <Checkbox
                  id="selectAll"
                  checked={selectedReceipts.length === sampledReceipts.length && sampledReceipts.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="selectAll" className="text-sm">
                  Select all ({sampledReceipts.length})
                </Label>
              </div>

              <Button 
                onClick={handleExportSamples}
                disabled={selectedReceipts.length === 0 || exporting}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                {exporting ? 'Exporting...' : 'Export Selected'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sample Preview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Sample Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sampledReceipts.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sampledReceipts.map((receipt) => (
                  <div 
                    key={receipt.id} 
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <Checkbox
                      checked={selectedReceipts.includes(receipt.id)}
                      onCheckedChange={(checked) => handleSelectReceipt(receipt.id, checked as boolean)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{receipt.close_cycle_id}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm">{receipt.use_case}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{new Date(receipt.as_of_date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="capitalize">{receipt.materiality_bucket}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {selectedCycle ? (
                  <>No receipts found for cycle: {selectedCycle}</>
                ) : (
                  <>No receipts available</>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}