import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, FileText, Link, AlertTriangle, CheckCircle } from 'lucide-react';
import { 
  healthcareGate, 
  recordHealthRDS, 
  recordConsentRDS,
  fhirConnector,
  type HealthcareContext,
  type GateResult 
} from '@/features/healthcare';
import { usePersonalizationStore } from '@/features/personalization/store';

interface HealthcareGatewayProps {
  action: string;
  onAccessGranted?: () => void;
  onAccessDenied?: (reasons: string[]) => void;
  children?: React.ReactNode;
}

export function HealthcareGateway({ 
  action, 
  onAccessGranted, 
  onAccessDenied,
  children 
}: HealthcareGatewayProps) {
  const { persona, tier } = usePersonalizationStore();
  const [gateResult, setGateResult] = useState<GateResult | null>(null);
  const [hipaaConsent, setHipaaConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fhirConnected, setFhirConnected] = useState(false);

  const checkAccess = () => {
    const context: HealthcareContext = {
      persona,
      tier,
      hipaaConsentValid: hipaaConsent,
      lastConsentDate: hipaaConsent ? new Date() : undefined,
      hasDataAccess: fhirConnected,
      requestedScope: ['basic', 'insurance']
    };

    const result = healthcareGate(action, context);
    setGateResult(result);

    // Record the gate check
    recordHealthRDS(
      action,
      { persona, tier, consent: hipaaConsent },
      result.allow ? 'allow' : 'deny',
      result.reasons,
      result.disclosures
    );

    if (result.allow) {
      onAccessGranted?.();
    } else {
      onAccessDenied?.(result.reasons);
    }
  };

  const handleConsentChange = (checked: boolean) => {
    setHipaaConsent(checked);
    if (checked) {
      recordConsentRDS(
        ['health_data', 'insurance_info'],
        'healthcare_planning',
        90 // 90 day expiry
      );
    }
  };

  const handleFhirConnect = async () => {
    setLoading(true);
    try {
      const authUrl = await fhirConnector.authorize();
      console.info('fhir.connect.initiated', { action, persona, tier });
      
      // In real app, would redirect to authUrl
      // For demo, simulate successful connection
      setTimeout(() => {
        setFhirConnected(true);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('FHIR connection failed:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAccess();
  }, [action, persona, tier, hipaaConsent, fhirConnected]);

  const requiresConsent = gateResult?.requiredActions?.includes('consent');
  const requiresUpgrade = gateResult?.requiredActions?.includes('upgrade');
  const requiresVerification = gateResult?.requiredActions?.includes('verification');

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Healthcare Access Control
          <Badge variant={gateResult?.allow ? 'default' : 'destructive'}>
            {gateResult?.allow ? 'Authorized' : 'Restricted'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Access Status */}
        {gateResult && (
          <Alert variant={gateResult.allow ? 'default' : 'destructive'}>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              {gateResult.allow 
                ? 'Access granted for healthcare operations'
                : `Access restricted: ${gateResult.reasons.join(', ')}`
              }
            </AlertDescription>
          </Alert>
        )}

        {/* HIPAA Consent */}
        {requiresConsent && (
          <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
            <h4 className="font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              HIPAA Authorization Required
            </h4>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="hipaa-consent" 
                  checked={hipaaConsent}
                  onCheckedChange={handleConsentChange}
                />
                <label htmlFor="hipaa-consent" className="text-sm leading-relaxed">
                  I authorize access to my health information for financial planning purposes.
                  This consent expires in 90 days and can be revoked at any time.
                </label>
              </div>
              {gateResult?.disclosures?.map((disclosure, idx) => (
                <p key={idx} className="text-xs text-muted-foreground">
                  • {disclosure}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* FHIR Connection */}
        {requiresVerification && (
          <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
            <h4 className="font-medium flex items-center gap-2">
              <Link className="w-4 h-4" />
              Health Data Connection
            </h4>
            <p className="text-sm text-muted-foreground">
              Connect to your health insurance provider for personalized recommendations.
            </p>
            <Button
              onClick={handleFhirConnect}
              disabled={loading || fhirConnected}
              variant={fhirConnected ? 'default' : 'outline'}
            >
              {loading ? 'Connecting...' : fhirConnected ? 'Connected' : 'Connect Health Data'}
              {fhirConnected && <CheckCircle className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        )}

        {/* Tier Upgrade */}
        {requiresUpgrade && (
          <div className="space-y-3 p-4 border rounded-lg bg-warning/10">
            <h4 className="font-medium">Advanced Features Locked</h4>
            <p className="text-sm text-muted-foreground">
              This feature requires an advanced complexity tier. 
              Connect more accounts or entities to unlock.
            </p>
            <Button variant="outline" size="sm">
              Learn More About Tiers
            </Button>
          </div>
        )}

        {/* Persona Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Persona: <Badge variant="outline">{persona}</Badge></span>
          <span>Tier: <Badge variant="outline">{tier}</Badge></span>
        </div>

        {/* Content (only shown if access granted) */}
        {gateResult?.allow && children}
      </CardContent>
    </Card>
  );
}