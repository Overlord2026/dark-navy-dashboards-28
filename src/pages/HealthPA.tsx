import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Shield,
  FileCheck,
  User,
  Calendar,
  DollarSign
} from 'lucide-react';
import { buildPaPack, gatePaRequest, recordPARDS, type PaPackFacts, type PARDS } from '@/features/health/pa/api';
import { type InsurancePlan, type Medication, type Allergy } from '@/features/health/pa/rules';

// Mock data for demonstration
const mockPlan: InsurancePlan = {
  id: 'plan-001',
  name: 'Blue Cross PPO Plus',
  type: 'ppo',
  formulary: ['metformin', 'lisinopril', 'atorvastatin'],
  exclusions: ['cosmetic procedures']
};

const mockMedications: Medication[] = [
  { name: 'metformin', dosage: '500mg', frequency: 'twice daily', route: 'oral' },
  { name: 'lisinopril', dosage: '10mg', frequency: 'once daily', route: 'oral' }
];

const mockAllergies: Allergy[] = [
  { substance: 'penicillin', severity: 'moderate', reaction: 'rash' }
];

interface PendingRequest {
  id: string;
  patientAge: number;
  procedure: {
    cpt: string;
    description: string;
    urgency: 'routine' | 'urgent' | 'emergent';
  };
  diagnoses: string[];
  status: 'pending' | 'processing' | 'approved' | 'denied';
  submittedAt: string;
  lastPARDS?: PARDS;
}

const mockRequests: PendingRequest[] = [
  {
    id: 'req-001',
    patientAge: 65,
    procedure: {
      cpt: '45378',
      description: 'Diagnostic Colonoscopy',
      urgency: 'routine'
    },
    diagnoses: ['K59.00', 'R19.7'],
    status: 'pending',
    submittedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'req-002',
    patientAge: 42,
    procedure: {
      cpt: '70552',
      description: 'MRI Brain with Contrast',
      urgency: 'urgent'
    },
    diagnoses: ['G44.1', 'R51'],
    status: 'processing',
    submittedAt: '2025-01-14T14:20:00Z'
  },
  {
    id: 'req-003',
    patientAge: 55,
    procedure: {
      cpt: '78452',
      description: 'Myocardial Perfusion Study',
      urgency: 'routine'
    },
    diagnoses: ['Z01.818'],
    status: 'approved',
    submittedAt: '2025-01-13T09:15:00Z',
    lastPARDS: {
      type: 'PA-RDS',
      action: 'approve',
      procedure_cpt: '78452',
      diagnosis_icd: 'Z01.818',
      approved: true,
      reasons: ['All criteria met - approved'],
      inputs_hash: 'abc123def456',
      policy_version: 'PA-2025.08',
      ts: '2025-01-13T09:20:00Z',
      coverage_details: {
        covered: true,
        copay_amount: 150,
        requires_prior_auth: true
      }
    }
  }
];

