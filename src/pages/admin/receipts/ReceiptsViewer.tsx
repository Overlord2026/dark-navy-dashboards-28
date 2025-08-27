import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Search, RefreshCw, ExternalLink, Clock, Hash, Shield } from 'lucide-react';

interface Receipt {
  id: string;
  event_type: string;
  occurred_at: string;
  event_data: any;
  metadata: any;
  anchor_ref?: any;
}

export default function ReceiptsViewer() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('domain_events')
        .select('*')
        .eq('aggregate_type', 'receipt')
        .order('occurred_at', { ascending: false })
        .limit(50);

      if (typeFilter !== 'all') {
        query = query.eq('event_type', typeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      setReceipts(data || []);

      // Extract unique types for filter
      const types = Array.from(new Set(data?.map(r => r.event_type) || []));
      setAvailableTypes(types);
    } catch (error) {
      console.error('Failed to fetch receipts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [typeFilter]);

  const filteredReceipts = receipts.filter(receipt =>
    searchTerm === '' || 
    receipt.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (ts: string) => {
    return new Date(ts).toLocaleString();
  };

  const getReceiptStatus = (receipt: Receipt) => {
    if (receipt.anchor_ref) {
      return { status: 'anchored', color: 'bg-green-500' };
    }
    return { status: 'pending', color: 'bg-yellow-500' };
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Trust Rails - Receipts Viewer</h1>
          <p className="text-muted-foreground">
            Content-free audit trail of all system receipts and attestations
          </p>
        </div>
        <Button onClick={fetchReceipts} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Input
            placeholder="Search by type or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {availableTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredReceipts.map((receipt) => {
          const { status, color } = getReceiptStatus(receipt);
          
          return (
            <Card key={receipt.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono text-xs">
                        {receipt.event_type}
                      </Badge>
                      <div className={`w-2 h-2 rounded-full ${color}`} title={status} />
                      <span className="text-xs text-muted-foreground">
                        {status === 'anchored' ? 'Anchored' : 'Pending Anchor'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-xs">{receipt.id.slice(0, 8)}...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatTimestamp(receipt.occurred_at)}</span>
                      </div>
                    </div>

                    {receipt.event_data?.inputs_hash && (
                      <div className="flex items-center gap-2 text-xs">
                        <Shield className="h-3 w-3 text-muted-foreground" />
                        <span className="font-mono">Hash: {receipt.event_data.inputs_hash.slice(0, 16)}...</span>
                      </div>
                    )}

                    {receipt.anchor_ref && (
                      <div className="text-xs text-green-600 dark:text-green-400">
                        Anchor: {receipt.anchor_ref.anchor_type} | {receipt.anchor_ref.anchor_id}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/admin/receipt/${receipt.id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredReceipts.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              {searchTerm || typeFilter !== 'all' ? 'No receipts match your filters' : 'No receipts found'}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-muted-foreground text-center">
        Showing last 50 receipts • Content-free audit trail • No PII/PHI stored
      </div>
    </div>
  );
}