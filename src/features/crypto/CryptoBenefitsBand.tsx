import React from 'react';
import { useNavigate } from 'react-router-dom';

function Tile({title, bullets, ctas}:{title:string; bullets:string[]; ctas:Array<{label:string; to:string}>}){
  const nav = useNavigate();
  return (
    <div className="rounded-2xl border p-4 bg-white shadow-sm">
      <div className="text-lg font-semibold mb-2">{title}</div>
      <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1 mb-3">
        {bullets.map((b,i)=><li key={i}>{b}</li>)}
      </ul>
      <div className="flex flex-wrap gap-2">
        {ctas.map((c,i)=>(
          <button key={i} className="rounded-xl border px-3 py-1 text-sm hover:bg-gray-50" onClick={()=>nav(c.to)}>{c.label}</button>
        ))}
      </div>
    </div>
  );
}

export default function CryptoBenefitsBand({ persona }:{ persona:'family'|'advisor'|'insurance'}){
  if (persona==='family') return (
    <div className="grid md:grid-cols-3 gap-3">
      <Tile title="See everything, in one place"
        bullets={[
          'Custodial exchange accounts and watch-only wallets feed our dashboard.',
          'Strong controls with policy gates and optional 2-of-N approvals.',
          'Estate-ready with beneficiary directives and executor checklists.',
          'Proof-slipped with content-free receipts in WORM Vault.'
        ]}
        ctas={[
          { label:'Link Exchange Account', to:'/crypto/link' },
          { label:'Add Watch-Only Wallet', to:'/crypto/watch' },
          { label:'View Beneficiary Directives', to:'/crypto/directives' },
          { label:'Export Statements to Vault', to:'/crypto/export' }
        ]}
      />
    </div>
  );
  if (persona==='advisor') return (
    <div className="grid md:grid-cols-3 gap-3">
      <Tile title="Crypto control plane for advisors"
        bullets={[
          'Client portfolio view with custodial and self-custody tracking.',
          'Policy enforcement and risk monitoring across all holdings.',
          'Estate directive templates with vault archival.',
          'Auditable proof slips for all recommendations and trades.'
        ]}
        ctas={[
          { label:'Open Crypto Book', to:'/crypto/advisor' },
          { label:'Set Client Policies', to:'/crypto/policies' },
          { label:'Generate Estate Packet', to:'/crypto/estate' },
          { label:'Export Client Statements', to:'/crypto/statements' }
        ]}
      />
    </div>
  );
  // insurance
  return (
    <div className="grid md:grid-cols-3 gap-3">
      <Tile title="Crypto estate planning integration"
        bullets={[
          'Include crypto holdings in comprehensive estate planning.',
          'Beneficiary mapping with clear succession procedures.',
          'Vault-stored directives and access documentation.',
          'Policy compliance for estate liquidity planning.'
        ]}
        ctas={[
          { label:'Include Crypto in Estate', to:'/crypto/estate-include' },
          { label:'Generate Succession Docs', to:'/crypto/succession' }
        ]}
      />
    </div>
  );
}