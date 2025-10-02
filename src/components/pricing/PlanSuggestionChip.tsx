import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, TrendingUp, Star } from 'lucide-react';
import { useEntitlements } from '@/context/EntitlementsContext';
import { UpgradeModal } from '@/components/UpgradeModal';
import { runtimeFlags } from '@/config/runtimeFlags';
import { 
  getPlanRecommendation, 
  shouldShowUpgradeSuggestion, 
  getUpgradeSuggestionText,
  suggestionStorage,
  PersonaType
} from '@/lib/PlanRules';
import { analytics } from '@/lib/analytics';

interface PlanSuggestionChipProps {
  persona: PersonaType;
  segment?: string;
  wealthBand?: 'aspiring' | 'hnw' | 'uhnw';
  className?: string;
}

export function PlanSuggestionChip({ 
  persona, 
  segment, 
  wealthBand, 
  className = '' 
}: PlanSuggestionChipProps) {
  const { plan: currentPlan } = useEntitlements();
  const [isVisible, setIsVisible] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // Hide entirely if in prelaunch mode
    if (runtimeFlags.prelaunchMode) {
      setIsVisible(false);
      return;
    }

    const dismissed = suggestionStorage.getDismissed();
    setDismissedSuggestions(dismissed);
    
    const shouldShow = shouldShowUpgradeSuggestion(
      { persona, segment, wealthBand, currentPlan: currentPlan as any },
      dismissed
    );
    setIsVisible(shouldShow);
  }, [persona, segment, wealthBand, currentPlan]);

  const handleDismiss = () => {
    const dismissalKey = 'bfo.upgrade.dismissed';
    localStorage.setItem(dismissalKey, JSON.stringify({
      persona,
      segment,
      wealthBand,
      dismissedAt: Date.now()
    }));
    suggestionStorage.addDismissed(persona, segment, wealthBand);
    setIsVisible(false);
    analytics.track('upgrade.dismissed', { persona, segment, wealthBand });
  };

  const handleUpgrade = () => {
    analytics.track('upgrade.intent', { persona, segment, wealthBand, currentPlan });
    setShowUpgradeModal(true);
  };

  if (!isVisible) return null;

  const recommendation = getPlanRecommendation({ persona, segment, wealthBand, currentPlan: currentPlan as any });
  const suggestionText = getUpgradeSuggestionText({ persona, segment, wealthBand });

  return (
    <>
      <Card className={`relative p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0"
          onClick={handleDismiss}
        >
          <X className="h-3 w-3" />
        </Button>
        
        <div className="flex items-start gap-3 pr-8">
          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm">Upgrade Recommendation</h4>
              <Badge variant="secondary" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                {Math.round(recommendation.confidence * 100)}% match
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {suggestionText} - {recommendation.reason}
            </p>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleUpgrade}
                className="h-7 text-xs"
              >
                View {recommendation.planKey} Plan
              </Button>
              <span className="text-xs text-muted-foreground">
                Starting at ${recommendation.planKey === 'basic' ? '29' : recommendation.planKey === 'premium' ? '99' : '299'}/mo
              </span>
            </div>
          </div>
        </div>
      </Card>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </>
  );
}