import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { analytics } from "@/lib/analytics";

interface FamilyOfficeReferralTriggerProps {
  triggerContext: 'high_tax_burden' | 'complex_planning' | 'optimization_opportunity' | 'assessment_score';
  taxAmount?: number;
  complexityScore?: number;
  assessmentScore?: number;
  triggerData?: Record<string, any>;
}

export function FamilyOfficeReferralTrigger({ 
  triggerContext, 
  taxAmount, 
  complexityScore, 
  assessmentScore,
  triggerData 
}: FamilyOfficeReferralTriggerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const getTriggerMessage = () => {
    switch (triggerContext) {
      case 'high_tax_burden':
        return {
          title: "Significant Tax Burden Detected",
          description: `With ${taxAmount ? `$${taxAmount.toLocaleString()}` : 'substantial'} in potential tax liability, you may benefit from comprehensive Family Office tax strategies.`,
          urgency: "high" as const,
          icon: <TrendingUp className="h-5 w-5 text-red-500" />
        };
      case 'complex_planning':
        return {
          title: "Complex Tax Planning Scenario",
          description: "Your tax situation involves multiple strategies that would benefit from professional Family Office coordination.",
          urgency: "medium" as const,
          icon: <Users className="h-5 w-5 text-orange-500" />
        };
      case 'optimization_opportunity':
        return {
          title: "Tax Optimization Opportunities Available",
          description: "Our analysis suggests significant tax savings opportunities through advanced Family Office strategies.",
          urgency: "medium" as const,
          icon: <CheckCircle className="h-5 w-5 text-green-500" />
        };
      case 'assessment_score':
        return {
          title: "Consider Professional Tax Review",
          description: `Based on your assessment score ${assessmentScore ? `of ${assessmentScore}%` : ''}, a Family Office review could unlock additional tax benefits.`,
          urgency: assessmentScore && assessmentScore < 60 ? "high" as const : "medium" as const,
          icon: <Calendar className="h-5 w-5 text-blue-500" />
        };
      default:
        return {
          title: "Family Office Review Recommended",
          description: "Consider a comprehensive tax review with our Family Office specialists.",
          urgency: "low" as const,
          icon: <Calendar className="h-5 w-5 text-gray-500" />
        };
    }
  };

  const handleScheduleReview = () => {
    analytics.track('family_office_referral_triggered', {
      context: triggerContext,
      tax_amount: taxAmount,
      complexity_score: complexityScore,
      assessment_score: assessmentScore,
      trigger_data: triggerData,
      source: 'tax_workflow'
    });

    window.open("https://calendly.com/tonygomes/talk-with-tony", "_blank");
    
    toast.success("Opening Family Office scheduling", {
      description: "Schedule your complimentary consultation to explore advanced tax strategies.",
      duration: 4000,
    });
  };

  const handleDismiss = () => {
    analytics.track('family_office_referral_dismissed', {
      context: triggerContext,
      source: 'tax_workflow'
    });
    setIsDismissed(true);
  };

  const handleLearnMore = () => {
    analytics.track('family_office_learn_more', {
      context: triggerContext,
      source: 'tax_workflow'
    });
    // Could open a modal or navigate to a page with more info
    toast.info("Learn more about Family Office services", {
      description: "Contact your advisor for detailed information about our comprehensive wealth management services.",
    });
  };

  if (isDismissed) return null;

  const trigger = getTriggerMessage();
  
  const getUrgencyColor = (urgency: 'high' | 'medium' | 'low') => {
    switch (urgency) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-orange-200 bg-orange-50';
      case 'low': return 'border-blue-200 bg-blue-50';
    }
  };

  const getUrgencyBadge = (urgency: 'high' | 'medium' | 'low') => {
    switch (urgency) {
      case 'high': return <Badge variant="destructive">High Priority</Badge>;
      case 'medium': return <Badge variant="secondary">Recommended</Badge>;
      case 'low': return <Badge variant="outline">Optional</Badge>;
    }
  };

  return (
    <Card className={`${getUrgencyColor(trigger.urgency)} border-l-4`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {trigger.icon}
            <div>
              <CardTitle className="text-lg">{trigger.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {getUrgencyBadge(trigger.urgency)}
                <Badge variant="outline" className="text-xs">
                  Family Office Service
                </Badge>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </Button>
        </div>
        <CardDescription className="mt-2">
          {trigger.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleScheduleReview}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <Calendar className="h-4 w-4" />
            Schedule Family Office Review
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            onClick={handleLearnMore}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Learn More
          </Button>
        </div>
        
        {trigger.urgency === 'high' && (
          <div className="mt-3 p-3 bg-white/60 rounded border border-red-200">
            <p className="text-sm text-red-700 font-medium">
              ⚡ Priority consultation recommended within 48 hours to maximize tax benefits for this year.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}