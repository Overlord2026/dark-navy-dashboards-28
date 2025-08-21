import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Anchor, 
  Search,
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Link2,
  Network,
  Database,
  DollarSign,
  Zap
} from 'lucide-react';
import { 
  anchorBatch, 
  acceptNofM, 
  resolveAnchor, 
  getAnchorProviders,
  type AnchorRef,
  type AnchorResolution 
} from '@/features/anchor/providers';
import { toast } from 'sonner';

export default function AnchorManager() {
  const [rootHash, setRootHash] = useState('');
  const [anchorResult, setAnchorResult] = useState<AnchorRef | null>(null);
  const [resolutionResult, setResolutionResult] = useState<AnchorResolution | null>(null);
  const [selectedProviders, setSelectedProviders] = useState<string[]>(['polygon_pos', 'dev_local']);
  const [maxCostCents, setMaxCostCents] = useState(500);
  const [requiredN, setRequiredN] = useState(1);
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  const providers = getAnchorProviders();
  const enabledProviders = Object.values(providers).filter(p => p.enabled);

  // Sample root hashes for testing
  const sampleRoots = [
    'merkle_root_health_rds_123456789abcdef',
    'merkle_root_pa_rds_987654321fedcba', 
    'merkle_root_consent_rds_1a2b3c4d5e6f',
    'merkle_root_vault_rds_fedcba987654321'
  ];

  const generateMockRoot = () => {
    const timestamp = Date.now().toString(16);
    const random = Math.random().toString(36).substring(2, 10);
    setRootHash(`merkle_root_${random}_${timestamp}`);
  };

  const createAnchorBatch = async () => {
    if (!rootHash.trim()) {
      toast.error('Please enter a root hash');
      return;
    }

    setIsAnchoring(true);
    setAnchorResult(null);

    try {
      console.info('Creating anchor batch for:', rootHash.substring(0, 20) + '...');
      
      const result = await anchorBatch(rootHash, {
        providers: selectedProviders,
        max_cost_cents: maxCostCents,
        min_finality_seconds: 0,
        require_confirmations: 1
      });

      setAnchorResult(result);
      toast.success(`Anchored to ${result.providers_used.length} providers`);
    } catch (error) {
      console.error('Anchoring failed:', error);
      toast.error('Failed to create anchor batch: ' + String(error));
    } finally {
      setIsAnchoring(false);
    }
  };

  const resolveAnchorStatus = async () => {
    if (!rootHash.trim()) {
      toast.error('Please enter a root hash to resolve');
      return;
    }

    setIsResolving(true);
    setResolutionResult(null);

    try {
      console.info('Resolving anchor for:', rootHash.substring(0, 20) + '...');
      
      const result = await resolveAnchor(rootHash);
      setResolutionResult(result);
      
      if (result.found) {
        const accepted = acceptNofM(result.anchor_ref!, requiredN);
        toast.success(`Anchor resolved: ${result.confirmed_count}/${result.total_count} confirmed (${accepted ? 'Accepted' : 'Rejected'} for ${requiredN}-of-M)`);
      } else {
        toast.warning('Anchor not found');
      }
    } catch (error) {
      console.error('Resolution failed:', error);
      toast.error('Failed to resolve anchor: ' + String(error));
    } finally {
      setIsResolving(false);
    }
  };

  const toggleProvider = (providerId: string) => {
    setSelectedProviders(prev => 
      prev.includes(providerId)
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  const getProviderStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending': return <Clock className="h-4 w-4 text-warning animate-pulse" />;
      case 'failed': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatCost = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(cents / 100);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Anchor className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Anchor Manager</h1>
          <p className="text-muted-foreground">Cross-chain anchoring with N-of-M verification</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anchoring Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Create Anchor Batch
            </CardTitle>
            <CardDescription>
              Anchor a merkle root to multiple blockchain providers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Root Hash</label>
              <div className="flex gap-2">
                <Input
                  value={rootHash}
                  onChange={(e) => setRootHash(e.target.value)}
                  placeholder="Enter merkle root hash..."
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  onClick={generateMockRoot}
                  size="sm"
                >
                  Generate
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Sample Roots</label>
              <div className="flex flex-wrap gap-1">
                {sampleRoots.map((sample, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs font-mono"
                    onClick={() => setRootHash(sample)}
                  >
                    {sample.substring(0, 20)}...
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Providers</label>
              <div className="space-y-2">
                {enabledProviders.map((provider) => (
                  <div
                    key={provider.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedProviders.includes(provider.id)
                        ? 'border-primary bg-muted/50'
                        : 'hover:bg-muted/20'
                    }`}
                    onClick={() => toggleProvider(provider.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedProviders.includes(provider.id)}
                          onChange={() => toggleProvider(provider.id)}
                          className="rounded"
                        />
                        <span className="font-medium">{provider.name}</span>
                        <Badge variant={provider.type === 'permissioned' ? 'default' : 'secondary'}>
                          {provider.type}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatCost(provider.cost_per_anchor || 0)}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {provider.chain_id} • ~{provider.avg_finality_seconds}s finality
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Max Cost</label>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={maxCostCents}
                    onChange={(e) => setMaxCostCents(Number(e.target.value))}
                    min="0"
                    max="10000"
                    step="25"
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatCost(maxCostCents)} maximum
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">N-of-M</label>
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={requiredN}
                    onChange={(e) => setRequiredN(Number(e.target.value))}
                    min="1"
                    max={selectedProviders.length}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Require {requiredN} confirmations
                </div>
              </div>
            </div>

            <Button
              onClick={createAnchorBatch}
              disabled={isAnchoring || selectedProviders.length === 0 || !rootHash.trim()}
              className="w-full"
            >
              {isAnchoring ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Anchoring...
                </>
              ) : (
                <>
                  <Anchor className="h-4 w-4 mr-2" />
                  Create Anchor Batch
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Resolution Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Resolve Anchor
            </CardTitle>
            <CardDescription>
              Check anchor status and N-of-M acceptance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={resolveAnchorStatus}
              disabled={isResolving || !rootHash.trim()}
              className="w-full"
              variant="outline"
            >
              {isResolving ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Resolving...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Resolve Anchor Status
                </>
              )}
            </Button>

            {resolutionResult && (
              <div className="space-y-4">
                <Alert variant={resolutionResult.found ? 'default' : 'destructive'}>
                  <Database className="h-4 w-4" />
                  <AlertDescription>
                    {resolutionResult.found ? (
                      <div>
                        <strong>Anchor Found:</strong> {resolutionResult.confirmed_count}/{resolutionResult.total_count} confirmations
                        {resolutionResult.n_of_m_status && (
                          <div className="mt-1">
                            <Badge variant={resolutionResult.n_of_m_status.accepted ? 'default' : 'destructive'}>
                              {resolutionResult.n_of_m_status.accepted ? 'ACCEPTED' : 'REJECTED'} ({requiredN}-of-M)
                            </Badge>
                          </div>
                        )}
                      </div>
                    ) : (
                      'Anchor not found in any provider'
                    )}
                  </AlertDescription>
                </Alert>

                {resolutionResult.anchor_ref && (
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium mb-2">Provider Status</div>
                      <div className="space-y-2">
                        {resolutionResult.anchor_ref.anchors.map((anchor, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              {getProviderStatusIcon(anchor.status)}
                              <div>
                                <div className="font-medium">{providers[anchor.provider_id]?.name || anchor.provider_id}</div>
                                <div className="text-xs text-muted-foreground font-mono">
                                  {anchor.tx_ref.substring(0, 20)}...
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={
                                anchor.status === 'confirmed' ? 'default' :
                                anchor.status === 'pending' ? 'secondary' : 'destructive'
                              }>
                                {anchor.status}
                              </Badge>
                              {anchor.confirmations && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {anchor.confirmations} confirmations
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Batch ID:</span>
                        <div className="font-mono text-xs text-muted-foreground">
                          {resolutionResult.anchor_ref.batch_id}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Created:</span>
                        <div className="text-xs text-muted-foreground">
                          {formatTimestamp(new Date(resolutionResult.anchor_ref.created_at).getTime())}
                        </div>
                      </div>
                    </div>

                    {resolutionResult.anchor_ref.total_cost_cents && (
                      <div className="text-sm">
                        <span className="font-medium">Total Cost:</span> {formatCost(resolutionResult.anchor_ref.total_cost_cents)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Anchor Result */}
      {anchorResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Anchor Batch Created
            </CardTitle>
            <CardDescription>
              Batch ID: {anchorResult.batch_id}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Providers Used:</span>
                <div className="text-muted-foreground">{anchorResult.providers_used.length}</div>
              </div>
              <div>
                <span className="font-medium">Total Anchors:</span>
                <div className="text-muted-foreground">{anchorResult.anchors.length}</div>
              </div>
              <div>
                <span className="font-medium">Total Cost:</span>
                <div className="text-muted-foreground">
                  {formatCost(anchorResult.total_cost_cents || 0)}
                </div>
              </div>
              <div>
                <span className="font-medium">N-of-M Status:</span>
                <div>
                  <Badge variant={acceptNofM(anchorResult, requiredN) ? 'default' : 'destructive'}>
                    {acceptNofM(anchorResult, requiredN) ? 'ACCEPTED' : 'PENDING'}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="text-sm font-medium mb-3">Anchor Records</div>
              <div className="space-y-2">
                {anchorResult.anchors.map((anchor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getProviderStatusIcon(anchor.status)}
                      <div>
                        <div className="font-medium">{providers[anchor.provider_id]?.name || anchor.provider_id}</div>
                        <div className="text-xs text-muted-foreground">
                          Chain: {anchor.chain_id}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xs">
                        {anchor.tx_ref.substring(0, 20)}...
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Block: {anchor.block_height}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                Anchors are being processed. Use the resolver to check confirmation status. 
                Most providers confirm within their expected finality times.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}