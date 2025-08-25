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
      <Tile title="Make your 401(k) work harder — automatically"
        bullets={[
          'Always capture the match. We monitor contributions and nudge you to full-match.',
          'See your real retirement date. Your 401(k), ongoing contributions, employer match, expenses, and longevity feed right into your Retirement Roadmap.',
          'One-click rollover help. When it\'s time, we handle paperwork and tracking; you get a clean, auditable file with all fee comparisons.',
          'Option to keep assets in-plan. If your employer restricts trading, we provide managed guidance and document every step with tamper-evident receipts.'
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
      <Tile title="A control plane for every client's 401(k)"
        bullets={[
          'Book of plans view. Risk flags: under-match, fee drag, IPS violations, SDBA available but idle, rollover candidates.',
          'Managed accounts & SDBA autotrade (where permitted) with explainable models and receipts you can prove.',
          'Rollover Studio. PTE 2020-02 fee comparison, rationale, and paperwork pack — all archived in WORM Vault.',
          'One team workspace. CPAs and attorneys can see what you see (role-gated), and every recommendation leaves an auditable trail.'
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
      <Tile title="Turn uncertain income into guaranteed income (when suitable)"
        bullets={[
          'Rollover-to-annuity checklist baked into the wizard (funding sources, suitability, fee comparison).',
          'Side-by-side outcomes: staying in the plan vs. partial rollover to a guaranteed income annuity.',
          'Paperwork & signatures: prefilled forms, e-sign where allowed, all proof-slipped to Vault.'
        ]}
        ctas={[
          { label:'Rollover to Income', to:'/k401/rollover?annuity=true' },
          { label:'Generate Suitability Packet', to:'/k401/annuity/suitability' }
        ]}
      />
    </div>
  );
}