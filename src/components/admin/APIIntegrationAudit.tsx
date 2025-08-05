import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  Shield,
  CreditCard,
  Building2,
  TrendingUp,
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Users,
  DollarSign,
  Bot
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface APIIntegration {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  secrets: {
    name: string;
    displayName: string;
    required: boolean;
  }[];
  status: 'configured' | 'not_configured' | 'partially_configured';
  description: string;
  usedIn: string[];
  lastChecked?: Date;
  testStatus?: 'passed' | 'failed' | 'not_tested';
  actionSteps?: string[];
}

const INTEGRATIONS: APIIntegration[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'Payments',
    icon: <CreditCard className="h-4 w-4" />,
    secrets: [
      { name: 'STRIPE_SECRET_KEY', displayName: 'Secret Key', required: true },
      { name: 'STRIPE_PUBLISHABLE_KEY', displayName: 'Publishable Key', required: true }
    ],
    status: 'not_configured',
    description: 'Payment processing and billing',
    usedIn: ['Subscription management', 'Customer portal', 'Billing']
  },
  {
    id: 'plaid',
    name: 'Plaid',
    category: 'Financial Data',
    icon: <Building2 className="h-4 w-4" />,
    secrets: [
      { name: 'PLAID_CLIENT_ID', displayName: 'Client ID', required: true },
      { name: 'PLAID_SECRET', displayName: 'Secret', required: true }
    ],
    status: 'not_configured',
    description: 'Bank account aggregation and verification',
    usedIn: ['Account linking', 'Transaction import', 'Balance verification']
  },
  {
    id: 'finnhub',
    name: 'Finnhub',
    category: 'Market Data',
    icon: <TrendingUp className="h-4 w-4" />,
    secrets: [
      { name: 'FINNHUB_API_KEY', displayName: 'API Key', required: true },
      { name: 'FINNHUB_WEBHOOK_SECRET', displayName: 'Webhook Secret', required: false }
    ],
    status: 'not_configured',
    description: 'Real-time market data and financial information',
    usedIn: ['Portfolio tracking', 'Market analysis', 'Price updates']
  },
  {
    id: 'openai',
    name: 'OpenAI',
    category: 'AI/Chat',
    icon: <Bot className="h-4 w-4" />,
    secrets: [
      { name: 'OPENAI_API_KEY', displayName: 'API Key', required: true }
    ],
    status: 'not_configured',
    description: 'AI-powered chat and content generation',
    usedIn: ['AI assistant', 'Content generation', 'Document analysis']
  },
  {
    id: 'twilio',
    name: 'Twilio',
    category: 'Communications',
    icon: <Phone className="h-4 w-4" />,
    secrets: [
      { name: 'TWILIO_ACCOUNT_SID', displayName: 'Account SID', required: true },
      { name: 'TWILIO_AUTH_TOKEN', displayName: 'Auth Token', required: true },
      { name: 'TWILIO_MESSAGING_SID', displayName: 'Messaging SID', required: false }
    ],
    status: 'not_configured',
    description: 'SMS messaging and voice communications',
    usedIn: ['SMS notifications', 'Two-factor authentication', 'Voice calls']
  },
  {
    id: 'resend',
    name: 'Resend',
    category: 'Email',
    icon: <Mail className="h-4 w-4" />,
    secrets: [
      { name: 'RESEND_API_KEY', displayName: 'API Key', required: true }
    ],
    status: 'not_configured',
    description: 'Transactional email delivery',
    usedIn: ['Welcome emails', 'Notifications', 'Password resets']
  },
  {
    id: 'google',
    name: 'Google',
    category: 'Authentication & Meetings',
    icon: <Users className="h-4 w-4" />,
    secrets: [
      { name: 'GOOGLE_CLIENT_ID', displayName: 'Client ID', required: true },
      { name: 'GOOGLE_CLIENT_SECRET', displayName: 'Client Secret', required: true }
    ],
    status: 'not_configured',
    description: 'Google OAuth and Google Meet integration',
    usedIn: ['Social login', 'Google Meet', 'Calendar integration']
  },
  {
    id: 'zoom',
    name: 'Zoom',
    category: 'Video Conferencing',
    icon: <MessageSquare className="h-4 w-4" />,
    secrets: [
      { name: 'ZOOM_CLIENT_ID', displayName: 'Client ID', required: false },
      { name: 'ZOOM_CLIENT_SECRET', displayName: 'Client Secret', required: false }
    ],
    status: 'not_configured',
    description: 'Video conferencing integration',
    usedIn: ['Video meetings', 'Meeting scheduling']
  },
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'Lead Generation',
    icon: <Users className="h-4 w-4" />,
    secrets: [
      { name: 'FACEBOOK_APP_ID', displayName: 'App ID', required: false },
      { name: 'FACEBOOK_APP_SECRET', displayName: 'App Secret', required: false }
    ],
    status: 'not_configured',
    description: 'Facebook lead ads and social login',
    usedIn: ['Lead capture', 'Social authentication']
  },
  {
    id: 'calendly',
    name: 'Calendly',
    category: 'Scheduling',
    icon: <Calendar className="h-4 w-4" />,
    secrets: [
      { name: 'CALENDLY_API_KEY', displayName: 'API Key', required: false }
    ],
    status: 'not_configured',
    description: 'Meeting scheduling integration',
    usedIn: ['Appointment booking', 'Calendar sync']
  },
  {
    id: 'alts',
    name: 'Alternative Investments',
    category: 'Investments',
    icon: <DollarSign className="h-4 w-4" />,
    secrets: [
      { name: 'ALTS_API_KEY', displayName: 'API Key', required: true }
    ],
    status: 'not_configured',
    description: 'CAIS, iCapital, Yieldstreet alternative investments',
    usedIn: ['Alternative investments', 'Portfolio diversification']
  }
];

