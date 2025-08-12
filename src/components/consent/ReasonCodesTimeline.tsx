// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Shield, 
  Link, 
  Filter,
  RefreshCw,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function ReasonCodesTimeline() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    action_key: '',
    reason_code: '',
    persona: ''
  });

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('reason_receipts')
        .select(`
          *,
          personas (
            kind
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filter.action_key) {
        query = query.ilike('action_key', `%${filter.action_key}%`);
      }
      if (filter.reason_code) {
        query = query.eq('reason_code', filter.reason_code);
      }

      const { data, error } = await query.limit(100);
      
      if (error) throw error;
      setReceipts(data || []);
    } catch (error) {
      console.error('Error fetching receipts:', error);
      toast.error('Failed to load reason receipts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [filter]);

  const getReasonIcon = (reasonCode: string) => {
    switch (reasonCode) {
      case 'OK_POLICY':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'BLOCK_CONFLICT':
      case 'SCOPE_VIOLATION':
      case 'INSUFFICIENT_CONSENT':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'REQUIRE_DISCLOSURE':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'TAKEDOWN_DUE_TO_REVOCATION':
        return <Shield className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getReasonBadge = (reasonCode: string) => {
    switch (reasonCode) {
      case 'OK_POLICY':
        return <Badge variant="default">Allowed</Badge>;
      case 'BLOCK_CONFLICT':
      case 'SCOPE_VIOLATION':
      case 'INSUFFICIENT_CONSENT':
        return <Badge variant="destructive">Blocked</Badge>;
      case 'REQUIRE_DISCLOSURE':
        return <Badge variant="secondary">Conditional</Badge>;
      case 'TAKEDOWN_DUE_TO_REVOCATION':
        return <Badge variant="outline">Takedown</Badge>;
      default:
        return <Badge variant="outline">{reasonCode}</Badge>;
    }
  };

  const openAnchorExplorer = (anchorTxid: string) => {
    // Mock anchor explorer - in production would link to actual blockchain explorer
    const explorerUrl = `https://explorer.example.com/tx/${anchorTxid}`;
    window.open(explorerUrl, '_blank');
    toast.info('Opening anchor explorer (mock URL)');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      relative: getRelativeTime(date)
    };
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reason Codes Timeline</h2>
        <Button 
          onClick={fetchReceipts} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Filter by action..."
                value={filter.action_key}
                onChange={(e) => setFilter(prev => ({ ...prev, action_key: e.target.value }))}
              />
            </div>
            
            <div>
              <Select 
                value={filter.reason_code} 
                onValueChange={(value) => setFilter(prev => ({ ...prev, reason_code: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by reason..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Reasons</SelectItem>
                  <SelectItem value="OK_POLICY">OK_POLICY</SelectItem>
                  <SelectItem value="BLOCK_CONFLICT">BLOCK_CONFLICT</SelectItem>
                  <SelectItem value="SCOPE_VIOLATION">SCOPE_VIOLATION</SelectItem>
                  <SelectItem value="INSUFFICIENT_CONSENT">INSUFFICIENT_CONSENT</SelectItem>
                  <SelectItem value="REQUIRE_DISCLOSURE">REQUIRE_DISCLOSURE</SelectItem>
                  <SelectItem value="TAKEDOWN_DUE_TO_REVOCATION">TAKEDOWN_DUE_TO_REVOCATION</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select 
                value={filter.persona} 
                onValueChange={(value) => setFilter(prev => ({ ...prev, persona: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by persona..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Personas</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="advisor">Advisor</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="guardian">Guardian</SelectItem>
                  <SelectItem value="coach">Coach</SelectItem>
                  <SelectItem value="sponsor">Sponsor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {receipts.map((receipt, index) => {
              const time = formatTimestamp(receipt.created_at);
              
              return (
                <div key={receipt.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex flex-col items-center">
                      {getReasonIcon(receipt.reason_code)}
                      {index < receipts.length - 1 && (
                        <div className="w-px h-12 bg-border mt-2" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getReasonBadge(receipt.reason_code)}
                          <Badge variant="outline" className="text-xs">
                            {receipt.action_key}
                          </Badge>
                          {receipt.personas && (
                            <Badge variant="secondary" className="text-xs">
                              {receipt.personas.kind}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{time.relative}</span>
                          {receipt.anchor_txid && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openAnchorExplorer(receipt.anchor_txid)}
                              className="h-6 px-2"
                            >
                              <Link className="w-3 h-3 mr-1" />
                              Anchored
                            </Button>
                          )}
                        </div>
                      </div>

                      <p className="text-sm mb-2">{receipt.explanation}</p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span>{time.date} {time.time}</span>
                          {receipt.hash && (
                            <span className="font-mono">Hash: {receipt.hash.slice(0, 8)}...</span>
                          )}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                          onClick={() => {
                            navigator.clipboard.writeText(receipt.id);
                            toast.success('Receipt ID copied to clipboard');
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Copy ID
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {receipts.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No reason receipts found</p>
                <p className="text-sm">Try adjusting your filters or perform some actions to generate receipts</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}