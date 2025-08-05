import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MissingKey {
  name: string;
  displayName: string;
  required: boolean;
}

export function QAWarningBanner() {
  const [missingKeys, setMissingKeys] = useState<MissingKey[]>([]);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const REQUIRED_KEYS = [
    { name: 'STRIPE_SECRET_KEY', displayName: 'Stripe Secret', required: true },
    { name: 'STRIPE_PUBLISHABLE_KEY', displayName: 'Stripe Publishable', required: true },
    { name: 'PLAID_CLIENT_ID', displayName: 'Plaid Client ID', required: true },
    { name: 'PLAID_SECRET', displayName: 'Plaid Secret', required: true },
    { name: 'FINNHUB_API_KEY', displayName: 'Finnhub API', required: true },
    { name: 'FINNHUB_WEBHOOK_SECRET', displayName: 'Finnhub Webhook', required: false },
    { name: 'ALTS_API_KEY', displayName: 'Alt Investments API', required: true },
    { name: 'RESEND_API_KEY', displayName: 'Resend Email API', required: true },
    { name: 'OPENAI_API_KEY', displayName: 'OpenAI API', required: false },
    { name: 'TWILIO_ACCOUNT_SID', displayName: 'Twilio Account SID', required: false },
    { name: 'TWILIO_AUTH_TOKEN', displayName: 'Twilio Auth Token', required: false },
    { name: 'TWILIO_MESSAGING_SID', displayName: 'Twilio Messaging SID', required: false },
    { name: 'GOOGLE_CLIENT_ID', displayName: 'Google Client ID', required: false },
    { name: 'GOOGLE_CLIENT_SECRET', displayName: 'Google Client Secret', required: false },
    { name: 'ZOOM_CLIENT_ID', displayName: 'Zoom Client ID', required: false },
    { name: 'ZOOM_CLIENT_SECRET', displayName: 'Zoom Client Secret', required: false },
    { name: 'FACEBOOK_APP_ID', displayName: 'Facebook App ID', required: false },
    { name: 'FACEBOOK_APP_SECRET', displayName: 'Facebook App Secret', required: false },
    { name: 'CALENDLY_API_KEY', displayName: 'Calendly API Key', required: false },
  ];

  const checkAPIKeys = async () => {
    console.log('🔍 [QA Warning Banner] Checking for missing API keys...');
    const missing: MissingKey[] = [];

    for (const key of REQUIRED_KEYS) {
      try {
        const { data, error } = await supabase.functions.invoke('check-api-keys', {
          body: { secretName: key.name }
        });

        if (error || !data?.exists) {
          missing.push(key);
          console.warn(`❌ [QA Warning Banner] Missing required key: ${key.name}`);
        } else {
          console.log(`✅ [QA Warning Banner] Found key: ${key.name}`);
        }
      } catch (err) {
        console.error(`💥 [QA Warning Banner] Error checking ${key.name}:`, err);
        missing.push(key);
      }
    }

    setMissingKeys(missing);
    setIsChecking(false);

    if (missing.length > 0) {
      console.warn(`🚨 [QA Warning Banner] ${missing.length} required API keys are missing:`, 
        missing.map(k => k.displayName).join(', '));
    } else {
      console.log('✅ [QA Warning Banner] All required API keys are configured');
    }
  };

  useEffect(() => {
    checkAPIKeys();
    
    // Check every 30 seconds during QA
    const interval = setInterval(checkAPIKeys, 30000);
    return () => clearInterval(interval);
  }, []);

  // Don't show banner if dismissed or no missing keys
  if (isDismissed || missingKeys.length === 0 || isChecking) {
    return null;
  }

  return (
    <Alert variant="destructive" className="border-red-500 bg-red-50 dark:bg-red-900/20 mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex-1">
          <strong>🚨 QA Warning:</strong> {missingKeys.length} required API key(s) missing. 
          <br />
          <span className="text-sm">
            Missing: {missingKeys.map(k => k.displayName).join(', ')}
          </span>
          <br />
          <span className="text-xs opacity-75">
            Add these in Supabase Dashboard → Settings → Secrets
          </span>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button
            size="sm"
            variant="outline"
            className="text-red-700 border-red-300 hover:bg-red-100"
            onClick={() => window.open('https://supabase.com/dashboard/project/xcmqjkvyvuhoslbzmlgi/settings/functions', '_blank')}
          >
            <Settings className="h-3 w-3 mr-1" />
            Fix Now
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