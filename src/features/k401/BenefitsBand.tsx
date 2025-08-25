import React from 'react';
import { useNavigate } from 'react-router-dom';

function Tile({title, bullets, ctas}:{title:string; bullets:string[]; ctas:Array<{label:string; to:string}>}){
  const nav = useNavigate();
  return (
    <div className="rounded-2xl border border-border p-4 bg-card shadow-sm">
      <div className="text-lg font-semibold mb-2 text-foreground">{title}</div>
      <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1 mb-3">
        {bullets.map((b,i)=><li key={i}>{b}</li>)}
      </ul>
      <div className="flex flex-wrap gap-2">
        {ctas.map((c,i)=>(
          <button key={i} className="rounded-xl border border-border px-3 py-1 text-sm bg-background hover:bg-muted transition-colors" onClick={()=>nav(c.to)}>{c.label}</button>
        ))}
      </div>
    </div>
  );
}

export default function K401BenefitsBand({ persona }:{ persona:'family'|'advisor'|'insurance'}){
  if (persona==='family') return (
    <div className="grid md:grid-cols-3 gap-3">
      <Tile title="Make your 401(k) work harder"
        bullets={[
          'Always capture the match (nudges + auto-escalation).',
          'Retirement date with ongoing contributions & match.',
          'One-click Rollover Wizard when it\'s time.',
          'Managed guidance if in-plan trading is restricted.'
        ]}
        ctas={[
          { label:'Link my 401(k)', to:'/k401/link' },
          { label:'Optimize my contributions', to:'/k401/deferral' },
          { label:'See my retirement date', to:'/roadmap' },
          { label:'Start my rollover', to:'/k401/rollover' }
        ]}
      />
    </div>
  );
  if (persona==='advisor') return (
    <div className="grid md:grid-cols-3 gap-3">
      <Tile title="A control plane for every 401(k)"
        bullets={[
          'Book view with risk flags & one-click fixes.',
          'Managed accounts & SDBA autotrade (explainable).',
          'Rollover Studio with PTE 2020-02 docs.',
          'Role-gated views for CPA & attorney.'
        ]}
        ctas={[
          { label:'Open 401(k) Book', to:'/k401/advisor' },
          { label:'Enroll in Managed', to:'/k401/managed' },
          { label:'Launch Rollover Studio', to:'/k401/rollover' },
          { label:'Generate Advice Summary', to:'/k401/advice-summary' }
        ]}
      />
    </div>
  );
  // insurance
  return (
    <div className="grid md:grid-cols-3 gap-3">
      <Tile title="Turn uncertain income into guaranteed income"
        bullets={[
          'Rollover-to-annuity path with suitability checks.',
          'Side-by-side outcomes vs. in-plan.',
          'Prefilled forms & e-sign; proof-slipped to Vault.'
        ]}
        ctas={[
          { label:'Rollover to Income', to:'/k401/rollover?annuity=true' },
          { label:'Generate Suitability Packet', to:'/k401/annuity/suitability' }
        ]}
      />
    </div>
  );
}