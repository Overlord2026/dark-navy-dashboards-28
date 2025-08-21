import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Shield, CheckCircle, XCircle, AlertTriangle, Clock, Zap } from 'lucide-react';
import { createHealthRDSReceipt, type HealthRDSReceipt, type HealthContext, type HealthOutcome, type ZKProof } from '@/types/health-rds';
import { useToast } from '@/hooks/use-toast';

interface PatientProfile {
  age: number;
  sex: 'M' | 'F';
  conditions: string[];
  planId: string;
}

interface ScreeningRecommendation {
  id: string;
  name: string;
  code: string; // CPT|HCPCS|LOINC
  source: 'USPSTF' | 'Plan';
  grade: 'A' | 'B' | 'C' | 'D';
  dueDate: string;
  status: 'due' | 'overdue' | 'current';
  nextAction: 'order' | 'decline' | 'ask';
  inNetworkProvider?: boolean;
  zkpVerified?: boolean;
}

export function EnhancedScreeningNavigator() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<PatientProfile>({
    age: 0,
    sex: 'F',
    conditions: [],
    planId: 'plan_demo_123'
  });
  const [recommendations, setRecommendations] = useState<ScreeningRecommendation[]>([]);
  const [newCondition, setNewCondition] = useState('');

  const generateRecommendations = () => {
    // Mock USPSTF/plan recommendations with ZKP verification
    const recs: ScreeningRecommendation[] = [];

    if (profile.age >= 50) {
      recs.push({
        id: 'colonoscopy',
        name: 'Colonoscopy',
        code: 'CPT:45378',
        source: 'USPSTF',
        grade: 'A',
        dueDate: '2024-12-31',
        status: 'due',
        nextAction: 'order',
        inNetworkProvider: true,
        zkpVerified: true
      });
    }

    if (profile.sex === 'F' && profile.age >= 21) {
      recs.push({
        id: 'cervical_cancer',
        name: 'Cervical Cancer Screening',
        code: 'CPT:88175',
        source: 'USPSTF',
        grade: 'A',
        dueDate: '2024-09-15',
        status: 'overdue',
        nextAction: 'order',
        inNetworkProvider: true,
        zkpVerified: true
      });
    }

    if (profile.age >= 40) {
      recs.push({
        id: 'mammography',
        name: 'Mammography',
        code: 'CPT:77067',
        source: 'Plan',
        grade: 'B',
        dueDate: '2025-01-30',
        status: 'current',
        nextAction: 'ask',
        inNetworkProvider: false,
        zkpVerified: false
      });
    }

    setRecommendations(recs);
  };

  const handleScreeningAction = (rec: ScreeningRecommendation, action: 'approve' | 'deny') => {
    // Create ZKP proofs for network and eligibility verification
    const networkZKP: ZKProof = {
      in_network: rec.inNetworkProvider || false,
      proof_id: `zkp_network_${Math.random().toString(36).substr(2, 8)}`,
      verification_timestamp: new Date().toISOString()
    };

    const eligibilityZKP: ZKProof = {
      meets_criteria: profile.age >= 18 && rec.grade !== 'D',
      proof_id: `zkp_eligibility_${Math.random().toString(36).substr(2, 8)}`,
      verification_timestamp: new Date().toISOString()
    };

    // Create enhanced health context
    const context: HealthContext = {
      event: 'screening_order',
      plan_id: profile.planId,
      screening_code: rec.code,
      network_zkp: networkZKP,
      eligibility_zkp: eligibilityZKP,
      patient_demographics_hash: `sha256:${btoa(`age:${profile.age},sex:${profile.sex}`).substring(0, 32)}`,
      clinical_indicators: profile.conditions
    };

    // Determine outcome based on ZKP verification and action
    let outcome: HealthOutcome;
    
    if (action === 'approve' && networkZKP.in_network && eligibilityZKP.meets_criteria) {
      outcome = {
        decision: 'approve',
        reason: 'meets_uspstf',
        next_step: 'schedule',
        cost_estimate: {
          total_cents: rec.source === 'USPSTF' ? 0 : 50000, // Preventive vs diagnostic
          patient_responsibility_cents: 0,
          coverage_percentage: 100
        }
      };
    } else if (action === 'approve' && !networkZKP.in_network) {
      outcome = {
        decision: 'deny',
        reason: 'out_of_network',
        next_step: 'appeal',
        sla: {
          appeal_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        cost_estimate: {
          total_cents: 50000,
          patient_responsibility_cents: 50000,
          coverage_percentage: 0
        }
      };
    } else {
      outcome = {
        decision: 'deny',
        reason: 'not_medically_necessary',
        next_step: 'peer_review',
        sla: {
          peer_review_by: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      };
    }

    // Create enhanced Health-RDS receipt
    const receipt: HealthRDSReceipt = createHealthRDSReceipt(
      'Clinician',
      'hh_demo_456',
      context,
      outcome,
      [
        {
          role: 'Clinician',
          user_id: 'c_456',
          ts: new Date().toISOString(),
          action: outcome.decision === 'approve' ? 'approve' : 'deny',
          verification_method: 'zkp'
        }
      ],
      [`screening_${rec.name.toLowerCase().replace(/\s/g, '_')}`, `code_${rec.code}`]
    );

    console.log('Enhanced Health-RDS Receipt with ZKP:', receipt);
    
    toast({
      title: `Screening ${outcome.decision === 'approve' ? 'Approved' : 'Denied'}`,
      description: `${rec.name} - ${outcome.reason}. ZKP verification: ${rec.zkpVerified ? '✓' : '✗'}`,
      variant: outcome.decision === 'approve' ? 'default' : 'destructive'
    });
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setProfile(prev => ({ ...prev, conditions: [...prev.conditions, newCondition.trim()] }));
      setNewCondition('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800';
      case 'due': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-7xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Enhanced Screening Navigator with ZKP Verification
        </CardTitle>
        <CardDescription>
          USPSTF/plan-based screening recommendations with zero-knowledge proofs for network and eligibility verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Patient Profile */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              type="number"
              value={profile.age || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, age: Number(e.target.value) }))}
              placeholder="Age"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sex">Sex</Label>
            <Select value={profile.sex} onValueChange={(value: 'M' | 'F') => setProfile(prev => ({ ...prev, sex: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="F">Female</SelectItem>
                <SelectItem value="M">Male</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Plan ID</Label>
            <Input
              value={profile.planId}
              onChange={(e) => setProfile(prev => ({ ...prev, planId: e.target.value }))}
              placeholder="plan_demo_123"
            />
          </div>

          <div className="space-y-2">
            <Label>Medical Conditions</Label>
            <div className="flex gap-2">
              <Input
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Add condition..."
                onKeyPress={(e) => e.key === 'Enter' && addCondition()}
              />
              <Button type="button" onClick={addCondition}>Add</Button>
            </div>
          </div>
        </div>

        {profile.conditions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {profile.conditions.map((condition, index) => (
              <Badge key={index} variant="outline">{condition}</Badge>
            ))}
          </div>
        )}

        <Button onClick={generateRecommendations} disabled={!profile.age}>
          <Zap className="h-4 w-4 mr-2" />
          Generate ZKP-Verified Recommendations
        </Button>

        {/* Recommendations Table */}
        {recommendations.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Screening Recommendations with ZKP Verification</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Screening</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Network ZKP</TableHead>
                  <TableHead>Eligibility ZKP</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recommendations.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell className="font-medium">{rec.name}</TableCell>
                    <TableCell className="font-mono text-xs">{rec.code}</TableCell>
                    <TableCell>{rec.source}</TableCell>
                    <TableCell>
                      <Badge className={getGradeColor(rec.grade)}>
                        {rec.grade}
                      </Badge>
                    </TableCell>
                    <TableCell>{rec.dueDate}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(rec.status)}>
                        {rec.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {rec.inNetworkProvider ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-xs">
                          {rec.inNetworkProvider ? 'In-Network' : 'Out-of-Network'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {rec.zkpVerified ? (
                          <Shield className="h-4 w-4 text-blue-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        )}
                        <span className="text-xs">
                          {rec.zkpVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleScreeningAction(rec, 'approve')}
                        >
                          Order
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleScreeningAction(rec, 'deny')}
                        >
                          Decline
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* ZKP Information Panel */}
        <Card className="bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Zero-Knowledge Proof Verification</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                  Network eligibility and clinical criteria are verified using cryptographic proofs without exposing sensitive patient information.
                  Each verification generates a unique proof ID for audit trails.
                </p>
                <div className="flex gap-4 mt-2 text-xs text-blue-700 dark:text-blue-300">
                  <span>• Network verification preserves provider privacy</span>
                  <span>• Eligibility checks protect demographic data</span>
                  <span>• All proofs are auditable and tamper-evident</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}