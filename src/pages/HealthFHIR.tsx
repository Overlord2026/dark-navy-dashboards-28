import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  ExternalLink, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Database,
  Hash,
  User,
  Calendar,
  Activity
} from 'lucide-react';
import { 
  smartFHIRClient, 
  createFHIRInputsHash,
  type NormalizedSummary,
  type AuthState 
} from '@/features/health/fhir/client';

export default function HealthFHIR() {
  const [authState, setAuthState] = useState<AuthState>({ isAuthenticated: false });
  const [summary, setSummary] = useState<NormalizedSummary | null>(null);
  const [summaryHash, setSummaryHash] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const initiateFHIRAuth = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const { authUrl, state } = await smartFHIRClient.auth();
      
      // In a real app, this would redirect to the FHIR provider
      // For Phase 1, we'll simulate the OAuth flow
      console.info('FHIR Auth URL generated:', authUrl);
      
      // Simulate successful OAuth callback
      setTimeout(async () => {
        try {
          const mockCode = 'mock_auth_code_' + Date.now();
          const authResult = await smartFHIRClient.handleCallback(mockCode, state);
          setAuthState(authResult);
          setIsLoading(false);
        } catch (err) {
          setError('OAuth simulation failed: ' + String(err));
          setIsLoading(false);
        }
      }, 2000);
      
    } catch (err) {
      setError('Failed to initiate FHIR auth: ' + String(err));
      setIsLoading(false);
    }
  };

  const fetchPatientSummary = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const patientSummary = await smartFHIRClient.fetchSummary();
      setSummary(patientSummary);
      
      // Generate hash for receipts
      const hash = createFHIRInputsHash(patientSummary);
      setSummaryHash(hash);
      
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch summary: ' + String(err));
      setIsLoading(false);
    }
  };

  const disconnectFHIR = async () => {
    await smartFHIRClient.revoke();
    setAuthState({ isAuthenticated: false });
    setSummary(null);
    setSummaryHash('');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'text-destructive';
      case 'moderate': return 'text-warning';
      case 'mild': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Database className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">FHIR Integration</h1>
          <p className="text-muted-foreground">SMART on FHIR connector with OAuth authentication</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authentication Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              SMART App Launch
            </CardTitle>
            <CardDescription>
              OAuth 2.0 authentication with FHIR provider
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!authState.isAuthenticated ? (
              <div className="space-y-4">
                <Alert>
                  <ExternalLink className="h-4 w-4" />
                  <AlertDescription>
                    This will initiate SMART App Launch flow. In Phase 1, we simulate the OAuth flow with mock data.
                  </AlertDescription>
                </Alert>
                
                <Button 
                  onClick={initiateFHIRAuth}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Authenticating...' : 'Connect to FHIR Provider'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Connected to FHIR Provider</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Patient ID:</span>{' '}
                    <span className="text-muted-foreground font-mono">
                      {authState.patientId?.substring(0, 12)}...
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Authorized Scopes:</span>{' '}
                    <span className="text-muted-foreground">
                      {authState.authorizedScopes?.length || 0} scopes
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Token Type:</span>{' '}
                    <span className="text-muted-foreground">
                      {authState.token?.token_type}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={fetchPatientSummary}
                    disabled={isLoading}
                    variant="default"
                    size="sm"
                  >
                    {isLoading ? 'Fetching...' : 'Fetch Summary'}
                  </Button>
                  
                  <Button 
                    onClick={disconnectFHIR}
                    variant="outline"
                    size="sm"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Data Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Patient Summary
            </CardTitle>
            <CardDescription>
              Normalized FHIR data for receipt generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {summary ? (
              <div className="space-y-4">
                {/* Summary Hash */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Hash className="h-4 w-4" />
                    <span className="text-sm font-medium">Summary Hash</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono break-all">
                    {summaryHash}
                  </div>
                </div>

                <Separator />

                {/* Demographics */}
                <div>
                  <div className="text-sm font-medium mb-2 flex items-center gap-2">
                    <User className="h-3 w-3" />
                    Demographics
                  </div>
                  <div className="space-y-1 text-sm">
                    <div>Age: {summary.age} years</div>
                    <div>Sex: {summary.sex}</div>
                  </div>
                </div>

                {/* Diagnoses */}
                <div>
                  <div className="text-sm font-medium mb-2">ICD Codes ({summary.icd.length})</div>
                  <div className="flex flex-wrap gap-1">
                    {summary.icd.map((code, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {code}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Procedures */}
                <div>
                  <div className="text-sm font-medium mb-2">CPT Codes ({summary.cpt.length})</div>
                  <div className="flex flex-wrap gap-1">
                    {summary.cpt.map((code, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {code}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div>
                  <div className="text-sm font-medium mb-2">Allergies ({summary.allergies.length})</div>
                  <div className="space-y-1">
                    {summary.allergies.map((allergy, index) => (
                      <div key={index} className="text-sm flex items-center gap-2">
                        <span>{allergy.substance}</span>
                        <span className={`text-xs ${getSeverityColor(allergy.severity)}`}>
                          ({allergy.severity})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medications */}
                <div>
                  <div className="text-sm font-medium mb-2">Medications ({summary.meds.length})</div>
                  <div className="space-y-1">
                    {summary.meds.map((med, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        {med.name} {med.dosage} - {med.frequency}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Screenings */}
                <div>
                  <div className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    Recent Screenings ({summary.lastScreenings.length})
                  </div>
                  <div className="space-y-1">
                    {summary.lastScreenings.map((screening, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        <div className="font-medium">{screening.type.replace('_', ' ')}</div>
                        <div className="text-xs">
                          {screening.date} - {screening.result}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insurance Plan */}
                <div>
                  <div className="text-sm font-medium mb-2">Plan Status</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span>In Network:</span>
                      {summary.plan.inNetwork ? (
                        <CheckCircle className="h-3 w-3 text-success" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 text-warning" />
                      )}
                    </div>
                    <div>
                      Deductible: {summary.plan.deductibleMet ? 'Met' : `$${summary.plan.remainingDeductible} remaining`}
                    </div>
                    <div>Copay Tier: {summary.plan.copayTier}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Connect to FHIR provider and fetch summary to view patient data</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Integration Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Phase 1 Implementation:</strong> This FHIR client includes OAuth shell with mock data. 
                The summary hash ({summaryHash.substring(0, 20)}...) can be used as inputs_hash in Health-RDS 
                and PA-RDS receipts, ensuring no PHI is stored in audit logs.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}