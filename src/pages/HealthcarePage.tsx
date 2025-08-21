import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Shield, 
  Database, 
  DollarSign,
  Activity,
  FileText,
  Users
} from 'lucide-react';
import { HealthcareGateway } from '@/components/healthcare/HealthcareGateway';
import { HealthcareReceiptViewer } from '@/components/healthcare/HealthcareReceiptViewer';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { usePersonalizationStore } from '@/features/personalization/store';
import { fhirConnector, recordVaultRDS } from '@/features/healthcare';
import { toast } from 'sonner';

export default function HealthcarePage() {
  const { persona, tier } = usePersonalizationStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleDataAccess = async () => {
    setLoading(true);
    try {
      const summary = await fhirConnector.getPatientSummary(persona, tier);
      setPatientData(summary);
      
      // Record vault access
      recordVaultRDS('grant', 'patient_summary', undefined);
      
      toast.success('Health data accessed successfully');
    } catch (error) {
      toast.error('Failed to access health data');
      console.error('Health data access error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = () => {
    // Simulate document upload
    const docId = 'doc_' + Date.now();
    recordVaultRDS('grant', docId, undefined);
    toast.success('Healthcare document uploaded securely');
  };

  const getPersonaSpecificContent = () => {
    if (persona === 'retiree') {
      return {
        title: 'Medicare & Healthcare Planning',
        description: 'Optimize your Medicare benefits and healthcare costs in retirement',
        features: [
          'Medicare supplement analysis',
          'Long-term care planning',
          'Prescription drug optimization',
          'Healthcare cost projections'
        ]
      };
    }

    return {
      title: 'Health Insurance & Benefits',
      description: 'Optimize your health benefits and plan for medical expenses',
      features: [
        'Health insurance comparison',
        'HSA optimization strategies',
        'Preventive care planning',
        'Emergency fund for medical costs'
      ]
    };
  };

  const content = getPersonaSpecificContent();

  return (
    <ThreeColumnLayout activeMainItem="healthcare" title="Healthcare Planning">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Heart className="w-8 h-8 text-primary" />
              {content.title}
            </h1>
            <p className="text-muted-foreground mt-2">{content.description}</p>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="outline">{persona}</Badge>
              <Badge variant="outline">{tier}</Badge>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Health Data Gateway */}
            <HealthcareGateway
              action="health.data.view"
              onAccessGranted={() => console.info('Health data access granted')}
              onAccessDenied={(reasons) => console.warn('Health data access denied:', reasons)}
            >
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Health Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect your health insurance to get personalized recommendations
                    </p>
                    <Button 
                      onClick={handleDataAccess} 
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? 'Connecting...' : 'Access Health Data'}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Secure Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Store healthcare documents with client-side encryption
                    </p>
                    <Button 
                      onClick={handleDocumentUpload}
                      variant="outline"
                      className="w-full"
                    >
                      Upload Document
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </HealthcareGateway>

            {/* Patient Data Display */}
            {patientData && (
              <Card>
                <CardHeader>
                  <CardTitle>Healthcare Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Insurance Plans</h4>
                      {patientData.plans.map((plan: any, idx: number) => (
                        <div key={idx} className="p-3 border rounded-lg">
                          <div className="font-medium">{plan.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Type: {plan.type}
                          </div>
                          {plan.deductible && (
                            <div className="text-sm">
                              Deductible: ${plan.deductible.toLocaleString()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Coverage Status</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant={patientData.hasActiveInsurance ? 'default' : 'destructive'}>
                            {patientData.hasActiveInsurance ? 'Active' : 'Inactive'}
                          </Badge>
                          Insurance
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Cost Estimates</h4>
                      <div className="text-2xl font-bold text-primary">
                        ${patientData.estimatedAnnualCosts.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Estimated annual healthcare costs
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="benefits" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {content.features.map((feature, idx) => (
                <Card key={idx}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Activity className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-medium mb-2">{feature}</h3>
                        <p className="text-sm text-muted-foreground">
                          Optimize your healthcare benefits and reduce costs
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <HealthcareGateway action="health.vault.store">
              <Card>
                <CardHeader>
                  <CardTitle>Healthcare Document Vault</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">Secure Document Storage</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload and manage your healthcare documents with encryption
                    </p>
                    <Button onClick={handleDocumentUpload}>
                      Upload Healthcare Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </HealthcareGateway>
          </TabsContent>

          <TabsContent value="audit">
            <HealthcareReceiptViewer />
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}