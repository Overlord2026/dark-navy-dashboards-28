import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  XCircle,
  Calendar,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';
import { supabase } from '@/integrations/supabase/client';

interface PostMeetingOutcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  leadName: string;
  meetingId?: string;
}

interface OutcomeOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  nextStage: string;
  nextTask: string;
  followUpType: 'immediate' | 'scheduled' | 'nurture';
  color: string;
}

const outcomeOptions: OutcomeOption[] = [
  {
    id: 'qualified',
    label: 'Qualified',
    description: 'Ready to move forward with proposal',
    icon: <CheckCircle className="h-5 w-5 text-success" />,
    nextStage: 'proposal',
    nextTask: 'Prepare proposal',
    followUpType: 'immediate',
    color: 'bg-success/10 border-success/30 hover:bg-success/20'
  },
  {
    id: 'not_now',
    label: 'Not Now',
    description: 'Interested but timing is not right',
    icon: <Clock className="h-5 w-5 text-warning" />,
    nextStage: 'qualified',
    nextTask: 'Schedule follow-up call',
    followUpType: 'scheduled',
    color: 'bg-warning/10 border-warning/30 hover:bg-warning/20'
  },
  {
    id: 'needs_proposal',
    label: 'Needs Proposal',
    description: 'Requires detailed proposal to decide',
    icon: <FileText className="h-5 w-5 text-primary" />,
    nextStage: 'proposal',
    nextTask: 'Create detailed proposal',
    followUpType: 'immediate',
    color: 'bg-primary/10 border-primary/30 hover:bg-primary/20'
  },
  {
    id: 'disqualified',
    label: 'Disqualified',
    description: 'Not a fit for our services',
    icon: <XCircle className="h-5 w-5 text-destructive" />,
    nextStage: 'closed_lost',
    nextTask: 'Update CRM with reason',
    followUpType: 'nurture',
    color: 'bg-destructive/10 border-destructive/30 hover:bg-destructive/20'
  }
];

export function PostMeetingOutcomeModal({ 
  isOpen, 
  onClose, 
  leadId, 
  leadName, 
  meetingId 
}: PostMeetingOutcomeModalProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeOption | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleOutcomeSelect = async () => {
    if (!selectedOutcome) return;

    setIsSubmitting(true);

    try {
      // Track analytics event
      analytics.track('lead_outcome_set', {
        outcome: selectedOutcome.id,
        leadId,
        meetingId,
        timestamp: Date.now()
      });

      // Update lead stage if needed (this would normally update the database)
      // For now, we'll just trigger the follow-up automation

      // Trigger follow-up automation via existing edge function
      const { error } = await supabase.functions.invoke('automated-follow-up', {
        body: {
          leadId,
          outcome: selectedOutcome.id,
          nextStage: selectedOutcome.nextStage,
          nextTask: selectedOutcome.nextTask,
          followUpType: selectedOutcome.followUpType,
          notes,
          meetingId
        }
      });

      if (error) {
        console.error('Follow-up automation error:', error);
        // Don't fail the whole operation for follow-up errors
      }

      toast({
        title: "Meeting Outcome Recorded",
        description: `${leadName} outcome set to ${selectedOutcome.label}. Follow-up scheduled.`,
      });

      onClose();
    } catch (error) {
      console.error('Error recording meeting outcome:', error);
      toast({
        title: "Error",
        description: "Failed to record meeting outcome",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Meeting Outcome - {leadName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Select Outcome</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {outcomeOptions.map((option) => (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all duration-200 border-2 ${
                    selectedOutcome?.id === option.id
                      ? option.color
                      : 'border-border hover:border-border/60'
                  }`}
                  onClick={() => setSelectedOutcome(option)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      {option.icon}
                      <div className="font-semibold">{option.label}</div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {option.description}
                    </p>
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-xs">
                        Next: {option.nextStage.replace('_', ' ')}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        Task: {option.nextTask}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {selectedOutcome && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                <span className="font-medium">Next Steps</span>
              </div>
              <div className="space-y-2 text-sm">
                <div>• Lead will be moved to <strong>{selectedOutcome.nextStage.replace('_', ' ')}</strong></div>
                <div>• Task created: <strong>{selectedOutcome.nextTask}</strong></div>
                <div>• Follow-up type: <strong>{selectedOutcome.followUpType}</strong></div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Meeting Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes about the meeting outcome..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleOutcomeSelect} 
              disabled={!selectedOutcome || isSubmitting}
            >
              {isSubmitting ? 'Recording...' : 'Record Outcome'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}