export default function HealthPA() {
  const [requests, setRequests] = useState<PendingRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<PendingRequest | null>(null);
  const [evidencePack, setEvidencePack] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const buildPaPackForRequest = (request: PendingRequest) => {
    const facts: PaPackFacts = {
      patientAge: request.patientAge,
      diagnoses: request.diagnoses,
      medications: mockMedications,
      allergies: mockAllergies,
      priorTests: ['imaging:chest_xray_2024', 'lab:cbc_2024'],
      symptoms: ['chest_pain', 'shortness_of_breath'],
      procedure: request.procedure,
      plan: mockPlan
    };

    const pack = buildPaPack(facts);
    setEvidencePack({ request, pack, facts });
    setSelectedRequest(request);
  };

  const processGateAndPARDS = async (request: PendingRequest) => {
    if (!evidencePack || evidencePack.request.id !== request.id) {
      buildPaPackForRequest(request);
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const gateResult = gatePaRequest(evidencePack.facts);
      const paRDS = recordPARDS(evidencePack.facts, gateResult, evidencePack.pack.hash);
      
      // Update request status
      const updatedRequests = requests.map(req => 
        req.id === request.id 
          ? {
              ...req,
              status: (paRDS.approved ? 'approved' : 'denied') as 'approved' | 'denied',
              lastPARDS: paRDS
            }
          : req
      );
      
      setRequests(updatedRequests);
      setSelectedRequest(updatedRequests.find(r => r.id === request.id) || null);
      
    } catch (error) {
      console.error('PA processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'denied': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'processing': return <Clock className="h-4 w-4 text-warning animate-pulse" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    const variants = {
      routine: 'default',
      urgent: 'warning',
      emergent: 'destructive'
    } as const;
    
    return <Badge variant={variants[urgency as keyof typeof variants]}>{urgency}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Prior Authorization</h1>
          <p className="text-muted-foreground">PA evidence packs and coverage gating</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pending PA Requests
            </CardTitle>
            <CardDescription>
              Prior authorization requests requiring review
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedRequest?.id === request.id 
                    ? 'border-primary bg-muted/50' 
                    : 'hover:bg-muted/20'
                }`}
                onClick={() => setSelectedRequest(request)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <span className="font-medium">{request.procedure.description}</span>
                      {getUrgencyBadge(request.procedure.urgency)}
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        Age {request.patientAge} • CPT: {request.procedure.cpt}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(request.submittedAt).toLocaleDateString()}
                      </div>
                    </div>

                    {request.lastPARDS && (
                      <div className="text-xs text-muted-foreground">
                        Last PA-RDS: {request.lastPARDS.action} • {request.lastPARDS.reasons[0]}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        buildPaPackForRequest(request);
                      }}
                      className="text-xs"
                    >
                      Build PA Pack
                    </Button>
                    
                    <Button
                      variant="default"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        processGateAndPARDS(request);
                      }}
                      disabled={isProcessing}
                      className="text-xs"
                    >
                      {isProcessing ? 'Processing...' : 'Gate & Issue PA-RDS'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Evidence Pack / PA-RDS Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              {evidencePack ? 'Evidence Pack' : selectedRequest?.lastPARDS ? 'PA-RDS Receipt' : 'Select Request'}
            </CardTitle>
            <CardDescription>
              {evidencePack 
                ? 'Built evidence package for PA submission'
                : selectedRequest?.lastPARDS 
                ? 'Prior authorization decision receipt'
                : 'Select a request to view details'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {evidencePack ? (
              <div className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium">Evidence Pack Hash</div>
                  <div className="text-xs text-muted-foreground font-mono">{evidencePack.pack.hash}</div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Patient Profile</div>
                  <div className="text-sm text-muted-foreground">{evidencePack.pack.summary.patientProfile}</div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Clinical Indication</div>
                  <div className="text-sm text-muted-foreground">{evidencePack.pack.summary.clinicalIndication}</div>
                </div>

                <Separator />

                <div>
                  <div className="text-sm font-medium mb-3">Required Documents ({evidencePack.pack.docIds.length})</div>
                  <div className="space-y-2">
                    {evidencePack.pack.summary.supportingEvidence.map((doc: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        {doc.charAt(0).toUpperCase() + doc.slice(1)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : selectedRequest?.lastPARDS ? (
              <div className="space-y-4">
                <div className={`p-3 rounded-lg ${
                  selectedRequest.lastPARDS.approved 
                    ? 'bg-success/10 border border-success/20' 
                    : 'bg-destructive/10 border border-destructive/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedRequest.lastPARDS.approved ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span className="font-medium">
                      {selectedRequest.lastPARDS.approved ? 'APPROVED' : 'DENIED'}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Action: {selectedRequest.lastPARDS.action}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">PA-RDS Details</div>
                  <div className="space-y-2 text-sm">
                    <div>Procedure: {selectedRequest.lastPARDS.procedure_cpt}</div>
                    <div>Diagnosis: {selectedRequest.lastPARDS.diagnosis_icd}</div>
                    <div>Policy Version: {selectedRequest.lastPARDS.policy_version}</div>
                    <div className="text-xs text-muted-foreground">
                      Timestamp: {new Date(selectedRequest.lastPARDS.ts).toLocaleString()}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="text-sm font-medium mb-2">Decision Reasons</div>
                  <div className="space-y-1">
                    {selectedRequest.lastPARDS.reasons.map((reason, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        • {reason}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedRequest.lastPARDS.missingEvidence && (
                  <div>
                    <div className="text-sm font-medium mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      Missing Evidence
                    </div>
                    <div className="space-y-1">
                      {selectedRequest.lastPARDS.missingEvidence.map((evidence, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {evidence}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRequest.lastPARDS.coverage_details && (
                  <div>
                    <div className="text-sm font-medium mb-2 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Coverage Details
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>Covered: {selectedRequest.lastPARDS.coverage_details.covered ? 'Yes' : 'No'}</div>
                      {selectedRequest.lastPARDS.coverage_details.copay_amount && (
                        <div>Copay: ${selectedRequest.lastPARDS.coverage_details.copay_amount}</div>
                      )}
                      {selectedRequest.lastPARDS.coverage_details.requires_prior_auth && (
                        <div>Prior Auth Required: Yes</div>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs text-muted-foreground">
                    Receipt Hash: {selectedRequest.lastPARDS.inputs_hash}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Select a request to view evidence pack or PA-RDS details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}