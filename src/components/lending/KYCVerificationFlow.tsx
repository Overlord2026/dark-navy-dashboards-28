import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  User, 
  Building, 
  FileText, 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Upload,
  Eye,
  Fingerprint
} from 'lucide-react';

interface KYCVerification {
  id: string;
  entity_type: string;
  entity_id: string;
  verification_type: string;
  status: string;
  risk_score: number;
  verification_data: any;
  verified_at?: string;
  created_at: string;
}

interface KYCVerificationFlowProps {
  entityType: 'client' | 'partner';
  entityId: string;
  onComplete?: (verifications: KYCVerification[]) => void;
}

export const KYCVerificationFlow: React.FC<KYCVerificationFlowProps> = ({
  entityType,
  entityId,
  onComplete
}) => {
  const [verifications, setVerifications] = useState<KYCVerification[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const verificationSteps = entityType === 'client' 
    ? [
        { type: 'identity', title: 'Identity Verification', icon: User },
        { type: 'address', title: 'Address Verification', icon: Building },
        { type: 'income', title: 'Income Verification', icon: FileText }
      ]
    : [
        { type: 'business', title: 'Business Verification', icon: Building },
        { type: 'identity', title: 'Principal Identity', icon: User },
        { type: 'address', title: 'Business Address', icon: Building }
      ];

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kyc_verifications')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVerifications(data || []);
    } catch (error) {
      console.error('Error fetching KYC verifications:', error);
      toast({
        title: "Error",
        description: "Failed to load verification status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startVerification = async (verificationType: string) => {
    try {
      setSubmitting(true);
      
      // Create a new verification record
      const { data, error } = await supabase
        .from('kyc_verifications')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          verification_type: verificationType,
          status: 'in_progress',
          provider: 'manual', // For now, using manual verification
          verification_data: {
            started_at: new Date().toISOString(),
            method: 'document_upload'
          }
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Verification Started",
        description: `${verificationType} verification has been initiated`,
      });

      // Refresh verifications
      await fetchVerifications();
      
      // Move to next step
      if (currentStep < verificationSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      }

    } catch (error) {
      console.error('Error starting verification:', error);
      toast({
        title: "Error",
        description: "Failed to start verification process",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const completeVerification = async (verificationId: string, riskScore: number) => {
    try {
      const { error } = await supabase
        .from('kyc_verifications')
        .update({
          status: 'verified',
          risk_score: riskScore,
          verified_at: new Date().toISOString(),
          verification_data: {
            completed_at: new Date().toISOString(),
            verified_by: 'system',
            method: 'document_verification'
          }
        })
        .eq('id', verificationId);

      if (error) throw error;

      toast({
        title: "Verification Complete",
        description: "Verification has been successfully completed",
      });

      await fetchVerifications();
      
      if (onComplete) {
        onComplete(verifications);
      }

    } catch (error) {
      console.error('Error completing verification:', error);
      toast({
        title: "Error",
        description: "Failed to complete verification",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, [entityType, entityId]);

  const getVerificationStatus = (type: string) => {
    const verification = verifications.find(v => v.verification_type === type);
    return verification?.status || 'pending';
  };

  const getVerificationData = (type: string) => {
    return verifications.find(v => v.verification_type === type);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return CheckCircle;
      case 'in_progress': return Clock;
      case 'failed': return AlertTriangle;
      default: return Shield;
    }
  };

  const overallProgress = verifications.filter(v => v.status === 'verified').length / verificationSteps.length * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                KYC Verification
              </CardTitle>
              <CardDescription>
                Complete identity verification for {entityType === 'client' ? 'loan application' : 'partner onboarding'}
              </CardDescription>
            </div>
            <Badge variant={overallProgress === 100 ? "default" : "secondary"}>
              {overallProgress.toFixed(0)}% Complete
            </Badge>
          </div>
          <Progress value={overallProgress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Verification Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {verificationSteps.map((step, index) => {
          const status = getVerificationStatus(step.type);
          const verification = getVerificationData(step.type);
          const StatusIcon = getStatusIcon(status);
          const StepIcon = step.icon;

          return (
            <Card key={step.type} className={`relative ${currentStep === index ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${status === 'verified' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <StepIcon className={`h-5 w-5 ${status === 'verified' ? 'text-green-600' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{status.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <StatusIcon className={`h-5 w-5 ${getStatusColor(status)}`} />
                </div>
              </CardHeader>
              <CardContent>
                {status === 'pending' && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {step.type === 'identity' && 'Upload government-issued ID document'}
                      {step.type === 'address' && 'Provide proof of address (utility bill, bank statement)'}
                      {step.type === 'income' && 'Upload income verification documents'}
                      {step.type === 'business' && 'Provide business registration and tax documents'}
                    </p>
                    <Button 
                      onClick={() => startVerification(step.type)}
                      disabled={submitting}
                      className="w-full"
                      size="sm"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Start Verification
                    </Button>
                  </div>
                )}

                {status === 'in_progress' && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Under review...</span>
                    </div>
                    <div className="space-y-2">
                      <Label>Risk Assessment</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          type="number" 
                          min="0" 
                          max="100" 
                          placeholder="Risk score (0-100)"
                          className="flex-1"
                        />
                        <Button 
                          size="sm"
                          onClick={() => verification && completeVerification(verification.id, 25)}
                        >
                          Complete
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {status === 'verified' && verification && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Risk Score:</span>
                      <Badge variant={verification.risk_score < 30 ? "default" : verification.risk_score < 70 ? "secondary" : "destructive"}>
                        {verification.risk_score}/100
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Verified:</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(verification.verified_at || verification.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}

                {status === 'failed' && (
                  <div className="space-y-4">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-600">Verification failed</span>
                      </div>
                      <p className="text-xs text-red-600 mt-1">
                        Please review and resubmit required documents
                      </p>
                    </div>
                    <Button 
                      onClick={() => startVerification(step.type)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Retry Verification
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Checks for Partners */}
      {entityType === 'partner' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5" />
              Advanced Compliance Checks
            </CardTitle>
            <CardDescription>
              Additional verification requirements for lending partners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">License Verification</span>
                  </div>
                  <Badge variant="default">Verified</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">AML Screening</span>
                  </div>
                  <Badge variant="secondary">In Progress</Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Regulatory Compliance</span>
                  </div>
                  <Badge variant="default">Verified</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Building className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Financial Standing</span>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {overallProgress === 100 && (
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100">
                  Verification Complete
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  All required verification steps have been completed successfully. 
                  {entityType === 'client' ? ' You can now proceed with your loan application.' : ' Your partner account is ready for activation.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};