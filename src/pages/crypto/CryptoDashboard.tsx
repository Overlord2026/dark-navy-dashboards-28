import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet as WalletIcon, 
  Plus, 
  TrendingUp, 
  Download, 
  Calculator,
  Users,
  Eye,
  ExternalLink
} from 'lucide-react';
import { listWallets, getPositions } from '@/features/crypto/store';
import { exportStatementsToVault } from '@/features/crypto/vault/export';
import { recomputeLots } from '@/features/crypto/tax/lots';
import type { Wallet, Position } from '@/features/crypto/types';
import { useNavigate } from 'react-router-dom';

export default function CryptoDashboard() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [positions, setPositions] = useState<Record<string, Position[]>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // TODO: get actual user ID
      const userWallets = await listWallets('user123');
      setWallets(userWallets);
      
      // Load positions for each wallet
      const posData: Record<string, Position[]> = {};
      for (const wallet of userWallets) {
        posData[wallet.walletId] = await getPositions(wallet.walletId);
      }
      setPositions(posData);
    } catch (error) {
      console.error('Failed to load crypto data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportStatements = async (walletId: string) => {
    try {
      const result = await exportStatementsToVault(walletId);
      console.log('Exported statements:', result.fileId);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleRecomputeLots = async (walletId: string) => {
    try {
      const result = await recomputeLots(walletId);
      console.log('Recomputed lots:', result.lots.length);
    } catch (error) {
      console.error('Recompute failed:', error);
    }
  };

  const getTotalValue = (walletPositions: Position[]) => {
    return walletPositions.reduce((sum, pos) => sum + pos.usdValue, 0);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading crypto dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Crypto Dashboard</h1>
          <p className="text-muted-foreground">Manage your digital assets with enterprise-grade security</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/crypto/add-exchange')} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Exchange
          </Button>
          <Button onClick={() => navigate('/crypto/add-wallet')} variant="outline" className="gap-2">
            <Eye className="w-4 h-4" />
            Watch-Only Wallet
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wallets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${wallets.reduce((sum, w) => sum + getTotalValue(positions[w.walletId] || []), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Custodial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {wallets.filter(w => w.custody === 'custodial').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Watch-Only</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {wallets.filter(w => w.custody === 'watch').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallets List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Wallets</h2>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate('/crypto/beneficiaries')} 
              variant="outline" 
              className="gap-2"
            >
              <Users className="w-4 h-4" />
              Beneficiary Directives
            </Button>
          </div>
        </div>

        {wallets.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <WalletIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No wallets connected</h3>
              <p className="text-muted-foreground mb-4">
                Connect your exchange accounts or add watch-only wallets to get started
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => navigate('/crypto/add-exchange')}>
                  Add Exchange Account
                </Button>
                <Button variant="outline" onClick={() => navigate('/crypto/add-wallet')}>
                  Add Watch-Only Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {wallets.map(wallet => {
              const walletPositions = positions[wallet.walletId] || [];
              const totalValue = getTotalValue(walletPositions);
              
              return (
                <Card key={wallet.walletId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <WalletIcon className="w-5 h-5" />
                        <div>
                          <CardTitle className="text-lg">{wallet.label}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={wallet.custody === 'custodial' ? 'default' : 'secondary'}>
                              {wallet.custody === 'custodial' ? 'Custodial' : 'Watch-Only'}
                            </Badge>
                            {wallet.exchange && (
                              <Badge variant="outline">{wallet.exchange.name}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {walletPositions.length} assets
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Positions */}
                    {walletPositions.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <h4 className="font-medium">Positions</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {walletPositions.map((pos, i) => (
                            <div key={i} className="p-2 bg-muted rounded text-center">
                              <div className="font-medium">{pos.asset}</div>
                              <div className="text-sm text-muted-foreground">
                                {pos.amount.toFixed(6)}
                              </div>
                              <div className="text-sm font-medium">
                                ${pos.usdValue.toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleExportStatements(wallet.walletId)}
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Export to Vault
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRecomputeLots(wallet.walletId)}
                        className="gap-2"
                      >
                        <Calculator className="w-4 h-4" />
                        Recompute Lots
                      </Button>
                      {wallet.custody === 'custodial' && wallet.exchange?.scopes === 'trade' && (
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/crypto/trade/${wallet.walletId}`)}
                          className="gap-2"
                        >
                          <TrendingUp className="w-4 h-4" />
                          Trade
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => navigate(`/crypto/wallet/${wallet.walletId}`)}
                        className="gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}