import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, CreditCard, Building, DollarSign, SkipForward, Shield, Link } from 'lucide-react';
import { OnboardingStepData } from '@/types/onboarding';

interface AssetLinkingStepProps {
  data: OnboardingStepData;
  onComplete: (stepData: Partial<OnboardingStepData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLoading?: boolean;
}

interface ManualAsset {
  id: string;
  name: string;
  type: string;
  value: number;
  institution?: string;
}

export const AssetLinkingStep: React.FC<AssetLinkingStepProps> = ({
  data,
  onComplete,
  onNext,
  onPrevious,
  isLoading
}) => {
  const [linkingMethod, setLinkingMethod] = useState<'plaid' | 'manual' | null>(null);
  const [manualAssets, setManualAssets] = useState<ManualAsset[]>(
    data.assetLinking?.manualAssets || []
  );
  const [plaidConnected, setPlaidConnected] = useState(false);

  const addManualAsset = () => {
    const newAsset: ManualAsset = {
      id: Date.now().toString(),
      name: '',
      type: 'checking',
      value: 0,
      institution: ''
    };
    setManualAssets([...manualAssets, newAsset]);
  };

  const updateManualAsset = (id: string, field: keyof ManualAsset, value: string | number) => {
    setManualAssets(manualAssets.map(asset => 
      asset.id === id ? { ...asset, [field]: value } : asset
    ));
  };

  const removeManualAsset = (id: string) => {
    setManualAssets(manualAssets.filter(asset => asset.id !== id));
  };

  const handlePlaidConnect = () => {
    // This would integrate with actual Plaid
    console.log('Connecting to Plaid...');
    setPlaidConnected(true);
  };

  const handleContinue = () => {
    const assetData = {
      assetLinking: {
        method: linkingMethod,
        manualAssets: linkingMethod === 'manual' ? manualAssets : [],
        plaidConnected: linkingMethod === 'plaid' ? plaidConnected : false
      }
    };
    onComplete(assetData);
  };

  const handleSkip = () => {
    const assetData = {
      assetLinking: {
        method: null,
        manualAssets: [],
        plaidConnected: false,
        skipped: true
      }
    };
    onComplete(assetData);
  };

  const ASSET_TYPES = [
    { value: 'checking', label: 'Checking Account' },
    { value: 'savings', label: 'Savings Account' },
    { value: 'investment', label: 'Investment Account' },
    { value: 'retirement', label: '401(k)/IRA' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'business', label: 'Business' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Connect Your Assets
        </h2>
        <p className="text-muted-foreground">
          Link your financial accounts or add them manually to get personalized insights.
        </p>
      </div>

      {!linkingMethod ? (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Plaid Option */}
          <Card 
            className="premium-card cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => setLinkingMethod('plaid')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Link className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Connect with Plaid</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground text-sm">
                Securely connect your bank accounts in seconds with our trusted partner.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Bank-level encryption</span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <img src="/api/placeholder/40/20" alt="Chase" className="h-5 opacity-60" />
                <img src="/api/placeholder/40/20" alt="Bank of America" className="h-5 opacity-60" />
                <img src="/api/placeholder/40/20" alt="Wells Fargo" className="h-5 opacity-60" />
              </div>
              <Badge variant="secondary" className="text-xs">
                Read-only access
              </Badge>
            </CardContent>
          </Card>

          {/* Manual Option */}
          <Card 
            className="premium-card cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => setLinkingMethod('manual')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Add Manually</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground text-sm">
                Enter your account details manually for complete control over your data.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <CreditCard className="h-3 w-3" />
                <span>No account linking required</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Add checking, savings, investments, real estate, and more.
              </p>
              <Badge variant="outline" className="text-xs">
                Full privacy
              </Badge>
            </CardContent>
          </Card>
        </div>
      ) : linkingMethod === 'plaid' ? (
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Connect with Plaid
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!plaidConnected ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Secure Account Connection</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Plaid uses bank-level encryption to securely connect your accounts. 
                    We only access account balances and transaction history - never your login credentials.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Read-only access to your accounts</li>
                    <li>• 256-bit encryption protection</li>
                    <li>• Trusted by millions of users</li>
                  </ul>
                </div>
                <Button onClick={handlePlaidConnect} className="btn-primary-gold">
                  Connect My Accounts
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setLinkingMethod(null)}
                  className="text-sm"
                >
                  Choose Different Method
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-600 mb-2">Successfully Connected!</h3>
                  <p className="text-muted-foreground text-sm">
                    Your accounts have been securely linked. We'll analyze your financial data 
                    to provide personalized insights.
                  </p>
                </div>
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  3 accounts connected
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="premium-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Manual Asset Entry
            </CardTitle>
            <Button onClick={addManualAsset} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {manualAssets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No assets added yet.</p>
                <p className="text-sm">Click "Add Asset" to include your accounts and investments.</p>
              </div>
            ) : (
              manualAssets.map((asset) => (
                <Card key={asset.id} className="relative">
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <h4 className="font-semibold">Asset</h4>
                    <Button
                      onClick={() => removeManualAsset(asset.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Asset Name</Label>
                        <Input
                          value={asset.name}
                          onChange={(e) => updateManualAsset(asset.id, 'name', e.target.value)}
                          placeholder="e.g., Chase Checking"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Institution</Label>
                        <Input
                          value={asset.institution || ''}
                          onChange={(e) => updateManualAsset(asset.id, 'institution', e.target.value)}
                          placeholder="e.g., Chase Bank"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Asset Type</Label>
                        <Select
                          value={asset.type}
                          onValueChange={(value) => updateManualAsset(asset.id, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ASSET_TYPES.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Current Value</Label>
                        <Input
                          type="number"
                          value={asset.value}
                          onChange={(e) => updateManualAsset(asset.id, 'value', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            
            <div className="flex justify-center">
              <Button 
                variant="ghost" 
                onClick={() => setLinkingMethod(null)}
                className="text-sm"
              >
                Choose Different Method
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skip Option */}
      <Card className="premium-card border-dashed">
        <CardContent className="text-center py-6">
          <SkipForward className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-semibold mb-2">Skip for Now</h3>
          <p className="text-muted-foreground text-sm mb-4">
            You can always connect your accounts later from your dashboard to get the full experience.
          </p>
          <Button variant="outline" onClick={handleSkip}>
            Skip Asset Linking
          </Button>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        {linkingMethod && (
          <Button 
            onClick={handleContinue}
            className="btn-primary-gold"
            disabled={linkingMethod === 'plaid' && !plaidConnected}
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
};