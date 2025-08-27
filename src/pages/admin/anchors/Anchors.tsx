import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { anchorBatch, anchorSingle, replayVerify, writeAuditRDS } from '@/services/receipts';
import { 
  Anchor, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play, 
  Archive,
  Shield,
  AlertTriangle
} from 'lucide-react';

interface AnchorStats {
  total_receipts: number;
  anchored_receipts: number;
  pending_receipts: number;
  failed_verifications: number;
}

interface AuditChainEntry {
  id: string;
  occurred_at: string;
  merkle_root: string;
  prev_audit_hash?: string;
}

export default function Anchors() {
  const [stats, setStats] = useState<AnchorStats>({
    total_receipts: 0,
    anchored_receipts: 0,
    pending_receipts: 0,
    failed_verifications: 0
  });
  const [auditChain, setAuditChain] = useState<AuditChainEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [anchoring, setAnchoring] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchStats = async () => {
    try {
      // Get receipt counts
      const { count: total } = await supabase
        .from('domain_events')
        .select('*', { count: 'exact', head: true })
        .eq('aggregate_type', 'receipt');

      const { count: anchored } = await supabase
        .from('domain_events')
        .select('*', { count: 'exact', head: true })
        .eq('aggregate_type', 'receipt')
        .not('anchor_ref', 'is', null);

      setStats({
        total_receipts: total || 0,
        anchored_receipts: anchored || 0,
        pending_receipts: (total || 0) - (anchored || 0),
        failed_verifications: 0 // Will be calculated during verification
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchAuditChain = async () => {
    try {
      const { data, error } = await supabase
        .from('domain_events')
        .select('id, occurred_at, event_data')
        .eq('event_type', 'Audit-RDS')
        .order('occurred_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const chainEntries = data.map(entry => {
        const eventData = entry.event_data as any;
        return {
          id: entry.id,
          occurred_at: entry.occurred_at,
          merkle_root: eventData?.merkle_root || 'unknown',
          prev_audit_hash: eventData?.prev_audit_hash
        };
      });

      setAuditChain(chainEntries);
    } catch (error) {
      console.error('Failed to fetch audit chain:', error);
    }
  };

  const verifyAll = async () => {
    setVerifying(true);
    let failedCount = 0;

    try {
      const { data: receipts, error } = await supabase
        .from('domain_events')
        .select('id, event_type')
        .eq('aggregate_type', 'receipt')
        .limit(100);

      if (error) throw error;

      for (const receipt of receipts || []) {
        const isValid = await replayVerify(receipt.event_type, receipt.id);
        if (!isValid) failedCount++;
      }

      setStats(prev => ({ ...prev, failed_verifications: failedCount }));
      setMessage({ 
        type: failedCount === 0 ? 'success' : 'error',
        text: `Verification complete. ${failedCount} failed verifications.`
      });
    } catch (error) {
      console.error('Verification failed:', error);
      setMessage({ type: 'error', text: 'Verification failed. Check console for details.' });
    } finally {
      setVerifying(false);
    }
  };

  const anchorNow = async () => {
    setAnchoring(true);
    try {
      const anchorRef = await anchorBatch();
      
      // Write audit RDS
      const lastAuditHash = auditChain[0]?.merkle_root;
      await writeAuditRDS(anchorRef.merkle_root || 'unknown', lastAuditHash);
      
      setMessage({ type: 'success', text: `Anchored ${anchorRef.batch_size || 0} receipts successfully.` });
      await fetchStats();
      await fetchAuditChain();
    } catch (error) {
      console.error('Anchoring failed:', error);
      setMessage({ type: 'error', text: 'Anchoring failed. Check console for details.' });
    } finally {
      setAnchoring(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchAuditChain()]);
      setLoading(false);
    };
    init();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Anchor className="h-6 w-6" />
            Trust Rails - Anchors
          </h1>
          <p className="text-muted-foreground">
            Verify receipt integrity and manage anchor operations
          </p>
        </div>
        <Button onClick={() => {fetchStats(); fetchAuditChain();}} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {message && (
        <Alert className={message.type === 'error' ? 'border-red-500' : 'border-green-500'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Receipts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_receipts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Anchored
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.anchored_receipts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending_receipts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Failed Verify
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed_verifications}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Verification & Anchoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Button 
                onClick={verifyAll} 
                disabled={verifying}
                variant="outline"
                className="w-full"
              >
                <CheckCircle className={`h-4 w-4 mr-2 ${verifying ? 'animate-spin' : ''}`} />
                {verifying ? 'Verifying...' : 'Verify All (Replay Check)'}
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                Deterministically recompute all receipt hashes
              </p>
            </div>

            <div>
              <Button 
                onClick={anchorNow} 
                disabled={anchoring || stats.pending_receipts === 0}
                className="w-full"
              >
                <Play className={`h-4 w-4 mr-2 ${anchoring ? 'animate-spin' : ''}`} />
                {anchoring ? 'Anchoring...' : `Anchor Now (${stats.pending_receipts} pending)`}
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                Batch anchor all pending receipts
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Audit-RDS Chain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {auditChain.map((entry, index) => (
                <div key={entry.id} className="border rounded p-3 text-sm">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline">Block #{auditChain.length - index}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.occurred_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="font-mono text-xs space-y-1">
                    <div>Root: {entry.merkle_root.slice(0, 16)}...</div>
                    {entry.prev_audit_hash && (
                      <div className="text-muted-foreground">
                        Prev: {entry.prev_audit_hash.slice(0, 16)}...
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {auditChain.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No audit chain entries found
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}