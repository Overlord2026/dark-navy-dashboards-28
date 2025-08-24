import React from 'react';
import { useCountyMeta } from './useCountyMeta';
import { getCountyKey, CountyMeta } from './countyMeta';
import { Button } from '@/components/ui/button';

interface CountyLookupPanelProps {
  onUse?: (meta: CountyMeta) => void;
}

export default function CountyLookupPanel({ onUse }: CountyLookupPanelProps) {
  const { list, byState, get, search } = useCountyMeta();
  const [state, setState] = React.useState<string>('CA');
  const [county, setCounty] = React.useState<string>('');
  const [q, setQ] = React.useState('');

  const states = Array.from(new Set(list.map(c => c.state))).sort();
  const counties = state ? byState(state).map(c => c.county).sort() : [];

  const meta = (state && county) ? get(state, county) : undefined;
  const matches = q ? search(q) : [];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">County Look-up</h3>

      <div className="grid gap-2 md:grid-cols-3">
        <div>
          <label className="block text-sm mb-1">Search</label>
          <input 
            className="w-full rounded-xl border px-3 py-2 min-h-[44px] focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            placeholder="Try 'VA Fairfax' or 'Maricopa'"
            value={q} 
            onChange={e => setQ(e.target.value)} 
          />
          {!!q && (
            <ul className="mt-2 max-h-44 overflow-auto text-sm border rounded-lg bg-white shadow-md">
              {matches.slice(0, 100).map(m => (
                <li key={getCountyKey(m.state, m.county)} className="py-1 px-2 border-b last:border-b-0">
                  <button 
                    className="text-primary underline hover:text-primary/80 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    onClick={() => { 
                      setState(m.state); 
                      setCounty(m.county); 
                      setQ(''); 
                    }}
                  >
                    {m.state} / {m.county}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">State</label>
          <select 
            className="w-full rounded-xl border px-3 py-2 min-h-[44px] focus:ring-2 focus:ring-cyan-500 focus:outline-none" 
            value={state} 
            onChange={e => { setState(e.target.value); setCounty(''); }}
          >
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">County</label>
          <select 
            className="w-full rounded-xl border px-3 py-2 min-h-[44px] focus:ring-2 focus:ring-cyan-500 focus:outline-none" 
            value={county} 
            onChange={e => setCounty(e.target.value)}
          >
            <option value="" disabled>Choose...</option>
            {counties.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {meta && (
        <div className="rounded-xl border p-4 bg-card text-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-lg">{meta.state} / {meta.county}</div>
            <div className="text-xs text-muted-foreground">
              {meta.eRecording ? 'e-Recording: Yes' : 'e-Recording: No'}
              {' • '}
              Providers: {(meta.providers || []).join(', ') || 'n/a'}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mt-3">
            <div className="space-y-1">
              <div><span className="font-medium">Page Size:</span> {meta.pageSize}</div>
              <div>
                <span className="font-medium">Margins (in):</span> T {meta.topMarginIn}, L {meta.leftMarginIn}, R {meta.rightMarginIn}, B {meta.bottomMarginIn}
              </div>
              <div>
                <span className="font-medium">Stamp area:</span> x={meta.firstPageStamp.xIn}" y={meta.firstPageStamp.yIn}" w={meta.firstPageStamp.wIn}" h={meta.firstPageStamp.hIn}"
              </div>
            </div>
            <div className="space-y-1">
              <div><span className="font-medium">Return Address:</span> {String(meta.requiresReturnAddress)}</div>
              <div><span className="font-medium">Preparer:</span> {String(meta.requiresPreparer)}</div>
              <div><span className="font-medium">Grantee Address:</span> {String(!!meta.requiresGranteeAddress)}</div>
              <div><span className="font-medium">APN:</span> {String(!!meta.requiresAPN)}</div>
            </div>
          </div>
          
          {!!meta.notes && (
            <div className="mt-3 text-xs text-muted-foreground">
              <span className="font-medium">Notes:</span> {meta.notes}
            </div>
          )}

          <div className="mt-4">
            <Button 
              onClick={() => onUse?.(meta)} 
              className="rounded-xl min-h-[44px] focus:ring-2 focus:ring-cyan-500"
            >
              Use in Intake
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}