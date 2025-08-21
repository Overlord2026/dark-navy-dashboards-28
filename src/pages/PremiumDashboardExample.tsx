import React from 'react';
import { SegmentCard } from '@/components/ui/SegmentCard';
import { CalculatorTile } from '@/components/ui/CalculatorTile';
import { GoldButton } from '@/components/ui/GoldButton';
import { Button } from '@/components/ui/button';
import { PersonaSwitcher } from '@/features/personalization/components/PersonaSwitcher';
import { Calculator, TrendingUp, Building2, Heart, Crown, Plus } from 'lucide-react';

export default function PremiumDashboardExample() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Page Header with Gold CTA */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Premium Dashboard Example</h1>
          <p className="text-slate/80 text-sm mt-1">
            Showcasing the BFO Premium UI system with metallic gold accents
          </p>
        </div>
        <GoldButton>
          <Crown className="h-4 w-4 mr-2" />
          Invite a Pro
        </GoldButton>
      </header>

      {/* First Row: Persona Switcher */}
      <div className="flex items-center justify-center p-4 bg-white rounded-2xl shadow-soft">
        <PersonaSwitcher showTier={true} />
      </div>

      {/* Segment Cards Grid */}
      <section>
        <h2 className="text-xl font-semibold text-ink mb-4">Segment & Course Tiles</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <SegmentCard 
            segment="retiree" 
            title="Income Planning" 
            subtitle="Runway & RMD calculators"
            icon={<Calculator className="h-5 w-5" />}
            onOpen={() => console.log('Open retiree tools')}
          />
          <SegmentCard 
            segment="aspiring" 
            title="Wealth Building" 
            subtitle="SWAG Monte Carlo & growth projections"
            icon={<TrendingUp className="h-5 w-5" />}
            onOpen={() => console.log('Open aspiring tools')}
          />
          <SegmentCard 
            segment="advisor" 
            title="Advisor Console" 
            subtitle="Policy-to-controls & client management"
            icon={<Building2 className="h-5 w-5" />}
            onOpen={() => console.log('Open advisor tools')}
          />
          <SegmentCard 
            segment="provider" 
            title="Health Navigator" 
            subtitle="Screenings & prior authorizations"
            icon={<Heart className="h-5 w-5" />}
            onOpen={() => console.log('Open provider tools')}
          />
        </div>
      </section>

      {/* Calculator Tiles Grid */}
      <section>
        <h2 className="text-xl font-semibold text-ink mb-4">Calculator Grid</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <CalculatorTile 
            label="SWAG Monte Carlo" 
            entitlement="basic"
            description="Safe withdrawal and growth projections"
            onRun={() => console.log('Run SWAG calculator')}
            onDetails={() => console.log('Show SWAG details')}
          />
          <CalculatorTile 
            label="Roth Conversion Ladder" 
            entitlement="premium"
            description="Strategic tax-efficient conversions"
            onRun={() => console.log('Run Roth calculator')}
            onDetails={() => console.log('Show Roth details')}
          />
          <CalculatorTile 
            label="Charitable Trust" 
            entitlement="elite"
            description="Charitable giving and trust strategies"
            onRun={() => console.log('Run Charitable calculator')}
            onDetails={() => console.log('Show Charitable details')}
          />
          <CalculatorTile 
            label="HSA Optimizer" 
            entitlement="basic"
            description="Health savings account planning"
            onRun={() => console.log('Run HSA calculator')}
            onDetails={() => console.log('Show HSA details')}
          />
          <CalculatorTile 
            label="Entity & Trust Summary" 
            entitlement="premium"
            description="Multi-entity reporting and analysis"
            onRun={() => console.log('Run Entity calculator')}
            onDetails={() => console.log('Show Entity details')}
          />
          <CalculatorTile 
            label="Equity Compensation" 
            entitlement="elite"
            description="Stock option and RSU optimization"
            onRun={() => console.log('Run Equity calculator')}
            onDetails={() => console.log('Show Equity details')}
          />
        </div>
      </section>

      {/* Button Variants Showcase */}
      <section>
        <h2 className="text-xl font-semibold text-ink mb-4">Button Variants</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-3 p-4 bg-white rounded-2xl shadow-soft">
            <h3 className="text-[15px] font-semibold text-ink">Gold Variants</h3>
            <div className="space-y-2">
              <Button variant="gold" className="w-full">
                <span>Primary Gold (Shimmer)</span>
              </Button>
              <Button variant="gold-outline" className="w-full">
                Border Thicken on Hover
              </Button>
              <GoldButton className="w-full">
                Standalone GoldButton
              </GoldButton>
            </div>
          </div>

          <div className="space-y-3 p-4 bg-white rounded-2xl shadow-soft">
            <h3 className="text-[15px] font-semibold text-ink">Standard Variants</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                Outline Secondary
              </Button>
              <Button variant="ghost" className="w-full">
                Ghost Tertiary
              </Button>
              <Button variant="secondary" className="w-full">
                Secondary Action
              </Button>
            </div>
          </div>

          <div className="space-y-3 p-4 bg-white rounded-2xl shadow-soft">
            <h3 className="text-[15px] font-semibold text-ink">Focus & Accessibility</h3>
            <div className="space-y-2">
              <Button 
                variant="gold" 
                className="w-full focus-visible:ring-2 focus-visible:ring-gold-base focus-visible:ring-offset-2"
              >
                Gold Focus Ring
              </Button>
              <button className="w-full px-3 py-2 rounded-2xl border border-slate/30 text-ink hover:bg-sand focus-visible:ring-2 focus-visible:ring-gold-base focus-visible:ring-offset-2 transition-colors duration-200">
                Custom Button w/ Gold Focus
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Notes */}
      <section className="bg-sand/50 rounded-2xl p-6">
        <h3 className="text-[15px] font-semibold text-ink mb-3">✅ Accessibility Features</h3>
        <ul className="space-y-2 text-sm text-ink">
          <li>• All gold/sand backgrounds use <code>text-ink</code> (black) for readability</li>
          <li>• Focus rings use <code>focus-visible:ring-gold-base</code> for keyboard navigation</li>
          <li>• Icons on dark tiles use <code>text-gold-hi</code> for brand consistency</li>
          <li>• Shimmer animation respects <code>prefers-reduced-motion</code></li>
          <li>• Minimum 44px touch targets for mobile accessibility</li>
          <li>• WCAG AA contrast ratios maintained across all color combinations</li>
        </ul>
      </section>
    </div>
  );
}