export function APIIntegrationAudit() {
  const [integrations, setIntegrations] = useState<APIIntegration[]>(INTEGRATIONS);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkIntegrationStatus = async () => {
    setIsChecking(true);
    console.log('🔍 [API Integration Audit] Starting comprehensive API key audit...');
    
    const updatedIntegrations = await Promise.all(
      integrations.map(async (integration) => {
        const checkedSecrets = await Promise.all(
          integration.secrets.map(async (secret) => {
            try {
              const { data, error } = await supabase.functions.invoke('check-api-keys', {
                body: { secretName: secret.name }
              });
              
              const exists = !error && data?.exists;
              console.log(`${exists ? '✅' : '❌'} [API Audit] ${secret.name}: ${exists ? 'Found' : 'Missing'}`);
              
              return { ...secret, exists };
            } catch (err) {
              console.error(`💥 [API Audit] Error checking ${secret.name}:`, err);
              return { ...secret, exists: false };
            }
          })
        );

        // Determine overall status
        const requiredSecrets = checkedSecrets.filter(s => s.required);
        const configuredRequired = requiredSecrets.filter(s => s.exists);
        const optionalSecrets = checkedSecrets.filter(s => !s.required);
        const configuredOptional = optionalSecrets.filter(s => s.exists);

        let status: APIIntegration['status'];
        if (configuredRequired.length === requiredSecrets.length) {
          status = 'configured';
        } else if (configuredRequired.length > 0 || configuredOptional.length > 0) {
          status = 'partially_configured';
        } else {
          status = 'not_configured';
        }

        return {
          ...integration,
          status,
          lastChecked: new Date(),
          testStatus: (status === 'configured' ? 'passed' : 'not_tested') as 'passed' | 'failed' | 'not_tested',
          actionSteps: status !== 'configured' ? [
            `Add missing API keys in Supabase Dashboard → Settings → Secrets`,
            ...checkedSecrets.filter(s => !s.exists && s.required).map(s => `Add ${s.displayName} (${s.name})`)
          ] : []
        };
      })
    );

    setIntegrations(updatedIntegrations);
    setLastChecked(new Date());
    setIsChecking(false);
    
    const configured = updatedIntegrations.filter(i => i.status === 'configured').length;
    const total = updatedIntegrations.length;
    console.log(`✅ [API Integration Audit] Complete: ${configured}/${total} integrations fully configured`);
  };

  useEffect(() => {
    checkIntegrationStatus();
    
    // Check every 5 minutes
    const interval = setInterval(checkIntegrationStatus, 300000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: APIIntegration['status']) => {
    switch (status) {
      case 'configured':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Configured</Badge>;
      case 'partially_configured':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Partial</Badge>;
      case 'not_configured':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Missing</Badge>;
    }
  };

  const getCategoryStats = () => {
    const categories = [...new Set(integrations.map(i => i.category))];
    return categories.map(category => {
      const categoryIntegrations = integrations.filter(i => i.category === category);
      const configured = categoryIntegrations.filter(i => i.status === 'configured').length;
      return { category, configured, total: categoryIntegrations.length };
    });
  };

  const overallStats = {
    total: integrations.length,
    configured: integrations.filter(i => i.status === 'configured').length,
    partial: integrations.filter(i => i.status === 'partially_configured').length,
    missing: integrations.filter(i => i.status === 'not_configured').length
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                API Integration Audit
              </CardTitle>
              <CardDescription>
                Complete status of all API integrations and secret keys
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={checkIntegrationStatus}
              disabled={isChecking}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'Checking...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Overall Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">{overallStats.configured}</div>
              <div className="text-sm text-muted-foreground">Configured</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{overallStats.partial}</div>
              <div className="text-sm text-muted-foreground">Partial</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-red-600">{overallStats.missing}</div>
              <div className="text-sm text-muted-foreground">Missing</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{overallStats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Category Breakdown</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {getCategoryStats().map(({ category, configured, total }) => (
                <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">{category}</span>
                  <Badge variant="outline">{configured}/{total}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Integration Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Integration Details</h4>
              {lastChecked && (
                <span className="text-xs text-muted-foreground">
                  Last checked: {lastChecked.toLocaleTimeString()}
                </span>
              )}
            </div>
            
            <div className="space-y-3">
              {integrations.map((integration) => (
                <Card key={integration.id} className="border-l-4 border-l-muted">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-muted rounded-lg">
                          {integration.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium">{integration.name}</h5>
                            {getStatusBadge(integration.status)}
                            <Badge variant="outline" className="text-xs">
                              {integration.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {integration.description}
                          </p>
                          <div className="text-xs text-muted-foreground">
                            <strong>Used in:</strong> {integration.usedIn.join(', ')}
                          </div>
                          
                          {/* Secret Status */}
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-2">
                              {integration.secrets.map((secret) => (
                                <Badge
                                  key={secret.name}
                                  variant={secret.required ? "default" : "secondary"}
                                  className={`text-xs ${
                                    integration.status === 'configured' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {secret.displayName}
                                  {secret.required && ' *'}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Action Steps */}
                          {integration.actionSteps && integration.actionSteps.length > 0 && (
                            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="text-sm font-medium text-yellow-800 mb-1">Action Required:</div>
                              <ul className="text-xs text-yellow-700 list-disc list-inside">
                                {integration.actionSteps.map((step, index) => (
                                  <li key={index}>{step}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {integration.status !== 'configured' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open('https://supabase.com/dashboard/project/xcmqjkvyvuhoslbzmlgi/settings/functions', '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Add Keys
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Quick Setup Guide</span>
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              <p>1. Go to <strong>Supabase Dashboard → Project → Settings → Secrets</strong></p>
              <p>2. Click <strong>"Add New Secret"</strong> for each missing key</p>
              <p>3. Use the exact secret names shown above</p>
              <p>4. Test integrations after adding keys</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 text-blue-700 border-blue-300"
              onClick={() => window.open('https://supabase.com/dashboard/project/xcmqjkvyvuhoslbzmlgi/settings/functions', '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Open Supabase Secrets
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}