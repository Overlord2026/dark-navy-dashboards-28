import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, FileX, Wrench } from 'lucide-react';
import { createDeltaRDS } from '@/features/nil/services/nilRDSService';
import { NILDispute, NILPost, NILDeltaRDS } from '@/features/nil/types';
import { useToast } from '@/hooks/use-toast';

interface DisputeDeltaProps {
  post: NILPost;
  onDisputeResolved: (dispute: NILDispute, deltaRDS: NILDeltaRDS) => void;
}

export function DisputeDelta({ post, onDisputeResolved }: DisputeDeltaProps) {
  const [currentStep, setCurrentStep] = useState<'trigger' | 'delta' | 'resolve'>('trigger');
  const [dispute, setDispute] = useState<Partial<NILDispute>>({
    post_id: post.id,
    reason: 'attribution_mismatch',
    description: '',
    resolution_path: 'brand_review',
    status: 'open'
  });
  const [deltaRDS, setDeltaRDS] = useState<NILDeltaRDS | null>(null);
  const { toast } = useToast();

  const disputeReasons = [
    { value: 'attribution_mismatch', label: 'Attribution Mismatch', description: 'Brand attribution not properly displayed' },
    { value: 'disclosure_missing', label: 'Disclosure Missing', description: 'Required FTC disclosure not present' },
    { value: 'exclusivity_violation', label: 'Exclusivity Violation', description: 'Conflicts with exclusive agreement' },
    { value: 'content_mismatch', label: 'Content Mismatch', description: 'Content differs from approved version' }
  ];

  const resolutionPaths = [
    { value: 'brand_review', label: 'Brand Review', description: 'Brand team to review and approve changes' },
    { value: 'athlete_correction', label: 'Athlete Correction', description: 'Athlete to correct the post content' },
    { value: 'school_mediation', label: 'School Mediation', description: 'School compliance office to mediate' },
    { value: 'compliance_review', label: 'Compliance Review', description: 'Full compliance audit required' }
  ];

  const getCorrectiveActions = (reason: string): string[] => {
    switch (reason) {
      case 'attribution_mismatch':
        return [
          'Update post with correct brand mention',
          'Add brand hashtag if missing',
          'Verify brand approval for attribution'
        ];
      case 'disclosure_missing':
        return [
          'Add #ad or #sponsored hashtag',
          'Include FTC-compliant disclosure text',
          'Update bio link disclosure if applicable'
        ];
      case 'exclusivity_violation':
        return [
          'Remove conflicting brand content',
          'Verify exclusivity period dates',
          'Coordinate with conflicting brand if necessary'
        ];
      case 'content_mismatch':
        return [
          'Revert to approved content version',
          'Submit content changes for re-approval',
          'Update Decision-RDS with new approval'
        ];
      default:
        return ['Review and correct identified issues'];
    }
  };

  const handleTriggerDispute = () => {
    if (!dispute.reason || !dispute.description) {
      toast({
        title: "Incomplete Dispute",
        description: "Please select a reason and provide a description.",
        variant: "destructive"
      });
      return;
    }

    const newDispute: NILDispute = {
      id: `dispute_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      post_id: post.id,
      reason: dispute.reason!,
      description: dispute.description!,
      resolution_path: dispute.resolution_path!,
      status: 'open',
      created_at: new Date().toISOString()
    };

    // Create Delta-RDS
    const correctiveActions = getCorrectiveActions(newDispute.reason);
    const newDeltaRDS = createDeltaRDS(
      newDispute.id,
      newDispute.reason,
      newDispute.resolution_path,
      post.decision_rds_id || `decision_${post.id}`,
      correctiveActions
    );

    setDispute(newDispute);
    setDeltaRDS(newDeltaRDS);
    setCurrentStep('delta');

    toast({
      title: "Dispute Triggered",
      description: "Delta-RDS created with corrective actions.",
    });
  };

  const handleResolveDispute = () => {
    if (!dispute.id || !deltaRDS) return;

    const resolvedDispute: NILDispute = {
      ...dispute as NILDispute,
      status: 'resolved',
      resolved_at: new Date().toISOString()
    };

    setCurrentStep('resolve');
    onDisputeResolved(resolvedDispute, deltaRDS);

    toast({
      title: "Dispute Resolved",
      description: "All corrective actions completed successfully.",
    });
  };

  const selectedReason = disputeReasons.find(r => r.value === dispute.reason);
  const selectedPath = resolutionPaths.find(p => p.value === dispute.resolution_path);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Dispute Delta Demo
          </CardTitle>
          <CardDescription>
            Trigger and resolve disputes with Delta-RDS recording
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Post Summary */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Disputed Post</h4>
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">ID:</span> {post.id}</p>
                <p><span className="text-muted-foreground">Channel:</span> {post.channel}</p>
                <p><span className="text-muted-foreground">Content:</span> {post.content.text}</p>
                <p><span className="text-muted-foreground">Status:</span> 
                  <Badge variant={post.anchor_ref ? "default" : "secondary"} className="ml-2">
                    {post.anchor_ref ? 'Anchored' : 'Pending'}
                  </Badge>
                </p>
              </div>
            </div>

            {/* Step 1: Trigger Dispute */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">1. Trigger Dispute</h3>
                {currentStep !== 'trigger' && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>

              {currentStep === 'trigger' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Dispute Reason</label>
                    <Select
                      value={dispute.reason}
                      onValueChange={(value) => setDispute(prev => ({ ...prev, reason: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select dispute reason" />
                      </SelectTrigger>
                      <SelectContent>
                        {disputeReasons.map((reason) => (
                          <SelectItem key={reason.value} value={reason.value}>
                            <div>
                              <div className="font-medium">{reason.label}</div>
                              <div className="text-xs text-muted-foreground">{reason.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Resolution Path</label>
                    <Select
                      value={dispute.resolution_path}
                      onValueChange={(value) => setDispute(prev => ({ ...prev, resolution_path: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select resolution path" />
                      </SelectTrigger>
                      <SelectContent>
                        {resolutionPaths.map((path) => (
                          <SelectItem key={path.value} value={path.value}>
                            <div>
                              <div className="font-medium">{path.label}</div>
                              <div className="text-xs text-muted-foreground">{path.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      placeholder="Describe the specific issue..."
                      value={dispute.description}
                      onChange={(e) => setDispute(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <Button onClick={handleTriggerDispute} className="w-full">
                    <FileX className="h-4 w-4 mr-2" />
                    Trigger Dispute → Create Delta-RDS
                  </Button>
                </div>
              )}

              {currentStep !== 'trigger' && selectedReason && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="destructive">{selectedReason.label}</Badge>
                    <Badge variant="outline">{selectedPath?.label}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{dispute.description}</p>
                </div>
              )}
            </div>

            {/* Step 2: Delta-RDS Generated */}
            {currentStep !== 'trigger' && deltaRDS && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">2. Delta-RDS Generated</h3>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Delta-RDS Created</span>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium">Reason:</span> {deltaRDS.reason}
                    </div>
                    <div>
                      <span className="font-medium">Fix Path:</span> {deltaRDS.fix_path}
                    </div>
                    <div>
                      <span className="font-medium">Corrective Actions:</span>
                      <ul className="mt-1 ml-4 list-disc space-y-1">
                        {deltaRDS.corrective_actions.map((action, index) => (
                          <li key={index} className="text-muted-foreground">{action}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-medium">RDS ID:</span> 
                      <span className="font-mono text-xs ml-2">{deltaRDS.id}</span>
                    </div>
                  </div>
                </div>

                {currentStep === 'delta' && (
                  <Button onClick={handleResolveDispute} className="w-full">
                    <Wrench className="h-4 w-4 mr-2" />
                    Apply Corrective Actions → Resolve
                  </Button>
                )}
              </div>
            )}

            {/* Step 3: Resolution */}
            {currentStep === 'resolve' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">3. Dispute Resolved</h3>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">All corrective actions completed successfully</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Dispute resolved at: {new Date().toLocaleString()}
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Resolution Summary</h4>
                  <div className="text-sm space-y-1">
                    <p>• Original issue: {selectedReason?.label}</p>
                    <p>• Resolution path: {selectedPath?.label}</p>
                    <p>• Actions completed: {deltaRDS?.corrective_actions.length}</p>
                    <p>• Delta-RDS recorded: {deltaRDS?.id}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}