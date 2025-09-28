import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InfoIcon, ArrowRight } from 'lucide-react';
import { FLAGS } from '@/config/flags';
import data from '@/content/pricing_content.json';
import { trackLegacyBetaInterest } from '@/lib/analytics/legacyEvents';

export default function LegacyBetaSection() {
  if (!FLAGS.legacyBeta) return null;

  const legacyData = data.legacy;

  const handleBetaInterest = (feature: string, planKey: string) => {
    trackLegacyBetaInterest(feature, planKey);
  };

  return (
    <section id="legacy" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-4xl font-bold">{legacyData.headline}</h2>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400">
              {legacyData.labels.beta}
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {legacyData.subhead}
          </p>
        </div>

        {/* Beta Notice */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-start gap-3 p-6 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <InfoIcon className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-2">Beta Feature</h4>
              <p className="text-sm text-muted-foreground">
                Legacy Planning is currently in beta. Features and availability may change as we continue to improve the experience. 
                No additional cost during beta period.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Families */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-xl font-semibold mb-4">Families</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">{legacyData.families.basic.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{legacyData.families.basic.note}</span>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 text-xs">
                    {legacyData.families.basic.badges[0]}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{legacyData.families.advanced.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{legacyData.families.advanced.note}</span>
                  <Badge variant="outline" className="bg-muted text-muted-foreground border-muted-foreground/20 text-xs">
                    {legacyData.families.advanced.badges[0]}
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-6"
              onClick={() => handleBetaInterest('family_legacy', 'family_basic')}
            >
              Try Beta <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Advisor */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-xl font-semibold mb-4">Advisor — Solo</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Basic</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{legacyData.advisor.solo_basic.note}</span>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 text-xs">
                    {legacyData.advisor.solo_basic.badges[0]}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Premium</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{legacyData.advisor.solo_premium.note}</span>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 text-xs">
                    {legacyData.advisor.solo_premium.badges[0]}
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-6"
              onClick={() => handleBetaInterest('advisor_legacy', 'advisor_premium')}
            >
              Try Beta <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* RIA */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-xl font-semibold mb-4">RIA Teams</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">5-19 seats</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{legacyData.ria.under_20.note}</span>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 text-xs">
                    {legacyData.ria.under_20.badges[0]}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">20+ seats</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{legacyData.ria.over_20.note}</span>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 text-xs">
                    {legacyData.ria.over_20.badges[0]}
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-6"
              onClick={() => handleBetaInterest('ria_legacy', 'ria_team')}
            >
              Contact Sales <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Beta Disclaimer */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            * Beta features are included at no additional cost during the beta period. 
            Pricing and feature availability subject to change.
          </p>
        </div>
      </div>
    </section>
  );
}