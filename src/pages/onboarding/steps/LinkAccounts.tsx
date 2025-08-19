import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Link2, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { useNavigate } from 'react-router-dom';
import { goToPricingForFeature } from '@/lib/upgrade';

interface LinkedAccount {
  id: string;
  institutionName: string;
  accountType: string;
  lastFour: string;
  balance?: number;
}

interface LinkAccountsData {
  linkedAccounts: LinkedAccount[];
  plaidConnected: boolean;
  manuallyAdded: LinkedAccount[];
}

interface LinkAccountsProps {
  onComplete: (data: LinkAccountsData) => void;
  persona: string;
  segment: string;
  initialData?: Partial<LinkAccountsData>;
}

export const LinkAccounts: React.FC<LinkAccountsProps> = ({
  onComplete,
  persona,
  segment,
  initialData
}) => {
  const navigate = useNavigate();
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>(
    initialData?.linkedAccounts || []
  );
  const [isConnecting, setIsConnecting] = useState(false);
  const [showUpgradeAlert, setShowUpgradeAlert] = useState(false);

  // Check if advanced account linking requires premium
  const requiresPremium = segment === 'hnw' || segment === 'uhnw';

  const handlePlaidConnect = async () => {
    if (requiresPremium) {
      analytics.trackEvent('onboarding.upgrade_intent', {
        step: 'link_accounts',
        persona,
        segment,
        feature: 'advanced_account_linking'
      });
      
      goToPricingForFeature(navigate, 'advanced_account_linking', {
        planHint: 'premium',
        source: 'onboarding'
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Simulate Plaid connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAccounts: LinkedAccount[] = [
        {
          id: '1',
          institutionName: 'Chase Bank',
          accountType: 'Checking',
          lastFour: '1234',
          balance: 15000
        },
        {
          id: '2',
          institutionName: 'Vanguard',
          accountType: 'Investment',
          lastFour: '5678',
          balance: 250000
        }
      ];
      
      setLinkedAccounts(mockAccounts);
      
      analytics.trackEvent('onboarding.accounts_linked', {
        step: 'link_accounts',
        persona,
        segment,
        accounts_count: mockAccounts.length,
        method: 'plaid'
      });
      
    } catch (error) {
      console.error('Failed to connect accounts:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleManualAdd = () => {
    if (requiresPremium) {
      setShowUpgradeAlert(true);
      return;
    }
    
    // In real app, this would open a manual entry form
    const manualAccount: LinkedAccount = {
      id: Date.now().toString(),
      institutionName: 'Manual Entry',
      accountType: 'Savings',
      lastFour: '9999',
      balance: 50000
    };
    
    setLinkedAccounts(prev => [...prev, manualAccount]);
    
    analytics.trackEvent('onboarding.accounts_linked', {
      step: 'link_accounts',
      persona,
      segment,
      accounts_count: 1,
      method: 'manual'
    });
  };

  const handleComplete = () => {
    const data: LinkAccountsData = {
      linkedAccounts,
      plaidConnected: linkedAccounts.length > 0,
      manuallyAdded: []
    };

    analytics.trackEvent('onboarding.step_completed', {
      step: 'link_accounts',
      persona,
      segment,
      total_accounts: linkedAccounts.length,
      skipped: linkedAccounts.length === 0
    });

    onComplete(data);
  };

  const handleSkip = () => {
    analytics.trackEvent('onboarding.step_completed', {
      step: 'link_accounts',
      persona,
      segment,
      skipped: true
    });
    
    onComplete({
      linkedAccounts: [],
      plaidConnected: false,
      manuallyAdded: []
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Link2 className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Link Your Accounts</CardTitle>
        <CardDescription>
          Connect your financial accounts to get a complete picture of your wealth
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {requiresPremium && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Advanced account linking for {segment} families requires a Premium plan for enhanced security.
            </AlertDescription>
          </Alert>
        )}

        {showUpgradeAlert && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Manual account entry requires Premium plan. Please use secure bank-level linking or upgrade your plan.
            </AlertDescription>
          </Alert>
        )}

        {/* Linked Accounts Display */}
        {linkedAccounts.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Connected Accounts
            </h3>
            {linkedAccounts.map((account) => (
              <Card key={account.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{account.institutionName}</p>
                    <p className="text-sm text-muted-foreground">
                      {account.accountType} •••• {account.lastFour}
                    </p>
                  </div>
                  {account.balance && (
                    <Badge variant="secondary">
                      ${account.balance.toLocaleString()}
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Connection Options */}
        <div className="space-y-4">
          <h3 className="font-medium">Connection Options</h3>
          
          <Card className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="font-medium">Secure Bank Connection</p>
                <p className="text-sm text-muted-foreground">
                  Connect via bank-level encryption (recommended)
                </p>
              </div>
              <Button 
                onClick={handlePlaidConnect}
                disabled={isConnecting}
                className="min-w-24"
              >
                {isConnecting ? 'Connecting...' : 'Connect'}
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="font-medium">Manual Entry</p>
                <p className="text-sm text-muted-foreground">
                  Add account details manually
                  {requiresPremium && (
                    <Badge variant="outline" className="ml-2">Premium</Badge>
                  )}
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={handleManualAdd}
                disabled={requiresPremium}
              >
                Add Manually
              </Button>
            </div>
          </Card>
        </div>

        {/* Security Note */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your financial data is encrypted and never stored permanently. We use bank-level security protocols.
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button 
            onClick={handleComplete} 
            className="flex-1"
            disabled={isConnecting}
          >
            Continue
          </Button>
          <Button variant="outline" onClick={handleSkip}>
            Skip for Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};