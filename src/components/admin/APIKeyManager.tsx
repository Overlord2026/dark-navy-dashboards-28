import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Key, RefreshCw, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface APISecret {
  name: string;
  displayName: string;
  required: boolean;
  category: 'payment' | 'financial' | 'communication' | 'meetings' | 'investments';
  description: string;
  status: 'missing' | 'present' | 'checking';
}

const API_SECRETS: APISecret[] = [
  // Payment Processing
  {
    name: 'STRIPE_SECRET_KEY',
    displayName: 'Stripe Secret Key',
    required: true,
    category: 'payment',
    description: 'Live secret key for Stripe payment processing',
    status: 'checking'
  },
  {
    name: 'STRIPE_PUBLISHABLE_KEY',
    displayName: 'Stripe Publishable Key',
    required: true,
    category: 'payment',
    description: 'Publishable key for Stripe client-side integration',
    status: 'checking'
  },
  
  // Financial Data
  {
    name: 'PLAID_CLIENT_ID',
    displayName: 'Plaid Client ID',
    required: true,
    category: 'financial',
    description: 'Client ID for Plaid banking integration',
    status: 'checking'
  },
  {
    name: 'PLAID_SECRET',
    displayName: 'Plaid Secret',
    required: true,
    category: 'financial',
    description: 'Secret key for Plaid API access',
    status: 'checking'
  },
  {
    name: 'FINNHUB_API_KEY',
    displayName: 'Finnhub API Key',
    required: true,
    category: 'financial',
    description: 'API key for market data from Finnhub',
    status: 'checking'
  },
  {
    name: 'FINNHUB_WEBHOOK_SECRET',
    displayName: 'Finnhub Webhook Secret',
    required: false,
    category: 'financial',
    description: 'Secret for validating Finnhub webhook signatures',
    status: 'checking'
  },
  
  // Alternative Investments
  {
    name: 'ALTS_API_KEY',
    displayName: 'Alternative Investments API Key',
    required: true,
    category: 'investments',
    description: 'API key for alternative investments platform',
    status: 'checking'
  },
  
  // Communication
  {
    name: 'RESEND_API_KEY',
    displayName: 'Resend API Key',
    required: true,
    category: 'communication',
    description: 'API key for Resend email service',
    status: 'checking'
  },
  
  // Meeting Platforms
  {
    name: 'GOOGLE_CLIENT_ID',
    displayName: 'Google Client ID',
    required: false,
    category: 'meetings',
    description: 'Client ID for Google Calendar/Meet integration',
    status: 'checking'
  },
  {
    name: 'GOOGLE_CLIENT_SECRET',
    displayName: 'Google Client Secret',
    required: false,
    category: 'meetings',
    description: 'Client secret for Google API access',
    status: 'checking'
  },
  {
    name: 'ZOOM_CLIENT_ID',
    displayName: 'Zoom Client ID',
    required: false,
    category: 'meetings',
    description: 'Client ID for Zoom integration',
    status: 'checking'
  },
  {
    name: 'ZOOM_CLIENT_SECRET',
    displayName: 'Zoom Client Secret',
    required: false,
    category: 'meetings',
    description: 'Client secret for Zoom API access',
    status: 'checking'
  }
];

export function APIKeyManager() {
  const [secrets, setSecrets] = useState<APISecret[]>(API_SECRETS);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const checkSecrets = async () => {
    setIsChecking(true);
    console.log('🔑 [API Key Manager] Starting secret validation check...');
    
    const updatedSecrets = [...secrets];
    
    for (const secret of updatedSecrets) {
      try {
        // Call a test function to check if the secret exists
        const { data, error } = await supabase.functions.invoke('check-api-keys', {
          body: { secretName: secret.name }
        });
        
        if (error) {
          console.warn(`❌ [API Key Manager] Error checking ${secret.name}:`, error);
          secret.status = 'missing';
        } else if (data?.exists) {
          console.log(`✅ [API Key Manager] ${secret.name} is configured`);
          secret.status = 'present';
        } else {
          console.warn(`⚠️ [API Key Manager] ${secret.name} is missing`);
          secret.status = 'missing';
        }
      } catch (err) {
        console.error(`💥 [API Key Manager] Failed to check ${secret.name}:`, err);
        secret.status = 'missing';
      }
    }
    
    setSecrets(updatedSecrets);
    setIsChecking(false);
    
    // Log summary
    const missing = updatedSecrets.filter(s => s.status === 'missing' && s.required);
    const present = updatedSecrets.filter(s => s.status === 'present');
    
    console.log(`📊 [API Key Manager] Secret Status Summary:
    ✅ Present: ${present.length}
    ❌ Missing Required: ${missing.length}
    🔍 Total Checked: ${updatedSecrets.length}`);
    
    if (missing.length > 0) {
      console.warn('🚨 [API Key Manager] Missing Required API Keys:', missing.map(s => s.name));
    }
  };

  useEffect(() => {
    checkSecrets();
  }, []);

  const missingRequired = secrets.filter(s => s.status === 'missing' && s.required);
  const missingOptional = secrets.filter(s => s.status === 'missing' && !s.required);
  const present = secrets.filter(s => s.status === 'present');

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'payment': return 'bg-green-100 text-green-800 border-green-200';
      case 'financial': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'communication': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'meetings': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'investments': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'missing': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <RefreshCw className="h-4 w-4 animate-spin text-yellow-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* QA Warning Banner */}
      {missingRequired.length > 0 && (
        <Alert variant="destructive" className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-medium">
            🚨 QA Warning: {missingRequired.length} required API key(s) missing. 
            Some features may not work properly: {missingRequired.map(s => s.displayName).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{present.length}</p>
                <p className="text-sm text-muted-foreground">Configured</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">{missingRequired.length}</p>
                <p className="text-sm text-muted-foreground">Missing Required</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">{missingOptional.length}</p>
                <p className="text-sm text-muted-foreground">Missing Optional</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secret Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Key Management
              </CardTitle>
              <CardDescription>
                Configure and validate all required API keys for production deployment
              </CardDescription>
            </div>
            <Button 
              onClick={checkSecrets} 
              disabled={isChecking}
              variant="outline"
              size="sm"
            >
              {isChecking ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh Status
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {secrets.map((secret) => (
              <div 
                key={secret.name}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(secret.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{secret.displayName}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getCategoryColor(secret.category)}`}
                      >
                        {secret.category}
                      </Badge>
                      {secret.required && (
                        <Badge variant="destructive" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{secret.description}</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded mt-1 block w-fit">
                      {secret.name}
                    </code>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {secret.status === 'missing' && (
                    <Button
                      size="sm"
                      variant={secret.required ? "destructive" : "outline"}
                      onClick={() => {
                        toast({
                          title: "Add Secret",
                          description: `Configure ${secret.displayName} in Supabase Dashboard → Settings → Secrets`,
                        });
                      }}
                    >
                      Configure
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Setup Guide</CardTitle>
          <CardDescription>
            Add missing API keys in your Supabase project settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to <strong>Supabase Dashboard → Settings → Secrets</strong></li>
            <li>Click <strong>"Add Secret"</strong> for each missing key</li>
            <li>Copy the exact secret name from the list above</li>
            <li>Paste your API key value</li>
            <li>Click <strong>"Refresh Status"</strong> to verify</li>
          </ol>
          
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 <strong>Tip:</strong> Required API keys must be configured before production deployment.
              Optional keys can be added later to enable additional features.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}