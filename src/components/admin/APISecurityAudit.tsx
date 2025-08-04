import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, XCircle, ExternalLink, Key, Shield, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SecretConfig {
  name: string;
  status: 'set' | 'not_set' | 'checking';
  feature: string;
  criticality: 'critical' | 'high' | 'medium' | 'optional';
  description: string;
  instructions: string;
  documentationUrl?: string;
}

export default function APISecurityAudit() {
  const [secrets, setSecrets] = useState<SecretConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    total: 0,
    set: 0,
    missing: 0,
    critical_missing: 0
  });

  const secretConfigs: Omit<SecretConfig, 'status'>[] = [
    // Payment & Financial
    {
      name: 'STRIPE_SECRET_KEY',
      feature: 'Stripe Payment Processing',
      criticality: 'critical',
      description: 'Required for subscription billing, customer portal, checkout sessions',
      instructions: 'Add your Stripe Secret Key from Stripe Dashboard > Developers > API Keys',
      documentationUrl: 'https://dashboard.stripe.com/apikeys'
    },
    {
      name: 'STRIPE_PUBLISHABLE_KEY', 
      feature: 'Stripe Frontend Integration',
      criticality: 'critical',
      description: 'Required for frontend payment forms and checkout',
      instructions: 'Add your Stripe Publishable Key (starts with pk_)',
      documentationUrl: 'https://dashboard.stripe.com/apikeys'
    },
    {
      name: 'PLAID_CLIENT_ID',
      feature: 'Plaid Bank Account Integration',
      criticality: 'high',
      description: 'Required for bank account connections and ACH transfers',
      instructions: 'Get from Plaid Dashboard > Team Settings > Keys',
      documentationUrl: 'https://dashboard.plaid.com/developers/keys'
    },
    {
      name: 'PLAID_SECRET',
      feature: 'Plaid Bank Account Integration',
      criticality: 'high',
      description: 'Required for secure Plaid API calls',
      instructions: 'Get from Plaid Dashboard > Team Settings > Keys',
      documentationUrl: 'https://dashboard.plaid.com/developers/keys'
    },

    // AI & Analysis
    {
      name: 'OPENAI_API_KEY',
      feature: 'AI Analysis & Chat Features',
      criticality: 'high',
      description: 'Required for AI stock analysis, chatbot, smart alerts, meeting summaries',
      instructions: 'Create API key at OpenAI Platform > API Keys',
      documentationUrl: 'https://platform.openai.com/api-keys'
    },

    // Market Data
    {
      name: 'FINNHUB_API_KEY',
      feature: 'Stock Market Data',
      criticality: 'medium',
      description: 'Required for real-time stock prices, market stats, financial data',
      instructions: 'Sign up at Finnhub.io and get free API key',
      documentationUrl: 'https://finnhub.io/dashboard'
    },
    {
      name: 'ALTS_API_KEY',
      feature: 'Alternative Investments Data',
      criticality: 'medium', 
      description: 'Required for alternative investment data and analysis',
      instructions: 'Contact your Alternative Investments data provider for API key',
      documentationUrl: ''
    },

    // Communication
    {
      name: 'RESEND_API_KEY',
      feature: 'Email Notifications',
      criticality: 'critical',
      description: 'Required for all email functionality: invites, notifications, marketing',
      instructions: 'Create account at Resend.com > API Keys',
      documentationUrl: 'https://resend.com/api-keys'
    },
    {
      name: 'TWILIO_ACCOUNT_SID',
      feature: 'SMS Notifications',
      criticality: 'medium',
      description: 'Required for SMS alerts and two-factor authentication',
      instructions: 'Get from Twilio Console > Account Info',
      documentationUrl: 'https://console.twilio.com/'
    },
    {
      name: 'TWILIO_AUTH_TOKEN',
      feature: 'SMS Notifications',
      criticality: 'medium',
      description: 'Required for SMS alerts and two-factor authentication',
      instructions: 'Get from Twilio Console > Account Info',
      documentationUrl: 'https://console.twilio.com/'
    },

    // Video & Meeting
    {
      name: 'ZOOM_API_KEY',
      feature: 'Zoom Meeting Integration',
      criticality: 'medium',
      description: 'Required for automated Zoom meeting creation and management',
      instructions: 'Create Zoom App in Zoom Marketplace',
      documentationUrl: 'https://marketplace.zoom.us/'
    },
    {
      name: 'ZOOM_API_SECRET',
      feature: 'Zoom Meeting Integration',
      criticality: 'medium',
      description: 'Required for authenticated Zoom API calls',
      instructions: 'Get from your Zoom App credentials',
      documentationUrl: 'https://marketplace.zoom.us/'
    },

    // OAuth & Social
    {
      name: 'GOOGLE_CLIENT_ID',
      feature: 'Google OAuth Login',
      criticality: 'medium',
      description: 'Required for Google Sign-In functionality',
      instructions: 'Create OAuth 2.0 credentials in Google Cloud Console',
      documentationUrl: 'https://console.cloud.google.com/apis/credentials'
    },
    {
      name: 'GOOGLE_CLIENT_SECRET',
      feature: 'Google OAuth Login',
      criticality: 'medium',
      description: 'Required for Google Sign-In functionality',
      instructions: 'Get from Google Cloud Console OAuth credentials',
      documentationUrl: 'https://console.cloud.google.com/apis/credentials'
    },
    {
      name: 'FACEBOOK_APP_ID',
      feature: 'Facebook Login & Marketing',
      criticality: 'optional',
      description: 'Required for Facebook login and marketing integrations',
      instructions: 'Create app in Facebook Developer Console',
      documentationUrl: 'https://developers.facebook.com/'
    },
    {
      name: 'LINKEDIN_CLIENT_ID',
      feature: 'LinkedIn Integration',
      criticality: 'optional',
      description: 'Required for LinkedIn lead import and professional data',
      instructions: 'Create LinkedIn App in LinkedIn Developer Platform',
      documentationUrl: 'https://www.linkedin.com/developers/'
    },

    // Document & Legal
    {
      name: 'DOCUSIGN_INTEGRATION_KEY',
      feature: 'DocuSign Document Signing',
      criticality: 'medium',
      description: 'Required for automated document signing workflows',
      instructions: 'Create DocuSign Developer Account and get Integration Key',
      documentationUrl: 'https://developers.docusign.com/'
    },

    // CRM & Marketing
    {
      name: 'GHL_API_KEY',
      feature: 'GoHighLevel CRM Integration',
      criticality: 'medium',
      description: 'Required for lead management and marketing automation',
      instructions: 'Get API key from GoHighLevel settings',
      documentationUrl: 'https://help.gohighlevel.com/support/solutions/articles/48000982002'
    },
    {
      name: 'HUBSPOT_API_KEY',
      feature: 'HubSpot CRM Integration',
      criticality: 'optional',
      description: 'Required for HubSpot lead sync and marketing',
      instructions: 'Generate private app access token in HubSpot',
      documentationUrl: 'https://developers.hubspot.com/docs/api/private-apps'
    },

    // Development & QA
    {
      name: 'QA_BYPASS_EMAIL',
      feature: 'QA Testing Bypass',
      criticality: 'optional',
      description: 'Email address that can bypass certain restrictions in development',
      instructions: 'Set to your development email (only works in development mode)',
      documentationUrl: ''
    }
  ];

  useEffect(() => {
    checkAllSecrets();
  }, []);

  const checkAllSecrets = async () => {
    setLoading(true);
    const secretsToCheck = secretConfigs.map(config => ({
      ...config,
      status: 'checking' as const
    }));
    setSecrets(secretsToCheck);

    let set = 0;
    let critical_missing = 0;

    for (const config of secretConfigs) {
      try {
        const { data, error } = await supabase.functions.invoke('check-api-keys', {
          body: { secretName: config.name }
        });

        if (error) {
          console.error(`Error checking ${config.name}:`, error);
          continue;
        }

        const isSet = data?.exists === true;
        if (isSet) {
          set++;
        } else if (config.criticality === 'critical') {
          critical_missing++;
        }

        setSecrets(prev => prev.map(s => 
          s.name === config.name 
            ? { ...s, status: isSet ? 'set' : 'not_set' }
            : s
        ));
      } catch (error) {
        console.error(`Error checking ${config.name}:`, error);
        setSecrets(prev => prev.map(s => 
          s.name === config.name 
            ? { ...s, status: 'not_set' }
            : s
        ));
      }
    }

    setSummary({
      total: secretConfigs.length,
      set,
      missing: secretConfigs.length - set,
      critical_missing
    });
    setLoading(false);
  };

  const getCriticalityIcon = (criticality: string, status: string) => {
    if (status === 'set') return <CheckCircle className="w-4 h-4 text-green-500" />;
    
    switch (criticality) {
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getCriticalityColor = (criticality: string, status: string) => {
    if (status === 'set') return 'success';
    
    switch (criticality) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      default: return 'outline';
    }
  };

  const criticalSecrets = secrets.filter(s => s.criticality === 'critical');
  const missingCritical = criticalSecrets.filter(s => s.status === 'not_set');
  const productionReady = missingCritical.length === 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8" />
            API & Secret Key Security Audit
          </h1>
          <p className="text-muted-foreground">
            Comprehensive audit of all API keys and secrets required for platform functionality
          </p>
        </div>
        <Button onClick={checkAllSecrets} disabled={loading}>
          {loading ? 'Checking...' : 'Refresh Audit'}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Secrets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Configured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary.set}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Missing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.missing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Missing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.critical_missing}</div>
          </CardContent>
        </Card>
      </div>

      {/* Production Readiness Status */}
      <Alert variant={productionReady ? "default" : "destructive"}>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Production Status:</strong> {productionReady ? (
            "✅ Ready for production deployment - all critical secrets are configured"
          ) : (
            `❌ NOT ready for production - ${missingCritical.length} critical secret(s) missing`
          )}
        </AlertDescription>
      </Alert>

      {/* Critical Secrets Status */}
      {missingCritical.length > 0 && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Blocking Issues:</strong> The following critical secrets must be configured before production:
            <ul className="list-disc list-inside mt-2">
              {missingCritical.map(secret => (
                <li key={secret.name}>{secret.name} - {secret.feature}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Secrets List */}
      <Card>
        <CardHeader>
          <CardTitle>All API Keys & Secrets</CardTitle>
          <CardDescription>
            Complete list of all integrations and their secret requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {secrets.map((secret) => (
            <div key={secret.name} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getCriticalityIcon(secret.criticality, secret.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {secret.name}
                      </code>
                      <Badge variant={getCriticalityColor(secret.criticality, secret.status)}>
                        {secret.status === 'checking' ? 'Checking...' : 
                         secret.status === 'set' ? 'Set' : 'Not Set'}
                      </Badge>
                      <Badge variant="outline">{secret.criticality}</Badge>
                    </div>
                    <p className="text-sm font-medium mt-1">{secret.feature}</p>
                    <p className="text-sm text-muted-foreground">{secret.description}</p>
                  </div>
                </div>
                {secret.documentationUrl && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={secret.documentationUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
              
              {secret.status === 'not_set' && (
                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Setup Instructions:</strong> {secret.instructions}
                    <br />
                    <strong>Add to Supabase:</strong> Go to Supabase Dashboard → Project Settings → Edge Functions → Environment Variables → Add {secret.name}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {summary.critical_missing > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>URGENT:</strong> Configure {summary.critical_missing} critical secret(s) before launch
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <h3 className="font-semibold">Features that will not work without missing secrets:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {secrets.filter(s => s.status === 'not_set').map(secret => (
                <li key={secret.name}>
                  <strong>{secret.feature}</strong> requires {secret.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">How to add secrets to Supabase:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Go to <a href="https://supabase.com/dashboard" className="text-blue-600 hover:underline">Supabase Dashboard</a></li>
              <li>Select your project</li>
              <li>Navigate to Settings → Edge Functions</li>
              <li>Scroll to "Environment Variables" section</li>
              <li>Click "Add Environment Variable"</li>
              <li>Enter the variable name and value</li>
              <li>Click "Add Variable"</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}