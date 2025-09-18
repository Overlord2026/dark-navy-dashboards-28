import React from 'react';
import { flags } from '@/lib/flags';
import { useNavigate } from 'react-router-dom';

const BRAND = {
  green: '#10B981',    // success
  gold:  '#D4AF37',    // brand gold for mixed
  red:   '#DC2626',    // error
  navy:  '#0B1E33',    // background
  cyan:  '#67E8F9'     // focus ring
};

const GROUPS = {
  publicShell: ['PUBLIC_DISCOVER_ENABLED','PUBLIC_CATALOG_ENABLED','PUBLIC_CTA_BAR','TRUST_EXPLAINER_ENABLED','DEMOS_ENABLED'],
  solutions:   ['SOLUTIONS_ENABLED'],
  brands:      ['BRAND_PUBLIC_ENABLED'],
};

function computeStatus(f: any) {
  const allKeys = [...GROUPS.publicShell, ...GROUPS.solutions, ...GROUPS.brands];
  const values = allKeys.map(k => !!f[k]);
  const trues = values.filter(Boolean).length;
  const falses = allKeys.filter(k => !f[k]);
  let status: 'ON' | 'MIXED' | 'OFF' = 'OFF';
  if (trues === allKeys.length) status = 'ON';
  else if (trues === 0) status = 'OFF';
  else status = 'MIXED';
  return { status, trues, total: allKeys.length, falses };
}

export default function PublicFlagsBadge() {
  const nav = useNavigate();
  const { status, trues, total, falses } = computeStatus(flags);
  const color = status === 'ON' ? BRAND.green : status === 'OFF' ? BRAND.red : BRAND.gold;
  const label = status === 'ON' ? 'Public: ON' : status === 'OFF' ? 'Public: OFF' : 'Public: MIXED';
  const sr = `Public routes status ${status}. ${trues} of ${total} flags enabled. ${falses.length ? 'Disabled: '+falses.join(', ') : ''}`;

  return (
    <button
      type="button"
      aria-label={sr}
      title={falses.length ? `Disabled: ${falses.join(', ')}` : 'All public flags enabled'}
      onClick={() => nav('/admin/publish')}
      className="inline-flex items-center gap-2 rounded-xl px-3 py-1 text-sm min-h-[44px] focus-visible:outline-none"
      style={{ 
        background: '#F7F8FA', 
        color: BRAND.navy, 
        border: `1px solid ${color}`,
        boxShadow: 'none'
      }}
      onKeyDown={(e) => { 
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          nav('/admin/publish');
        }
      }}
    >
      <span 
        aria-hidden="true"
        className="inline-block rounded-full"
        style={{ width: 10, height: 10, backgroundColor: color }}
      />
      <span aria-hidden="true">{label}</span>
      <span className="sr-only">{sr}</span>
      <style>{`
        button:focus-visible { 
          box-shadow: 0 0 0 2px ${BRAND.cyan} !important; 
        }
      `}</style>
    </button>
  );
}