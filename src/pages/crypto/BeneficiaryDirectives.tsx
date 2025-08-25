import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Download, Users } from 'lucide-react';
import { 
  getDirectives, 
  addDirective, 
  removeDirective,
  type BeneficiaryDirective 
} from '@/features/crypto/estate/directives';
import { listWallets } from '@/features/crypto/store';
import { exportDirectivesToVault } from '@/features/crypto/vault/export';
import type { Wallet } from '@/features/crypto/types';

export default function BeneficiaryDirectives() {
  const [directives, setDirectives] = useState<BeneficiaryDirective[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDirective, setNewDirective] = useState({
    walletId: '',
    asset: '',
    shares: 100,
    toUserId: '',
    unlock: 'TOD' as const,
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // TODO: get actual user ID
      const userId = 'user123';
      const [directivesList, walletsList] = await Promise.all([
        getDirectives(userId),
        listWallets(userId)
      ]);
      setDirectives(directivesList);
      setWallets(walletsList);
    } catch (error) {
      console.error('Failed to load directives:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDirective = async () => {
    try {
      // TODO: get actual user ID
      const userId = 'user123';
      await addDirective(userId, newDirective);
      await loadData();
      setShowAddForm(false);
      setNewDirective({
        walletId: '',
        asset: '',
        shares: 100,
        toUserId: '',
        unlock: 'TOD',
        notes: ''
      });
    } catch (error) {
      console.error('Failed to add directive:', error);
    }
  };

  const handleRemoveDirective = async (walletId: string, toUserId: string) => {
    try {
      // TODO: get actual user ID
      const userId = 'user123';
      await removeDirective(userId, walletId, toUserId);
      await loadData();
    } catch (error) {
      console.error('Failed to remove directive:', error);
    }
  };

  const handleExportToVault = async () => {
    try {
      // TODO: get actual user ID
      const userId = 'user123';
      const result = await exportDirectivesToVault(userId, directives);
      console.log('Exported directives to vault:', result.fileId);
    } catch (error) {
      console.error('Failed to export directives:', error);
    }
  };

  const getWalletLabel = (walletId: string) => {
    const wallet = wallets.find(w => w.walletId === walletId);
    return wallet?.label || walletId;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading beneficiary directives...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Beneficiary Directives</h1>
          <p className="text-muted-foreground">
            Configure crypto asset inheritance and transfer-on-death instructions
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Directive
          </Button>
          {directives.length > 0 && (
            <Button onClick={handleExportToVault} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export to Vault
            </Button>
          )}
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Beneficiary Directive</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wallet">Wallet</Label>
                <Select value={newDirective.walletId} onValueChange={(value) => 
                  setNewDirective(prev => ({ ...prev, walletId: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select wallet" />
                  </SelectTrigger>
                  <SelectContent>
                    {wallets.map(wallet => (
                      <SelectItem key={wallet.walletId} value={wallet.walletId}>
                        {wallet.label} ({wallet.custody})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="asset">Asset (Optional)</Label>
                <Input
                  placeholder="BTC, ETH, or leave blank for all"
                  value={newDirective.asset}
                  onChange={(e) => setNewDirective(prev => ({ ...prev, asset: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="shares">Share Percentage</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={newDirective.shares}
                  onChange={(e) => setNewDirective(prev => ({ ...prev, shares: Number(e.target.value) }))}
                />
              </div>
              
              <div>
                <Label htmlFor="beneficiary">Beneficiary ID</Label>
                <Input
                  placeholder="user456"
                  value={newDirective.toUserId}
                  onChange={(e) => setNewDirective(prev => ({ ...prev, toUserId: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="unlock">Unlock Method</Label>
                <Select value={newDirective.unlock} onValueChange={(value: any) => 
                  setNewDirective(prev => ({ ...prev, unlock: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TOD">Transfer on Death</SelectItem>
                    <SelectItem value="Executor">Executor Control</SelectItem>
                    <SelectItem value="TimeLock">Time Lock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                placeholder="Additional instructions or notes"
                value={newDirective.notes}
                onChange={(e) => setNewDirective(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddDirective} disabled={!newDirective.walletId || !newDirective.toUserId}>
                Add Directive
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Directives List */}
      {directives.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No beneficiary directives</h3>
            <p className="text-muted-foreground mb-4">
              Set up inheritance instructions for your crypto assets
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              Add Your First Directive
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Current Directives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {directives.map((directive, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{getWalletLabel(directive.walletId)}</span>
                      {directive.asset && (
                        <Badge variant="outline">{directive.asset}</Badge>
                      )}
                      <Badge variant="secondary">{directive.shares}%</Badge>
                      <Badge variant={
                        directive.unlock === 'TOD' ? 'default' : 
                        directive.unlock === 'Executor' ? 'destructive' : 'secondary'
                      }>
                        {directive.unlock}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      To: {directive.toUserId}
                      {directive.notes && (
                        <span className="block mt-1">{directive.notes}</span>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveDirective(directive.walletId, directive.toUserId)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}