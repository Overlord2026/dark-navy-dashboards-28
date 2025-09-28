import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Info } from 'lucide-react';
import { 
  CHECKLIST_ITEM_LABELS, 
  STATUS_ICONS, 
  STATUS_COLORS,
  type Checklist, 
  type ChecklistItemKey,
  type ChecklistStatus 
} from './types';
import { mapSignal } from './mapper';
import { recomputeChecklist } from './recompute';
import { trackChecklistCompleted } from '@/lib/telemetry';
import { useUserPlanKey } from '@/hooks/useUserPlanKey';

type ChecklistPanelProps = {
  checklist: Checklist;
  showRecompute?: boolean;
  onUpdate?: (checklist: Checklist) => void;
};

const CHECKLIST_SECTIONS = [
  {
    title: 'Core Documents',
    keys: ['will', 'rlt', 'pour_over', 'poa_financial'] as ChecklistItemKey[]
  },
  {
    title: 'Healthcare',
    keys: ['hc_poa', 'advance_directive', 'hipaa'] as ChecklistItemKey[]
  },
  {
    title: 'Asset Titling',
    keys: ['deed_recorded', 'beneficiary_sync', 'funding_letters'] as ChecklistItemKey[]
  },
  {
    title: 'Professional Review',
    keys: ['attorney_review_final', 'notary_final'] as ChecklistItemKey[]
  }
];

export default function ChecklistPanel({ checklist, showRecompute = false, onUpdate }: ChecklistPanelProps) {
  const [isRecomputing, setIsRecomputing] = React.useState(false);
  const [hasTrackedCompletion, setHasTrackedCompletion] = React.useState(false);
  const planKey = useUserPlanKey();

  const handleRecompute = async () => {
    if (!showRecompute || isRecomputing) return;
    
    setIsRecomputing(true);
    try {
      // Recompute the checklist (with empty signals for now)
      const recomputed = await recomputeChecklist(checklist.clientId, checklist.state || '', []);
      onUpdate?.(recomputed);
    } catch (error) {
      console.error('Failed to recompute checklist:', error);
    } finally {
      setIsRecomputing(false);
    }
  };

  const getStatusTooltip = (item: any): string => {
    const reasons = item.reasons?.join(', ') || '';
    const base = `${item.status.replace('_', ' ').toLowerCase()}`;
    return reasons ? `${base} (${reasons})` : base;
  };

  const incompleteMandatoryItems = CHECKLIST_SECTIONS
    .flatMap(section => section.keys)
    .filter(key => {
      const item = checklist.items[key];
      return item?.status !== 'COMPLETE';
    });

  const needsAttentionItems = Object.values(checklist.items)
    .filter(item => item.status === 'NEEDS_ATTENTION');

  const completionPercentage = Math.round(
    (Object.values(checklist.items).filter(item => item.status === 'COMPLETE').length / 
     Object.values(checklist.items).length) * 100
  );

  // Track checklist completion once when reaching 100%
  React.useEffect(() => {
    if (completionPercentage === 100 && !hasTrackedCompletion) {
      trackChecklistCompleted(checklist.clientId, planKey);
      setHasTrackedCompletion(true);
    } else if (completionPercentage < 100) {
      setHasTrackedCompletion(false);
    }
  }, [completionPercentage, checklist.clientId, planKey, hasTrackedCompletion]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Estate Planning Checklist
            <Badge variant={completionPercentage === 100 ? 'default' : 'secondary'}>
              {completionPercentage}% Complete
            </Badge>
          </CardTitle>
          {showRecompute && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRecompute}
              disabled={isRecomputing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRecomputing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Checklist Sections */}
        <div className="grid gap-4 md:grid-cols-2">
          {CHECKLIST_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">{section.title}</h4>
              <div className="space-y-2">
                {section.keys.map((key) => {
                  const item = checklist.items[key];
                  const icon = STATUS_ICONS[item.status];
                  const colorClass = STATUS_COLORS[item.status];
                  const label = CHECKLIST_ITEM_LABELS[key];
                  const tooltip = getStatusTooltip(item);

                  return (
                    <div 
                      key={key} 
                      className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 transition-colors"
                      title={tooltip}
                    >
                      <span className="text-lg w-6 text-center">{icon}</span>
                      <span className={`text-sm flex-1 ${colorClass}`}>
                        {label}
                      </span>
                      {item.status === 'NEEDS_ATTENTION' && (
                        <Info className="h-4 w-4 text-amber-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* What's Missing Section */}
        {incompleteMandatoryItems.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Info className="h-4 w-4" />
                What's Missing
              </h4>
              <div className="space-y-1">
                {incompleteMandatoryItems.slice(0, 5).map((key) => {
                  const item = checklist.items[key];
                  const label = CHECKLIST_ITEM_LABELS[key];
                  const status = item.status.replace('_', ' ').toLowerCase();
                  
                  return (
                    <div key={key} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                      <span>{label} — {status}</span>
                    </div>
                  );
                })}
                {incompleteMandatoryItems.length > 5 && (
                  <div className="text-sm text-muted-foreground">
                    ...and {incompleteMandatoryItems.length - 5} more items
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Needs Attention Section */}
        {needsAttentionItems.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2 text-amber-800">
                <span className="text-lg">⚠</span>
                Needs Attention
              </h4>
              <div className="space-y-1">
                {needsAttentionItems.map((item) => {
                  const label = CHECKLIST_ITEM_LABELS[item.key];
                  const reasons = item.reasons?.join(', ') || '';
                  
                  return (
                    <div key={item.key} className="text-sm text-amber-800 p-2 bg-amber-50 rounded">
                      <div className="font-medium">{label}</div>
                      {reasons && (
                        <div className="text-xs text-amber-700 mt-1">{reasons}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Success Message */}
        {completionPercentage === 100 && (
          <>
            <Separator />
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-green-800 font-medium">✓ Estate Plan Complete</div>
              <div className="text-green-700 text-sm mt-1">
                All required documents and steps have been completed.
              </div>
            </div>
          </>
        )}

        {/* Metadata */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          <div>Last updated: {new Date(checklist.lastUpdated).toLocaleString()}</div>
          {checklist.hash && (
            <div className="font-mono">Hash: {checklist.hash.slice(0, 16)}...</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}