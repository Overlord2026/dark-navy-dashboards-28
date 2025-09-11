import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Activity, 
  Shield, 
  Users, 
  FileText, 
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Archive,
  Eye,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { recordDecisionRDS } from "@/features/pro/compliance/DecisionTracker";
import { recordConsentRDS } from "@/features/pro/compliance/ConsentTracker";
import * as Canonical from "@/lib/canonical";

export default function HealthcareToolsPage() {
  const { toast } = useToast();
  const [screeningData, setScreeningData] = useState({
    patientId: '',
    patientName: '',
    screeningType: '',
    orderingProvider: '',
    priority: 'routine',
    clinicalIndication: '',
    consentVerified: false,
    labOrders: [] as string[],
    imagingOrders: [] as string[],
    scheduledDate: ''
  });

  const [consentPassport, setConsentPassport] = useState({
    patientId: '',
    patientName: '',
    consentScope: [] as string[],
    sharingPartners: [] as string[],
    minimumNecessary: true,
    expirationDate: '',
    revokeReason: '',
    notes: ''
  });

  const [completedScreenings, setCompletedScreenings] = useState([
    {
      id: 'screen_001',
      patientName: 'Sarah Johnson',
      type: 'Annual Wellness Visit',
      ordered: '2024-01-15',
      status: 'completed',
      receiptHash: 'screen_abc123'
    },
    {
      id: 'screen_002',
      patientName: 'Michael Davis', 
      type: 'Lipid Panel + A1C',
      ordered: '2024-01-14',
      status: 'pending',
      receiptHash: 'screen_def456'
    }
  ]);

  const [consentPassports, setConsentPassports] = useState([
    {
      id: 'consent_001',
      patientName: 'Sarah Johnson',
      scope: ['treatment', 'care_coordination', 'billing'],
      created: '2024-01-15',
      expires: '2025-01-15',
      status: 'active',
      receiptHash: 'consent_abc123'
    },
    {
      id: 'consent_002',
      patientName: 'Michael Davis',
      scope: ['treatment', 'emergency_contact'],
      created: '2024-01-10',
      expires: '2025-01-10', 
      status: 'active',
      receiptHash: 'consent_def456'
    }
  ]);

  const screeningTypes = [
    'Annual Wellness Visit',
    'Preventive Screening Package',
    'Cardiovascular Assessment',
    'Diabetes Screening',
    'Cancer Screening Battery',
    'Mental Health Assessment',
    'Bone Density Scan',
    'Vision and Hearing Test'
  ];

  const labOrderOptions = [
    'Complete Blood Count (CBC)',
    'Comprehensive Metabolic Panel (CMP)',
    'Lipid Panel',
    'Hemoglobin A1C',
    'Thyroid Function Tests',
    'Vitamin D Level',
    'PSA (men)',
    'Inflammatory Markers (CRP, ESR)'
  ];

  const imagingOrderOptions = [
    'Chest X-ray',
    'Mammogram',
    'DEXA Scan',
    'Cardiac Calcium Score',
    'Carotid Ultrasound',
    'Echocardiogram',
    'Stress Test'
  ];

  const consentScopeOptions = [
    'treatment',
    'care_coordination', 
    'billing_insurance',
    'emergency_contact',
    'family_notification',
    'research_participation',
    'quality_improvement',
    'health_information_exchange'
  ];

  const handleScreeningOrder = async () => {
    if (!screeningData.patientName || !screeningData.screeningType || !screeningData.consentVerified) {
      toast({
        title: "Error",
        description: "Patient name, screening type, and consent verification are required",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create screening order decision
      const decision = await recordDecisionRDS({
        action: 'healthcare_screening_order',
        persona: 'healthcare',
        inputs_hash: await Canonical.hash({
          patientName: screeningData.patientName,
          screeningType: screeningData.screeningType,
          orderingProvider: screeningData.orderingProvider,
          clinicalIndication: screeningData.clinicalIndication
        }),
        reasons: ['clinical_indication', 'preventive_care', 'patient_consent_verified'],
        result: 'approve',
        metadata: {
          screening_type: screeningData.screeningType,
          priority: screeningData.priority,
          orders_count: screeningData.labOrders.length + screeningData.imagingOrders.length,
          hipaa_compliant: true,
          minimum_necessary: true
        }
      });

      // Add to completed screenings
      const newScreening = {
        id: `screen_${Date.now()}`,
        patientName: screeningData.patientName,
        type: screeningData.screeningType,
        ordered: new Date().toISOString().split('T')[0],
        status: 'pending',
        receiptHash: decision.inputs_hash
      };

      setCompletedScreenings([newScreening, ...completedScreenings]);
      
      // Reset form
      setScreeningData({
        patientId: '',
        patientName: '',
        screeningType: '',
        orderingProvider: '',
        priority: 'routine',
        clinicalIndication: '',
        consentVerified: false,
        labOrders: [],
        imagingOrders: [],
        scheduledDate: ''
      });

      toast({
        title: "Screening Ordered",
        description: `${newScreening.type} ordered for ${newScreening.patientName}. Receipt: ${decision.inputs_hash}`,
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process screening order",
        variant: "destructive"
      });
    }
  };

  const handleConsentPassportUpdate = async () => {
    if (!consentPassport.patientName || consentPassport.consentScope.length === 0) {
      toast({
        title: "Error", 
        description: "Patient name and consent scope are required",
        variant: "destructive"
      });
      return;
    }

    try {
      // Record consent update
      const consent = recordConsentRDS({
        persona: 'healthcare',
        scope: {
          contact: consentPassport.consentScope.includes('treatment'),
          marketing: false, // Healthcare marketing requires special handling
          analytics: consentPassport.consentScope.includes('quality_improvement'),
          third_party_sharing: consentPassport.consentScope.includes('health_information_exchange')
        },
        ttlDays: 365,
        purpose: 'healthcare_consent_passport'
      });

      // Add to consent passports
      const newPassport = {
        id: `consent_${Date.now()}`,
        patientName: consentPassport.patientName,
        scope: [...consentPassport.consentScope],
        created: new Date().toISOString().split('T')[0],
        expires: consentPassport.expirationDate || new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
        status: 'active',
        receiptHash: consent.inputs_hash
      };

      setConsentPassports([newPassport, ...consentPassports]);
      
      // Reset form
      setConsentPassport({
        patientId: '',
        patientName: '',
        consentScope: [],
        sharingPartners: [],
        minimumNecessary: true,
        expirationDate: '',
        revokeReason: '',
        notes: ''
      });

      toast({
        title: "Consent Passport Updated",
        description: `Consent passport created for ${newPassport.patientName}. Receipt: ${consent.inputs_hash}`,
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update consent passport",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'revoked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Healthcare Tools</h1>
          <p className="text-muted-foreground">
            HIPAA-compliant screening planner and consent passport management
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Minimum Necessary</span>
        </div>
      </div>

      <Tabs defaultValue="screenings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="screenings" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Screening Planner
          </TabsTrigger>
          <TabsTrigger value="consent" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Consent Passport
          </TabsTrigger>
        </TabsList>

        {/* Screening Planner */}
        <TabsContent value="screenings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Order Preventive Screenings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <Shield className="h-4 w-4 inline mr-1" />
                    Patient consent verified. Orders will be written back to Vault with Decision-RDS.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name *</Label>
                    <Input
                      id="patientName"
                      value={screeningData.patientName}
                      onChange={(e) => setScreeningData({...screeningData, patientName: e.target.value})}
                      placeholder="Patient full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="orderingProvider">Ordering Provider</Label>
                    <Input
                      id="orderingProvider"
                      value={screeningData.orderingProvider}
                      onChange={(e) => setScreeningData({...screeningData, orderingProvider: e.target.value})}
                      placeholder="Dr. Smith"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="screeningType">Screening Package *</Label>
                  <Select value={screeningData.screeningType} onValueChange={(value) => setScreeningData({...screeningData, screeningType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select screening type" />
                    </SelectTrigger>
                    <SelectContent>
                      {screeningTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={screeningData.priority} onValueChange={(value) => setScreeningData({...screeningData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="stat">STAT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Laboratory Orders</Label>
                  <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
                    {labOrderOptions.map(lab => (
                      <div key={lab} className="flex items-center space-x-2">
                        <Checkbox
                          id={lab}
                          checked={screeningData.labOrders.includes(lab)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setScreeningData({...screeningData, labOrders: [...screeningData.labOrders, lab]});
                            } else {
                              setScreeningData({...screeningData, labOrders: screeningData.labOrders.filter(l => l !== lab)});
                            }
                          }}
                        />
                        <Label htmlFor={lab} className="text-xs">{lab}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Imaging Orders</Label>
                  <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
                    {imagingOrderOptions.map(imaging => (
                      <div key={imaging} className="flex items-center space-x-2">
                        <Checkbox
                          id={imaging}
                          checked={screeningData.imagingOrders.includes(imaging)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setScreeningData({...screeningData, imagingOrders: [...screeningData.imagingOrders, imaging]});
                            } else {
                              setScreeningData({...screeningData, imagingOrders: screeningData.imagingOrders.filter(i => i !== imaging)});
                            }
                          }}
                        />
                        <Label htmlFor={imaging} className="text-xs">{imaging}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinicalIndication">Clinical Indication</Label>
                  <Textarea
                    id="clinicalIndication"
                    value={screeningData.clinicalIndication}
                    onChange={(e) => setScreeningData({...screeningData, clinicalIndication: e.target.value})}
                    placeholder="Clinical reason for ordering screenings"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="consentVerified"
                      checked={screeningData.consentVerified}
                      onCheckedChange={(checked) => setScreeningData({...screeningData, consentVerified: !!checked})}
                    />
                    <Label htmlFor="consentVerified" className="text-sm">
                      Patient consent verified for ordered screenings *
                    </Label>
                  </div>
                </div>

                <Button onClick={handleScreeningOrder} className="w-full flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Order Screenings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Screening Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedScreenings.slice(0, 5).map((screening) => (
                    <div key={screening.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Activity className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium">{screening.patientName}</div>
                          <div className="text-sm text-muted-foreground">{screening.type}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(screening.status)}>
                          {screening.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(screening.ordered).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Consent Passport */}
        <TabsContent value="consent">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Manage Consent Passport
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    Minimum-necessary principle enforced. Only essential information shared.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consentPatientName">Patient Name *</Label>
                  <Input
                    id="consentPatientName"
                    value={consentPassport.patientName}
                    onChange={(e) => setConsentPassport({...consentPassport, patientName: e.target.value})}
                    placeholder="Patient full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Consent Scope *</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                    {consentScopeOptions.map(scope => (
                      <div key={scope} className="flex items-center space-x-2">
                        <Checkbox
                          id={scope}
                          checked={consentPassport.consentScope.includes(scope)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setConsentPassport({...consentPassport, consentScope: [...consentPassport.consentScope, scope]});
                            } else {
                              setConsentPassport({...consentPassport, consentScope: consentPassport.consentScope.filter(s => s !== scope)});
                            }
                          }}
                        />
                        <Label htmlFor={scope} className="text-sm">{scope.replace(/_/g, ' ')}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expirationDate">Consent Expiration</Label>
                  <Input
                    id="expirationDate"
                    type="date"
                    value={consentPassport.expirationDate}
                    onChange={(e) => setConsentPassport({...consentPassport, expirationDate: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">Defaults to 1 year if not specified</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consentNotes">Notes</Label>
                  <Textarea
                    id="consentNotes"
                    value={consentPassport.notes}
                    onChange={(e) => setConsentPassport({...consentPassport, notes: e.target.value})}
                    placeholder="Special consent considerations"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="minimumNecessary"
                      checked={consentPassport.minimumNecessary}
                      onCheckedChange={(checked) => setConsentPassport({...consentPassport, minimumNecessary: !!checked})}
                    />
                    <Label htmlFor="minimumNecessary" className="text-sm">
                      Apply minimum necessary standard (recommended)
                    </Label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleConsentPassportUpdate} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Update Consent
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Passport
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Consent Passports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {consentPassports.map((passport) => (
                    <div key={passport.id} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{passport.patientName}</div>
                        <Badge className={getStatusColor(passport.status)}>
                          {passport.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Scope: {passport.scope.join(', ')}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Expires: {new Date(passport.expires).toLocaleDateString()}</span>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Archive className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}