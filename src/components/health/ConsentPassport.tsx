import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Plus, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  XCircle,
  Users,
  FileText,
  Eye,
  Trash2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  getActiveConsents,
  issueConsent,
  revokeConsent,
  validateConsent,
  ConsentScope,
  ActiveConsent
} from '@/features/health/consent/api';

export function ConsentPassport() {
  const [consents, setConsents] = useState<ActiveConsent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newConsentData, setNewConsentData] = useState({
    purpose: '' as ConsentScope['purpose'],
    ttlDays: 365,
    entities: [] as string[],
    dataTypes: [] as string[]
  });
  const { toast } = useToast();

  const entityOptions = [
    'primary_physician',
    'specialist',
    'lab',
    'insurance_provider',
    'billing_department',
    'attorney',
    'legal_counsel',
    'financial_advisor',
    'cpa',
    'family_member'
  ];

  const dataTypeOptions = [
    'medical_records',
    'test_results',
    'medications',
    'claims',
    'payments',
    'insurance_info',
    'disability_records',
    'mental_health_records',
    'genetic_information'
  ];

  useEffect(() => {
    loadConsents();
  }, []);

  const loadConsents = async () => {
    setIsLoading(true);
    try {
      const activeConsents = getActiveConsents();
      setConsents(activeConsents);
    } catch (error) {
      console.error('Failed to load consents:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load consent information."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleIssueConsent = async () => {
    if (!newConsentData.purpose || newConsentData.entities.length === 0 || newConsentData.dataTypes.length === 0) {
      toast({
        variant: "destructive",
        title: "Invalid Consent",
        description: "Please select purpose, entities, and data types."
      });
      return;
    }

    try {
      const scope: ConsentScope = {
        purpose: newConsentData.purpose,
        entities: newConsentData.entities,
        data_types: newConsentData.dataTypes
      };

      const receipt = issueConsent(scope, newConsentData.ttlDays);
      
      toast({
        title: "Consent Issued",
        description: `Consent-RDS generated for ${newConsentData.purpose} purpose.`
      });

      // Reset form
      setNewConsentData({
        purpose: '' as ConsentScope['purpose'],
        ttlDays: 365,
        entities: [],
        dataTypes: []
      });
      setIsDialogOpen(false);
      
      // Reload consents
      loadConsents();
      
    } catch (error) {
      console.error('Failed to issue consent:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to issue consent."
      });
    }
  };

  const handleRevokeConsent = async (consent: ActiveConsent) => {
    try {
      const receipt = revokeConsent(consent.id, 'user_requested');
      
      toast({
        title: "Consent Revoked",
        description: `Consent-RDS revocation receipt generated.`
      });
      
      // Reload consents
      loadConsents();
      
    } catch (error) {
      console.error('Failed to revoke consent:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to revoke consent."
      });
    }
  };

  const getStatusBadge = (consent: ActiveConsent) => {
    const validation = validateConsent(consent, consent.scope.purpose, consent.scope.entities);
    
    if (!validation.valid) {
      if (validation.reasons.includes('CONSENT_EXPIRED')) {
        return <Badge variant="destructive" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Expired
        </Badge>;
      }
      if (validation.reasons.includes('CONSENT_STALE')) {
        return <Badge variant="outline" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Stale
        </Badge>;
      }
      if (validation.reasons.includes('CONSENT_REVOKED')) {
        return <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Revoked
        </Badge>;
      }
    }
    
    return <Badge variant="default" className="flex items-center gap-1">
      <CheckCircle2 className="h-3 w-3" />
      Active
    </Badge>;
  };

  const getFreshnessColor = (score: number) => {
    if (score >= 0.8) return 'text-emerald-600';
    if (score >= 0.5) return 'text-amber-600';
    return 'text-destructive';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading consent passport...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              HIPAA Consent Passport
            </CardTitle>
            <CardDescription>
              Manage consent authorizations for sharing health information
            </CardDescription>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Issue Consent
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Issue New HIPAA Consent</DialogTitle>
                <DialogDescription>
                  Authorize specific entities to access your health information for designated purposes.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose of Use</Label>
                  <Select 
                    value={newConsentData.purpose} 
                    onValueChange={(value) => setNewConsentData(prev => ({ ...prev, purpose: value as ConsentScope['purpose'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="care_coordination">Care Coordination</SelectItem>
                      <SelectItem value="billing">Billing & Payment</SelectItem>
                      <SelectItem value="legal">Legal Representation</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="quality_assurance">Quality Assurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ttl">Consent Duration (Days)</Label>
                  <Input
                    id="ttl"
                    type="number"
                    value={newConsentData.ttlDays}
                    onChange={(e) => setNewConsentData(prev => ({ ...prev, ttlDays: parseInt(e.target.value) || 365 }))}
                    min="1"
                    max="1095"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Authorized Entities</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {entityOptions.map((entity) => (
                      <div key={entity} className="flex items-center space-x-2">
                        <Checkbox
                          id={entity}
                          checked={newConsentData.entities.includes(entity)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewConsentData(prev => ({
                                ...prev,
                                entities: [...prev.entities, entity]
                              }));
                            } else {
                              setNewConsentData(prev => ({
                                ...prev,
                                entities: prev.entities.filter(e => e !== entity)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={entity} className="text-sm capitalize">
                          {entity.replace('_', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Data Types</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {dataTypeOptions.map((dataType) => (
                      <div key={dataType} className="flex items-center space-x-2">
                        <Checkbox
                          id={dataType}
                          checked={newConsentData.dataTypes.includes(dataType)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewConsentData(prev => ({
                                ...prev,
                                dataTypes: [...prev.dataTypes, dataType]
                              }));
                            } else {
                              setNewConsentData(prev => ({
                                ...prev,
                                dataTypes: prev.dataTypes.filter(d => d !== dataType)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={dataType} className="text-sm capitalize">
                          {dataType.replace('_', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleIssueConsent}>
                    Issue Consent
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {consents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No active consents found.</p>
            <p className="text-sm">Issue a consent to authorize health information sharing.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {consents.map((consent) => (
              <Card key={consent.id} className="border-l-4 border-l-primary">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium capitalize">
                          {consent.scope.purpose.replace('_', ' ')}
                        </h4>
                        {getStatusBadge(consent)}
                        <Badge variant="outline" className={`flex items-center gap-1 ${getFreshnessColor(consent.freshness_score)}`}>
                          <Eye className="h-3 w-3" />
                          {(consent.freshness_score * 100).toFixed(0)}% Fresh
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-muted-foreground mb-1">Authorized Entities</p>
                          <div className="flex flex-wrap gap-1">
                            {consent.scope.entities.slice(0, 3).map((entity) => (
                              <Badge key={entity} variant="secondary" className="text-xs">
                                {entity.replace('_', ' ')}
                              </Badge>
                            ))}
                            {consent.scope.entities.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{consent.scope.entities.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <p className="font-medium text-muted-foreground mb-1">Data Types</p>
                          <div className="flex flex-wrap gap-1">
                            {consent.scope.data_types.slice(0, 2).map((dataType) => (
                              <Badge key={dataType} variant="outline" className="text-xs">
                                {dataType.replace('_', ' ')}
                              </Badge>
                            ))}
                            {consent.scope.data_types.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{consent.scope.data_types.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Issued: {new Date(consent.consent_time).toLocaleDateString()}</span>
                        {consent.expiry && (
                          <span>Expires: {new Date(consent.expiry).toLocaleDateString()}</span>
                        )}
                        <span>ID: {consent.proof_hash}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRevokeConsent(consent)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-3 w-3" />
                        Revoke
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}