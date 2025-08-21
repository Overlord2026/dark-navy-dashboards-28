import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CalculatorTile } from '@/components/ui/CalculatorTile';
import { 
  BookOpen, 
  FileCheck, 
  Shield, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Play,
  Download,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EducationRecord {
  id: string;
  education_type: string;
  completion_date: string;
  expiry_date: string;
  channel: string;
  jurisdiction: string;
  receipt_id: string;
}

interface DisclosurePack {
  id: string;
  channel: string;
  jurisdiction: string;
  disclosure_version: string;
  effective_date: string;
  pack_data: any;
}

export default function NILEducationPage() {
  const [educationRecords, setEducationRecords] = useState<EducationRecord[]>([]);
  const [disclosurePacks, setDisclosurePacks] = useState<DisclosurePack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadEducationData();
    loadDisclosurePacks();
  }, []);

  const loadEducationData = async () => {
    try {
      const { data, error } = await supabase
        .from('nil_education_records')
        .select('*')
        .order('completion_date', { ascending: false });

      if (error) throw error;
      setEducationRecords(data || []);
    } catch (error) {
      console.error('Error loading education records:', error);
    }
  };

  const loadDisclosurePacks = async () => {
    try {
      const { data, error } = await supabase
        .from('nil_disclosure_packs')
        .select('*')
        .order('effective_date', { ascending: false });

      if (error) throw error;
      setDisclosurePacks(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading disclosure packs:', error);
      setIsLoading(false);
    }
  };

  const completeEducationModule = async (educationType: string) => {
    try {
      // Simulate education completion
      const completionData = {
        persona_id: 'demo-persona-id', // In real app, get from auth context
        education_type: educationType,
        completion_date: new Date().toISOString(),
        expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        channel: 'web_platform',
        jurisdiction: 'US',
        content_hash: `sha256:${educationType}_completed_${Date.now()}`
      };

      const { data, error } = await supabase
        .from('nil_education_records')
        .insert(completionData)
        .select()
        .single();

      if (error) throw error;

      // Generate receipt
      await generateEducationReceipt(data.id, educationType);
      
      toast({
        title: "Education Module Completed!",
        description: `${educationType} training completed with receipt generated`,
      });

      loadEducationData();
    } catch (error) {
      console.error('Error completing education:', error);
      toast({
        title: "Error",
        description: "Failed to complete education module",
        variant: "destructive"
      });
    }
  };

  const generateEducationReceipt = async (recordId: string, educationType: string) => {
    // Generate Decision-RDS receipt for education completion
    const receiptData = {
      receipt_type: 'Decision-RDS',
      event_type: 'education_completion',
      entity_type: 'education_record',
      entity_id: recordId,
      policy_hash: `sha256:${educationType}_policy`,
      inputs_hash: `sha256:${educationType}_completion`,
      decision_outcome: 'completed',
      reason_codes: ['education_requirements_met'],
      explanation: `NIL education module ${educationType} successfully completed`,
      merkle_leaf: `leaf:${btoa(educationType + Date.now()).substring(0, 32)}`,
      privacy_level: 'medium'
    };

    await supabase.from('nil_receipts').insert(receiptData);
  };

  const acknowledgeDisclosure = async (packId: string, channel: string) => {
    try {
      // Generate Consent-RDS receipt for disclosure acknowledgment
      const receiptData = {
        receipt_type: 'Consent-RDS',
        event_type: 'disclosure_acknowledgment',
        entity_type: 'disclosure_pack',
        entity_id: packId,
        policy_hash: `sha256:${channel}_disclosure_policy`,
        inputs_hash: `sha256:${packId}_acknowledgment`,
        decision_outcome: 'acknowledged',
        reason_codes: ['disclosure_consent_granted'],
        explanation: `Disclosure pack for ${channel} acknowledged and consented`,
        merkle_leaf: `leaf:${btoa(packId + Date.now()).substring(0, 32)}`,
        privacy_level: 'high'
      };

      const { error } = await supabase.from('nil_receipts').insert(receiptData);
      if (error) throw error;

      toast({
        title: "Disclosure Acknowledged",
        description: `${channel} disclosure pack acknowledged with consent receipt`,
      });

    } catch (error) {
      console.error('Error acknowledging disclosure:', error);
      toast({
        title: "Error",
        description: "Failed to acknowledge disclosure",
        variant: "destructive"
      });
    }
  };

  const getEducationStatus = (educationType: string) => {
    const record = educationRecords.find(r => r.education_type === educationType);
    if (!record) return { status: 'not_started', daysRemaining: null };
    
    const expiryDate = new Date(record.expiry_date);
    const now = new Date();
    const daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining <= 0) return { status: 'expired', daysRemaining: 0 };
    if (daysRemaining <= 30) return { status: 'expiring', daysRemaining };
    return { status: 'current', daysRemaining };
  };

  const educationModules = [
    {
      type: 'athlete_nil_basics',
      title: 'NIL Basics for Athletes',
      description: 'Fundamental concepts of name, image, and likeness rights',
      entitlement: 'basic' as const,
      duration: '30 minutes'
    },
    {
      type: 'brand_nil_compliance',
      title: 'Brand NIL Compliance',
      description: 'Legal requirements for brand partnerships with athletes',
      entitlement: 'premium' as const,
      duration: '45 minutes'
    },
    {
      type: 'advisor_nil_planning',
      title: 'NIL Financial Planning',
      description: 'Tax implications and financial planning for NIL income',
      entitlement: 'elite' as const,
      duration: '60 minutes'
    }
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-gold-base mx-auto mb-4"></div>
            <p className="text-slate/80">Loading education modules...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-xl font-semibold text-ink">NIL Education & Disclosures</h1>
        <p className="text-slate/80 text-sm max-w-2xl mx-auto">
          Complete required education modules and acknowledge disclosure packs to meet 
          compliance requirements for NIL activities.
        </p>
      </div>

      {/* Education Progress Overview */}
      <Card className="rounded-2xl shadow-soft">
        <CardHeader className="p-6">
          <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Education Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {educationModules.map((module) => {
              const status = getEducationStatus(module.type);
              return (
                <div key={module.type} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-ink">{module.title}</h4>
                    <Badge 
                      className={
                        status.status === 'current' ? 'bg-mint text-ink' :
                        status.status === 'expiring' ? 'bg-gold-base text-ink' :
                        status.status === 'expired' ? 'bg-alert text-white' :
                        'bg-slate/30 text-ink'
                      }
                    >
                      {status.status === 'current' ? 'Current' :
                       status.status === 'expiring' ? `${status.daysRemaining}d left` :
                       status.status === 'expired' ? 'Expired' : 'Not Started'}
                    </Badge>
                  </div>
                  
                  <Progress 
                    value={status.status === 'not_started' ? 0 : 100} 
                    className="h-2"
                  />
                  
                  <div className="flex items-center justify-between text-xs text-slate/80">
                    <span>{module.duration}</span>
                    {status.status !== 'current' && (
                      <Button 
                        size="sm" 
                        variant="gold"
                        onClick={() => completeEducationModule(module.type)}
                        className="h-6 px-2 text-xs"
                      >
                        {status.status === 'not_started' ? 'Start' : 'Renew'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Education Modules Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">Available Education Modules</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {educationModules.map((module) => (
            <CalculatorTile
              key={module.type}
              label={module.title}
              description={module.description}
              entitlement={module.entitlement}
              onRun={() => completeEducationModule(module.type)}
              onDetails={() => toast({ title: "Module Details", description: module.description })}
            />
          ))}
        </div>
      </div>

      {/* Disclosure Packs */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">Disclosure Packs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {disclosurePacks.map((pack) => (
            <Card key={pack.id} className="rounded-2xl shadow-soft">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    {pack.channel.replace('_', ' ').toUpperCase()} Disclosures
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    v{pack.disclosure_version}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 pt-0 space-y-3">
                <p className="text-sm text-slate/80">
                  Required disclosures for {pack.channel} activities in {pack.jurisdiction}
                </p>
                
                <div className="space-y-2">
                  {pack.pack_data.disclosures?.map((disclosure: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <CheckCircle className="h-3 w-3 text-mint" />
                      <span className="text-slate/80">{disclosure.replace('_', ' ')}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="gold" 
                    size="sm"
                    onClick={() => acknowledgeDisclosure(pack.id, pack.channel)}
                    className="flex-1 text-xs"
                  >
                    Acknowledge & Consent
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Compliance Status Summary */}
      <Card className="rounded-2xl shadow-soft bg-sand/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-gold-base mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-ink">Compliance Status</h3>
              <p className="text-xs text-ink/70 mt-1">
                Education modules and disclosure acknowledgments generate Decision-RDS and Consent-RDS 
                receipts automatically. These receipts are used by policy gates to verify compliance 
                before allowing NIL activities.
              </p>
              <div className="flex gap-2 mt-3">
                <Button variant="ghost" size="sm" className="text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Export Certificates
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  <FileCheck className="h-3 w-3 mr-1" />
                  View Receipts
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}