import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  User, 
  Target,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';

interface WinLossPickerProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  leadName: string;
  outcome: 'won' | 'lost';
  previousStage: string;
}

interface ReasonOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: 'pricing' | 'timing' | 'competition' | 'fit' | 'process' | 'other';
  color: string;
}

const winReasons: ReasonOption[] = [
  {
    id: 'price_value',
    label: 'Price/Value Match',
    description: 'Our pricing aligned with perceived value',
    icon: <DollarSign className="h-4 w-4" />,
    category: 'pricing',
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  {
    id: 'timing_perfect',
    label: 'Perfect Timing',
    description: 'Client was ready to make decision',
    icon: <Clock className="h-4 w-4" />,
    category: 'timing',
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    id: 'relationship',
    label: 'Strong Relationship',
    description: 'Built trust and rapport effectively',
    icon: <User className="h-4 w-4" />,
    category: 'process',
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  {
    id: 'expertise',
    label: 'Demonstrated Expertise',
    description: 'Showcased knowledge and capabilities',
    icon: <Target className="h-4 w-4" />,
    category: 'fit',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  }
];

const lossReasons: ReasonOption[] = [
  {
    id: 'price_too_high',
    label: 'Price Too High',
    description: 'Client found our pricing too expensive',
    icon: <DollarSign className="h-4 w-4" />,
    category: 'pricing',
    color: 'bg-red-100 text-red-800 border-red-200'
  },
  {
    id: 'timing_not_right',
    label: 'Timing Not Right',
    description: 'Client not ready to make decision now',
    icon: <Clock className="h-4 w-4" />,
    category: 'timing',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  {
    id: 'went_competitor',
    label: 'Chose Competitor',
    description: 'Selected another advisor/firm',
    icon: <TrendingDown className="h-4 w-4" />,
    category: 'competition',
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  {
    id: 'not_good_fit',
    label: 'Not a Good Fit',
    description: 'Services didn\'t align with needs',
    icon: <AlertCircle className="h-4 w-4" />,
    category: 'fit',
    color: 'bg-gray-100 text-gray-800 border-gray-200'
  },
  {
    id: 'process_issues',
    label: 'Process Issues',
    description: 'Problems with our sales process',
    icon: <Target className="h-4 w-4" />,
    category: 'process',
    color: 'bg-pink-100 text-pink-800 border-pink-200'
  },
  {
    id: 'communication',
    label: 'Communication Gap',
    description: 'Failed to communicate value effectively',
    icon: <MessageSquare className="h-4 w-4" />,
    category: 'process',
    color: 'bg-cyan-100 text-cyan-800 border-cyan-200'
  }
];

export function WinLossPicker({ 
  isOpen, 
  onClose, 
  leadId, 
  leadName, 
  outcome, 
  previousStage 
}: WinLossPickerProps) {
  const [selectedReason, setSelectedReason] = useState<ReasonOption | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const reasons = outcome === 'won' ? winReasons : lossReasons;

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setIsSubmitting(true);

    try {
      // Track win/loss reason in analytics only (no DB changes)
      analytics.track('win_loss_reason_selected', {
        reason: selectedReason.id,
        stage: previousStage,
        outcome,
        leadId,
        category: selectedReason.category,
        notes: additionalNotes,
        timestamp: Date.now()
      });

      toast({
        title: `${outcome === 'won' ? 'Win' : 'Loss'} Reason Recorded`,
        description: `Feedback for ${leadName} has been recorded for coaching insights.`,
      });

      onClose();
    } catch (error) {
      console.error('Error recording win/loss reason:', error);
      toast({
        title: "Error",
        description: "Failed to record feedback",
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
            {outcome === 'won' ? (
              <Trophy className="h-5 w-5 text-yellow-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
            Why did we {outcome === 'won' ? 'win' : 'lose'}? - {leadName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Select Primary Reason</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reasons.map((reason) => (
                <Card
                  key={reason.id}
                  className={`cursor-pointer transition-all duration-200 border-2 ${
                    selectedReason?.id === reason.id
                      ? reason.color
                      : 'border-border hover:border-border/60'
                  }`}
                  onClick={() => setSelectedReason(reason)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={reason.color}>
                        {reason.icon}
                      </Badge>
                      <div className="font-semibold">{reason.label}</div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {reason.description}
                    </p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {reason.category}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder={`Add any additional context about why this deal was ${outcome}...`}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={3}
            />
          </div>

          {selectedReason && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">This feedback will help with:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Coaching insights and training opportunities</li>
                <li>• Process improvement recommendations</li>
                <li>• Understanding win/loss patterns by category</li>
                <li>• Weekly team performance reviews</li>
              </ul>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Skip
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!selectedReason || isSubmitting}
            >
              {isSubmitting ? 'Recording...' : 'Record Feedback'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}