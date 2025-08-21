import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Landmark, CreditCard, Shield, Lock, AlertCircle } from 'lucide-react';

interface AccountConnectionProps {
  onConnect: (accountData: any) => void;
  onSkip: () => void;
  isLoading?: boolean;
  hasFeature: boolean;
  onFeatureGating: () => void;
}

export function AccountConnection({ onConnect, onSkip, isLoading, hasFeature, onFeatureGating }: AccountConnectionProps) {
  const [connecting, setConnecting] = useState<string | null>(null);

  const institutions = [
    { id: 'chase', name: 'Chase', icon: Building2, popular: true },
    { id: 'bofa', name: 'Bank of America', icon: Landmark, popular: true },
    { id: 'wells_fargo', name: 'Wells Fargo', icon: Building2, popular: true },
    { id: 'citi', name: 'Citibank', icon: CreditCard, popular: false },
  ];

  const handleConnect = async (institutionId: string) => {
    if (!hasFeature) {
      onFeatureGating();
      return;
    }

    setConnecting(institutionId);
    
    // Simulate connection process
    setTimeout(() => {
      onConnect({
        institution: institutions.find(i => i.id === institutionId)?.name,
        account_type: 'checking',
        last_four: '4567',
        connected_at: new Date().toISOString()
      });
      setConnecting(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Connect Your Bank Account</h2>
        <p className="text-muted-foreground">
          Link your accounts to get personalized insights and tracking
        </p>
      </div>

      {/* Security Notice */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-green-800 mb-1">Bank-level security</p>
              <p className="text-green-700">
                Your data is encrypted and we use read-only access. We never store your login credentials.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Institution Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Choose your bank</Label>
        <div className="grid grid-cols-2 gap-3">
          {institutions.map((institution) => {
            const Icon = institution.icon;
            const isConnecting = connecting === institution.id;
            
            return (
              <Card 
                key={institution.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-sm relative ${
                  isConnecting ? 'ring-2 ring-primary bg-primary/5' : 'hover:border-primary/50'
                } ${!hasFeature ? 'opacity-75' : ''}`}
                onClick={() => !isLoading && handleConnect(institution.id)}
              >
                {!hasFeature && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                  >
                    <Lock className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
                
                {institution.popular && hasFeature && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 text-xs bg-blue-100 text-blue-800"
                  >
                    Popular
                  </Badge>
                )}
                
                <CardContent className="p-4 text-center">
                  <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium text-sm">{institution.name}</h3>
                  {isConnecting && (
                    <p className="text-xs text-muted-foreground mt-1">Connecting...</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Search for other banks */}
      <Card>
        <CardContent className="p-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => hasFeature ? handleConnect('other') : onFeatureGating()}
            disabled={isLoading}
          >
            {!hasFeature && <Lock className="h-4 w-4 mr-2" />}
            Search for other banks (2,000+ supported)
          </Button>
        </CardContent>
      </Card>

      {/* Manual Entry Alternative */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-orange-800 mb-1">Prefer manual tracking?</p>
              <p className="text-orange-700 mb-3">
                You can always add accounts manually or connect them later.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onSkip}
                className="border-orange-300 text-orange-800 hover:bg-orange-100"
              >
                Continue without connecting
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Policy Link */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          By connecting an account, you agree to our{' '}
          <a href="/privacy" className="underline hover:text-primary">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="/terms" className="underline hover:text-primary">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}