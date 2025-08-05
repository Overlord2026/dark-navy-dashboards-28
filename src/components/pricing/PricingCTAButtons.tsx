import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Crown, Zap, Users, Calendar, CreditCard } from 'lucide-react';

interface PricingCTAButtonsProps {
  tier: string;
  persona: string;
  price: number;
  billingCycle: 'monthly' | 'annual';
}

export const PricingCTAButtons = ({ tier, persona, price, billingCycle }: PricingCTAButtonsProps) => {
  const { toast } = useToast();

  const handleStartTrial = () => {
    toast({
      title: "🚀 Free Trial Started!",
      description: "Check your email for setup instructions and welcome materials.",
    });
  };

  const handleBookDemo = () => {
    toast({
      title: "📅 Demo Scheduled",
      description: "Our team will contact you within 24 hours to schedule your personalized demo.",
    });
  };

  const handleApplyMarketplace = () => {
    toast({
      title: "👑 Marketplace Application Submitted",
      description: "We'll review your application and get back to you within 48 hours.",
    });
  };

  const handleComparePlans = () => {
    toast({
      title: "📊 Plan Comparison",
      description: "Detailed feature comparison will be emailed to you shortly.",
    });
  };

  const getPersonaCTA = () => {
    const isMarketplaceEligible = ['advisor', 'cpa', 'attorney', 'insurance', 'coach'].includes(persona);
    const isVIPTier = tier === 'Premium';
    
    if (persona === 'client') {
      return (
        <div className="space-y-2">
          <Button 
            onClick={handleStartTrial}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          >
            <Zap className="h-4 w-4 mr-2" />
            Start Free Family Trial
          </Button>
          <Button 
            variant="outline" 
            onClick={handleBookDemo}
            className="w-full"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Family Consultation
          </Button>
        </div>
      );
    }

    if (persona === 'industry_org') {
      return (
        <div className="space-y-2">
          <Button 
            onClick={handleBookDemo}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Users className="h-4 w-4 mr-2" />
            Book Enterprise Demo
          </Button>
          <Button 
            variant="outline" 
            onClick={handleComparePlans}
            className="w-full"
          >
            Compare Enterprise Plans
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Button 
          onClick={handleStartTrial}
          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
        >
          <Zap className="h-4 w-4 mr-2" />
          Start 14-Day Free Trial
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleBookDemo}
          className="w-full"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Book Live Demo
        </Button>

        {isMarketplaceEligible && isVIPTier && (
          <Button 
            onClick={handleApplyMarketplace}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
          >
            <Crown className="h-4 w-4 mr-2" />
            Apply to VIP Marketplace
          </Button>
        )}

        <Button 
          variant="ghost" 
          onClick={handleComparePlans}
          className="w-full text-xs"
        >
          Compare All Plans
        </Button>
      </div>
    );
  };

  const getPersonaBadges = () => {
    const badges = [];

    if (tier === 'Pro') {
      badges.push(
        <Badge key="popular" variant="secondary" className="text-xs">
          Most Popular
        </Badge>
      );
    }

    if (tier === 'Premium') {
      badges.push(
        <Badge key="vip" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
          <Crown className="h-3 w-3 mr-1" />
          VIP Access
        </Badge>
      );
    }

    if (billingCycle === 'annual') {
      badges.push(
        <Badge key="savings" variant="outline" className="text-xs border-emerald-300 text-emerald-700">
          Save 15%
        </Badge>
      );
    }

    return badges;
  };

  const getMarketplacePerks = () => {
    const isMarketplaceEligible = ['advisor', 'cpa', 'attorney', 'insurance', 'coach'].includes(persona);
    const isVIPTier = tier === 'Premium';

    if (!isMarketplaceEligible || !isVIPTier) return null;

    return (
      <div className="text-xs text-center text-muted-foreground space-y-1 mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
        <div className="font-semibold text-amber-800">🌟 VIP Marketplace Benefits:</div>
        <div>• Priority client matching</div>
        <div>• Featured profile placement</div>
        <div>• Exclusive high-value referrals</div>
        <div>• Premium support hotline</div>
      </div>
    );
  };

  return (
    <div>
      {/* Badges */}
      {getPersonaBadges().length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center mb-3">
          {getPersonaBadges()}
        </div>
      )}

      {/* CTA Buttons */}
      {getPersonaCTA()}

      {/* Marketplace Perks */}
      {getMarketplacePerks()}

      {/* Security Badge */}
      <div className="text-center mt-3 pt-3 border-t border-muted">
        <div className="text-xs text-muted-foreground">
          🔒 Bank-level security • 99.9% uptime SLA
        </div>
      </div>
    </div>
  );
};