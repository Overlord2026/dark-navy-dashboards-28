import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, Settings, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface MissingIntegration {
  name: string;
  displayName: string;
  category: string;
  required: boolean;
  impact: string;
}

export function APIWarningBanner() {
  const { user } = useAuth();
  const [missingIntegrations, setMissingIntegrations] = useState<MissingIntegration[]>([]);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Core integrations that should be configured for production
  const CRITICAL_INTEGRATIONS = [
    { 
      name: 'STRIPE_SECRET_KEY', 
      displayName: 'Stripe Payments', 
      category: 'Payments',
      required: true,
      impact: 'Payment processing and billing disabled'
    },
    { 
      name: 'PLAID_CLIENT_ID', 
      displayName: 'Plaid Banking', 
      category: 'Financial Data',
      required: true,
      impact: 'Bank account linking unavailable'
    },
    { 
      name: 'FINNHUB_API_KEY', 
      displayName: 'Market Data', 
      category: 'Financial Data',
      required: true,
      impact: 'Real-time market data unavailable'
    },
    { 
      name: 'RESEND_API_KEY', 
      displayName: 'Email Service', 
      category: 'Communications',
      required: true,
      impact: 'Email notifications disabled'
    },
    { 
      name: 'OPENAI_API_KEY', 
      displayName: 'AI Features', 
      category: 'AI/Chat',
      required: false,
      impact: 'AI assistant and content generation disabled'
    },
    { 
      name: 'TWILIO_ACCOUNT_SID', 
      displayName: 'SMS Service', 
      category: 'Communications',
      required: false,
      impact: 'SMS notifications and 2FA disabled'
    }
  ];

  const checkCriticalIntegrations = async () => {
    // Only show to admin users
    if (!user || !['admin', 'system_administrator', 'tenant_admin'].includes(user.user_metadata?.role)) {
      setIsChecking(false);
      return;
    }

    console.log('🔍 [API Warning Banner] Checking critical integrations for admin user...');
    const missing: MissingIntegration[] = [];

    for (const integration of CRITICAL_INTEGRATIONS) {
      try {
        const { data, error } = await supabase.functions.invoke('check-api-keys', {
          body: { secretName: integration.name }
        });

        if (error || !data?.exists) {
          missing.push(integration);
          console.warn(`❌ [API Warning Banner] Missing critical integration: ${integration.name}`);
        } else {
          console.log(`✅ [API Warning Banner] Found integration: ${integration.name}`);
        }
      } catch (err) {
        console.error(`💥 [API Warning Banner] Error checking ${integration.name}:`, err);
        missing.push(integration);
      }
    }

    setMissingIntegrations(missing);
    setIsChecking(false);

    if (missing.length > 0) {
      console.warn(`🚨 [API Warning Banner] ${missing.length} critical integrations missing:`, 
        missing.map(i => i.displayName).join(', '));
    } else {
      console.log('✅ [API Warning Banner] All critical integrations configured');
    }
  };

  useEffect(() => {
    checkCriticalIntegrations();
    
    // Check every 2 minutes for admin users
    const interval = setInterval(checkCriticalIntegrations, 120000);
    return () => clearInterval(interval);
  }, [user]);

  // Don't show banner if not admin, dismissed, no missing integrations, or still checking
  if (
    !user || 
    !['admin', 'system_administrator', 'tenant_admin'].includes(user.user_metadata?.role) ||
    isDismissed || 
    missingIntegrations.length === 0 || 
    isChecking
  ) {
    return null;
  }

  const criticalMissing = missingIntegrations.filter(i => i.required);
  const optionalMissing = missingIntegrations.filter(i => !i.required);

  return (
    <Alert variant="destructive" className="border-red-500 bg-red-50 dark:bg-red-900/20 mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-start justify-between w-full">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <strong className="text-red-800">⚠️ Integration Warning</strong>
            <span className="text-sm text-red-700">
              ({missingIntegrations.length} integration{missingIntegrations.length !== 1 ? 's' : ''} need configuration)
            </span>
          </div>
          
          {criticalMissing.length > 0 && (
            <div className="mb-2">
              <div className="text-sm font-medium text-red-800 mb-1">Critical (Required):</div>
              <div className="text-sm text-red-700">
                {criticalMissing.map(i => i.displayName).join(', ')}
              </div>
            </div>
          )}
          
          {optionalMissing.length > 0 && (
            <div className="mb-2">
              <div className="text-sm font-medium text-red-800 mb-1">Optional (Enhanced Features):</div>
              <div className="text-sm text-red-700">
                {optionalMissing.map(i => i.displayName).join(', ')}
              </div>
            </div>
          )}
          
          <div className="text-xs text-red-600 opacity-90 mt-2">
            <strong>Impact:</strong> Some platform features may be unavailable without these integrations.
          </div>
          
          <div className="text-xs text-red-600 opacity-75 mt-1">
            💡 <strong>Quick Fix:</strong> Add API keys in Supabase Dashboard → Settings → Secrets
          </div>
        </div>
        
        <div className="flex items-start gap-2 ml-4">
          <Button
            size="sm"
            variant="outline"
            className="text-red-700 border-red-300 hover:bg-red-100"
            onClick={() => window.open('https://supabase.com/dashboard/project/xcmqjkvyvuhoslbzmlgi/settings/functions', '_blank')}
          >
            <Settings className="h-3 w-3 mr-1" />
            Add Keys
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-700 border-red-300 hover:bg-red-100"
            onClick={() => window.open('/admin', '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View Audit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-700 hover:bg-red-100 p-1"
            onClick={() => setIsDismissed(true)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}