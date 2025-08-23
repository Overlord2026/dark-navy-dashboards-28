import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface PlaidConnectionStepProps {
  onComplete: (data: any) => void;
  isLoading: boolean;
}

interface ConnectedAccount {
  id: string;
  name: string;
  institutionName: string;
  accountType: string;
  mask: string;
  balance: number;
}

export function PlaidConnectionStep({ onComplete, isLoading }: PlaidConnectionStepProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [error, setError] = useState<string | null>(null);

  const simulatePlaidConnection = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Simulate Plaid Link flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful connection
      const mockAccounts: ConnectedAccount[] = [
        {
          id: 'acc_1',
          name: 'Student Checking',
          institutionName: 'Chase Bank',
          accountType: 'checking',
          mask: '2468',
          balance: 1250.50
        },
        {
          id: 'acc_2',
          name: 'Savings Account',
          institutionName: 'Chase Bank',
          accountType: 'savings',
          mask: '1357',
          balance: 5000.00
        }
      ];

      setConnectedAccounts(mockAccounts);
    } catch (err) {
      setError('Failed to connect bank account. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleComplete = () => {
    if (connectedAccounts.length > 0) {
      onComplete({
        accounts: connectedAccounts,
        primaryAccountId: connectedAccounts[0].id
      });
    }
  };

  const handleSkip = () => {
    onComplete({ skipped: true });
  };

  return (
    <div className="space-y-6">
      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <CreditCard className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Secure Payments</h3>
            </div>
            <p className="text-sm text-blue-800">
              Connect your bank account to receive NIL payments directly and securely.
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold text-green-900">Bank-Level Security</h3>
            </div>
            <p className="text-sm text-green-800">
              Your banking information is encrypted and never stored on our servers.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Connection Status */}
      {connectedAccounts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Connect Your Bank Account
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              We use Plaid to securely connect your bank account for NIL payments
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">What you'll need:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Your online banking username and password</li>
                <li>• A checking or savings account for receiving payments</li>
                <li>• 2-3 minutes to complete the connection</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={simulatePlaidConnection}
                disabled={isConnecting}
                className="flex-1"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect Bank Account'
                )}
              </Button>
              
              <Button variant="outline" onClick={handleSkip}>
                Skip for Now
              </Button>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Your data is secure:</strong> We use Plaid's bank-grade security. 
                Your login credentials are encrypted and never stored by us.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Bank Account Connected
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your accounts have been successfully connected
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {connectedAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{account.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {account.institutionName} •••• {account.mask}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${account.balance.toLocaleString()}</div>
                  <Badge variant="outline" className="text-xs">
                    {account.accountType}
                  </Badge>
                </div>
              </div>
            ))}

            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your primary account ({connectedAccounts[0]?.name}) will be used to receive NIL payments.
                You can change this later in your settings.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end">
              <Button onClick={handleComplete} disabled={isLoading} className="min-w-32">
                {isLoading ? 'Saving...' : 'Continue'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}