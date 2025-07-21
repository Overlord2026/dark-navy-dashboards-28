import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Link as LinkIcon, 
  Plus, 
  Settings, 
  Shield, 
  Trash2,
  Building2,
  CreditCard,
  FileText,
  Activity,
  Key,
  RefreshCw as Refresh,
  TrendingUp
} from "lucide-react";

export function IntegrationsAccountsSection() {
  const connectedAccounts = [
    {
      id: '1',
      provider: 'Chase Bank',
      type: 'Banking',
      accounts: ['Checking (...4567)', 'Savings (...8901)'],
      lastSync: '2 hours ago',
      status: 'connected',
      icon: Building2
    },
    {
      id: '2', 
      provider: 'Fidelity',
      type: 'Investment',
      accounts: ['401(k) (...2345)', 'Roth IRA (...6789)'],
      lastSync: '1 day ago',
      status: 'connected',
      icon: TrendingUp
    },
    {
      id: '3',
      provider: 'Stripe',
      type: 'Payment Processing',
      accounts: ['Business Account'],
      lastSync: '5 minutes ago',
      status: 'connected',
      icon: CreditCard
    },
    {
      id: '4',
      provider: 'QuickBooks',
      type: 'Accounting',
      accounts: ['Main Company'],
      lastSync: 'Failed',
      status: 'error',
      icon: FileText
    }
  ];

  const availableIntegrations = [
    {
      name: 'Schwab',
      type: 'Investment',
      description: 'Connect your Schwab investment accounts',
      icon: Building2
    },
    {
      name: 'Vanguard',
      type: 'Investment', 
      description: 'Sync Vanguard portfolio data',
      icon: TrendingUp
    },
    {
      name: 'Bank of America',
      type: 'Banking',
      description: 'Link checking and savings accounts',
      icon: Building2
    },
    {
      name: 'DocuSign',
      type: 'Documents',
      description: 'Electronic signature integration',
      icon: FileText
    }
  ];

  const apiKeys = [
    {
      id: '1',
      name: 'Portfolio Analytics API',
      description: 'Read-only access to portfolio data',
      lastUsed: '2024-01-20',
      permissions: ['Read Portfolio', 'Read Goals']
    },
    {
      id: '2',
      name: 'Mobile App Integration',
      description: 'Full access for mobile application',
      lastUsed: '2024-01-21',
      permissions: ['Read All', 'Write Goals', 'Upload Documents']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Connected Accounts
              </CardTitle>
              <CardDescription>
                Manage your linked financial and business accounts
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connectedAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <account.icon className="h-8 w-8 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{account.provider}</span>
                      <Badge variant="outline">{account.type}</Badge>
                      <Badge variant={account.status === 'connected' ? 'default' : account.status === 'error' ? 'destructive' : 'secondary'}>
                        {account.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>{account.accounts.join(', ')}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Activity className="h-3 w-3" />
                        Last sync: {account.lastSync}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Refresh className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Available Integrations</CardTitle>
          <CardDescription>
            Connect additional accounts and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableIntegrations.map((integration) => (
              <div key={integration.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <integration.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{integration.name}</span>
                  </div>
                  <Badge variant="outline">{integration.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {integration.description}
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Sharing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Sharing Settings
          </CardTitle>
          <CardDescription>
            Control how your data is shared with connected services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Share with advisor only</Label>
                <p className="text-sm text-muted-foreground">
                  Limit data access to your assigned financial advisor
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Include family accounts</Label>
                <p className="text-sm text-muted-foreground">
                  Share data from family member accounts
                </p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Historical data</Label>
                <p className="text-sm text-muted-foreground">
                  Include transaction history beyond 12 months
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Anonymous analytics</Label>
                <p className="text-sm text-muted-foreground">
                  Help improve our services with anonymized usage data
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Access */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Access
              </CardTitle>
              <CardDescription>
                Manage API keys and third-party integrations
              </CardDescription>
            </div>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Generate API Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium">{apiKey.name}</span>
                    <p className="text-sm text-muted-foreground">{apiKey.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View</Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <div>Last used: {apiKey.lastUsed}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {apiKey.permissions.map((permission, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-amber-600" />
              <Label className="font-medium">Security Notice</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              API keys provide programmatic access to your data. Only share them with trusted applications and revoke unused keys regularly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}