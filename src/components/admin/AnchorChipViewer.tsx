import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CircuitBoard, Anchor, RotateCcw, Shield, Copy, Download } from 'lucide-react';
import { kSeriesProof, createProof, verifyProof } from '@/services/kSeriesProof';
import { useToast } from '@/hooks/use-toast';

interface AnchorChipViewerProps {
  className?: string;
}

export function AnchorChipViewer({ className }: AnchorChipViewerProps) {
  const [verifiers, setVerifiers] = useState<any[]>([]);
  const [anchors, setAnchors] = useState<any[]>([]);
  const [replays, setReplays] = useState<any[]>([]);
  const [selectedChip, setSelectedChip] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setVerifiers(kSeriesProof.getLocalVerifiers());
    setAnchors(kSeriesProof.getAnchors());
    setReplays(kSeriesProof.getReplayLog());
  };

  const createDemoProof = () => {
    try {
      const demoData = {
        user: 'demo-user',
        action: 'test-transaction',
        amount: 1000,
        timestamp: new Date().toISOString()
      };
      
      const proofString = createProof(demoData, 'demo-transaction');
      refreshData();
      
      toast({
        title: "Demo Proof Created",
        description: "K_5, K_7, and K_8 chips generated successfully"
      });
      
      console.log('Demo proof created:', proofString);
    } catch (error) {
      toast({
        title: "Proof Creation Failed",
        description: String(error),
        variant: "destructive"
      });
    }
  };

  const copyChipData = (chip: any) => {
    navigator.clipboard.writeText(JSON.stringify(chip, null, 2));
    toast({
      title: "Copied",
      description: "Chip data copied to clipboard"
    });
  };

  const exportProofChain = (verifierId: string) => {
    try {
      const chain = kSeriesProof.buildProofChain(verifierId);
      const exported = kSeriesProof.exportProofChain(chain.chainId);
      
      const blob = new Blob([exported], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `proof-chain-${chain.chainId}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Proof Chain Exported",
        description: `Chain ${chain.chainId} downloaded`
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: String(error),
        variant: "destructive"
      });
    }
  };

  const getChipIcon = (type: string) => {
    switch (type) {
      case 'K_5': return <Shield className="w-4 h-4" />;
      case 'K_7': return <Anchor className="w-4 h-4" />;
      case 'K_8': return <RotateCcw className="w-4 h-4" />;
      default: return <CircuitBoard className="w-4 h-4" />;
    }
  };

  const getChipColor = (type: string) => {
    switch (type) {
      case 'K_5': return 'bg-blue-500';
      case 'K_7': return 'bg-green-500';
      case 'K_8': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">K-Series Anchor-Chip Viewer</h2>
        <div className="flex gap-2">
          <Button onClick={createDemoProof} className="gap-2">
            <CircuitBoard className="w-4 h-4" />
            Create Demo Proof
          </Button>
          <Button onClick={refreshData} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* K_5 Local Verifiers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              K_5 Local Verifiers
              <Badge variant="secondary">{verifiers.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {verifiers.map((verifier) => (
              <div
                key={verifier.id}
                className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                onClick={() => setSelectedChip(verifier)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getChipColor('K_5')}`} />
                    <span className="font-mono text-sm">{verifier.id.slice(0, 12)}...</span>
                  </div>
                  <Badge variant={verifier.verified ? "default" : "destructive"}>
                    {verifier.verified ? 'Verified' : 'Failed'}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(verifier.timestamp).toLocaleTimeString()}
                </div>
                <div className="flex gap-1 mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyChipData(verifier);
                    }}
                    className="h-6 px-2"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  {verifier.verified && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        exportProofChain(verifier.id);
                      }}
                      className="h-6 px-2"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* K_7 Anchors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Anchor className="w-5 h-5 text-green-500" />
              K_7 Anchors
              <Badge variant="secondary">{anchors.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {anchors.map((anchor) => (
              <div
                key={anchor.id}
                className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                onClick={() => setSelectedChip(anchor)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getChipColor('K_7')}`} />
                    <span className="font-mono text-sm">{anchor.id.slice(0, 12)}...</span>
                  </div>
                  <Badge variant="outline">Anchored</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Verifier: {anchor.payload.verifierId.slice(0, 8)}...
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(anchor.timestamp).toLocaleTimeString()}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyChipData(anchor);
                  }}
                  className="h-6 px-2 mt-2"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* K_8 Replay Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-orange-500" />
              K_8 Replay Log
              <Badge variant="secondary">{replays.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {replays.map((replay) => (
              <div
                key={replay.id}
                className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                onClick={() => setSelectedChip(replay)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getChipColor('K_8')}`} />
                    <span className="font-mono text-sm">#{replay.payload.sequence}</span>
                  </div>
                  <Badge variant="outline">{replay.payload.action}</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Anchor: {replay.payload.anchorId.slice(0, 8)}...
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(replay.timestamp).toLocaleTimeString()}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyChipData(replay);
                  }}
                  className="h-6 px-2 mt-2"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Selected Chip Detail */}
      {selectedChip && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getChipIcon(selectedChip.type)}
              {selectedChip.type} Chip Details
              <Badge>{selectedChip.id}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-64">
              {JSON.stringify(selectedChip, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>K-Series Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <div>
                <div className="font-medium">K_5 Local Verifier</div>
                <div className="text-sm text-muted-foreground">Validates and stores proof locally</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Anchor className="w-4 h-4 text-green-500" />
              <div>
                <div className="font-medium">K_7 Anchors</div>
                <div className="text-sm text-muted-foreground">Creates immutable anchor points</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-orange-500" />
              <div>
                <div className="font-medium">K_8 Replay</div>
                <div className="text-sm text-muted-foreground">Records and enables replay of events</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}