import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TileProps {
  title: string;
  bullets: string[];
  ctas: Array<{ label: string; to: string; variant?: 'default' | 'outline' }>;
}

function Tile({ title, bullets, ctas }: TileProps) {
  const nav = useNavigate();
  
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-3 text-foreground">{title}</h3>
        <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-2 mb-4">
          {bullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          {ctas.map((cta, i) => (
            <Button
              key={i}
              variant={cta.variant || 'outline'}
              size="sm"
              onClick={() => nav(cta.to)}
              className="text-xs"
            >
              {cta.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface K401BenefitsBandProps {
  persona: 'family' | 'advisor' | 'insurance';
}

export default function K401BenefitsBand({ persona }: K401BenefitsBandProps) {
  if (persona === 'family') {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Make your 401(k) work harder — automatically</h2>
          <p className="text-muted-foreground">Optimize contributions, plan retirement, and handle rollovers with confidence</p>
        </div>
        <div className="grid md:grid-cols-1 gap-4">
          <Tile 
            title="Complete 401(k) Optimization"
            bullets={[
              'Always capture the match (nudges + auto-escalation)',
              'Retirement date with ongoing contributions & match',
              'One-click Rollover Wizard when it\'s time',
              'Managed guidance if in-plan trading is restricted'
            ]}
            ctas={[
              { label: 'Link my 401(k)', to: '/k401/link', variant: 'default' },
              { label: 'Optimize my contributions', to: '/k401/deferral' },
              { label: 'See my retirement date', to: '/roadmap' },
              { label: 'Start my rollover', to: '/k401/rollover' }
            ]}
          />
        </div>
      </div>
    );
  }

  if (persona === 'advisor') {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">A control plane for every client's 401(k)</h2>
          <p className="text-muted-foreground">Monitor, manage, and optimize your entire book of 401(k) plans</p>
        </div>
        <div className="grid md:grid-cols-1 gap-4">
          <Tile 
            title="Professional 401(k) Management Suite"
            bullets={[
              'Book view with risk flags & one-click fixes',
              'Managed accounts & SDBA autotrade (explainable)',
              'Rollover Studio with PTE 2020-02 docs',
              'Role-gated views for CPA & attorney'
            ]}
            ctas={[
              { label: 'Open 401(k) Book', to: '/k401/advisor', variant: 'default' },
              { label: 'Enroll in Managed', to: '/k401/managed' },
              { label: 'Launch Rollover Studio', to: '/k401/rollover' },
              { label: 'Generate Advice Summary', to: '/k401/advice-summary' }
            ]}
          />
        </div>
      </div>
    );
  }

  // insurance persona
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Turn uncertain income into guaranteed income</h2>
        <p className="text-muted-foreground">Guide suitable rollover-to-annuity solutions with full compliance</p>
      </div>
      <div className="grid md:grid-cols-1 gap-4">
        <Tile 
          title="Annuity Rollover Solutions"
          bullets={[
            'Rollover-to-annuity path with suitability checks',
            'Side-by-side outcomes vs. in-plan',
            'Prefilled forms & e-sign; proof-slipped to Vault'
          ]}
          ctas={[
            { label: 'Rollover to Income', to: '/k401/rollover?annuity=true', variant: 'default' },
            { label: 'Generate Suitability Packet', to: '/k401/annuity/suitability' }
          ]}
        />
      </div>
    </div>
  );
}