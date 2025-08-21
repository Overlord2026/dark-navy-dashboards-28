import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Shield, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { createHealthRDSReceipt, type HealthRDSReceipt } from '@/types/health-rds';
import { useToast } from '@/hooks/use-toast';

interface PatientProfile {
  age: number;
  sex: 'M' | 'F';
  conditions: string[];
}

interface ScreeningRecommendation {
  id: string;
  name: string;
  source: 'USPSTF' | 'Plan';
  grade: 'A' | 'B' | 'C' | 'D';
  dueDate: string;
  status: 'due' | 'overdue' | 'current';
  nextAction: 'order' | 'decline' | 'ask';
  inNetworkProvider?: boolean;
}

export function ScreeningNavigator() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<PatientProfile>({
    age: 0,
    sex: 'F',
    conditions: []
  });
  const [recommendations, setRecommendations] = useState<ScreeningRecommendation[]>([]);
  const [newCondition, setNewCondition] = useState('');

  const generateRecommendations = () => {
    // Mock USPSTF/plan recommendations based on age/sex/conditions
    const recs: ScreeningRecommendation[] = [];

    if (profile.age >= 50) {
      recs.push({
        id: 'colonoscopy',
        name: 'Colonoscopy',
        source: 'USPSTF',
        grade: 'A',
        dueDate: '2024-12-31',
        status: 'due',
        nextAction: 'order',
        inNetworkProvider: true
      });
    }

    if (profile.sex === 'F' && profile.age >= 21) {
      recs.push({
        id: 'cervical_cancer',
        name: 'Cervical Cancer Screening',
        source: 'USPSTF',
        grade: 'A',
        dueDate: '2024-09-15',
        status: 'overdue',
        nextAction: 'order',
        inNetworkProvider: true
      });
    }

    if (profile.age >= 40) {
      recs.push({
        id: 'mammography',
        name: 'Mammography',
        source: 'Plan',
        grade: 'B',
        dueDate: '2025-01-30',
        status: 'current',
        nextAction: 'ask',
        inNetworkProvider: false
      });
    }

    setRecommendations(recs);
  };

  const handleScreeningAction = (rec: ScreeningRecommendation, action: 'approve' | 'deny') => {
    if (action === 'approve') {
      // Check zero-knowledge predicate for in-network provider
      if (!rec.inNetworkProvider) {
      // Emit denial receipt for out-of-network
      const denialReceipt = createHealthRDSReceipt(
        'Clinician',
        'hh_demo_456',
        {
          event: "screening_order",
          plan_id: "plan_demo_screening",
          screening_code: `CPT:${rec.name.toLowerCase()}`,
          network_zkp: {
            in_network: false,
            proof_id: `zkp_${Math.random().toString(36).substr(2, 8)}`
          }
        },
        {
          decision: "deny",
          reason: "out_of_network",
          next_step: "appeal",
          sla: {
            appeal_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        },
        [
          {
            role: 'Clinician',
            user_id: 'c_456',
            ts: new Date().toISOString(),
            action: 'deny'
          }
        ],
        [`screening_${rec.name.toLowerCase().replace(/\s/g, '_')}`, 'out_of_network_denial']
      );

        console.log('Screening Denial Receipt:', denialReceipt);
        
        toast({
          title: "Screening Denied",
          description: "Out-of-network provider. Delta receipt generated with appeal path.",
          variant: "destructive"
        });
        return;
      }

      // Emit approval receipt
      const approvalReceipt = createHealthRDSReceipt(
        'Clinician',
        'hh_demo_456',
        {
          event: "screening_order",
          plan_id: "plan_demo_screening",
          screening_code: `CPT:${rec.name.toLowerCase()}`,
          network_zkp: {
            in_network: true,
            proof_id: `zkp_${Math.random().toString(36).substr(2, 8)}`
          },
          eligibility_zkp: {
            meets_criteria: true,
            proof_id: `zkp_${Math.random().toString(36).substr(2, 8)}`
          }
        },
        {
          decision: "approve",
          reason: "meets_uspstf",
          next_step: "schedule"
        },
        [
          {
            role: 'Clinician',
            user_id: 'c_456',
            ts: new Date().toISOString(),
            action: 'approve'
          },
          {
            role: 'Plan',
            user_id: 'p_789',
            ts: new Date(Date.now() + 30000).toISOString(),
            action: 'accept'
          }
        ],
        [`screening_${rec.name.toLowerCase().replace(/\s/g, '_')}`, 'in_network_approved']
      );

      console.log('Screening Approval Receipt:', approvalReceipt);
      
      toast({
        title: "Screening Approved",
        description: `${rec.name} authorized. Health-RDS receipt generated.`,
      });
    } else {
      // Handle decline action
      const declineReceipt = createHealthRDSReceipt(
        'Retiree',
        'hh_demo_456',
        {
          event: "screening_order",
          plan_id: "plan_demo_screening",
          screening_code: `CPT:${rec.name.toLowerCase()}`
        },
        {
          decision: "deny",
          reason: "not_medically_necessary",
          next_step: "complete"
        },
        [
          {
            role: 'Retiree',
            user_id: 'u_789',
            ts: new Date().toISOString(),
            action: 'deny'
          }
        ],
        [`screening_${rec.name.toLowerCase().replace(/\s/g, '_')}`, 'patient_declined']
      );

      console.log('Screening Decline Receipt:', declineReceipt);
      
      toast({
        title: "Screening Declined",
        description: `Patient decline documented. Receipt generated.`,
      });
    }
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
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Screening & Prevention Navigator
        </CardTitle>
        <CardDescription>
          USPSTF/plan-based screening recommendations with policy gates and zero-knowledge verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Patient Profile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          Generate Screening Recommendations
        </Button>

        {/* Recommendations Table */}
        {recommendations.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Screening Recommendations</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Screening</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Network</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recommendations.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell className="font-medium">{rec.name}</TableCell>
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
                      {rec.inNetworkProvider ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
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
      </CardContent>
    </Card>
  );
}