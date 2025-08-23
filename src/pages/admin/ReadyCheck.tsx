import React from 'react';
import { validateConfigs } from '@/tools/validateConfigs';
import { validateFamilyTools } from '@/tools/validateFamilyToolsWrapper';
import { validateNil } from '@/tools/validateNil'; // omit if not using nilTools.json
import { checkPublicRoutes } from '@/tools/checkPublicRoutes';
import { runDevSeed } from '@/tools/devSeed';
import { getMissingRoutes, getToolsNeedingStatusUpdate } from '@/tools/auditLinks';

const PUBLIC_ROUTES = [
  '/discover',
  '/solutions',
  '/solutions/annuities',
  '/solutions/investments',
  '/nil',
  '/nil/index',
  '/personas/families',
  '/personas/advisors',
  '/personas/insurance',
  '/personas/healthcare',
  '/personas/nil-athlete',
  '/personas/nil-school'
];

type Result = { label:string; status:'ok'|'warn'|'fail'; notes?:string[] }

export default function ReadyCheck() {
  const [running, setRunning] = React.useState(false);
  const [results, setResults] = React.useState<Result[]>([]);
  const [routes, setRoutes] = React.useState<{path:string; ok:boolean; status?:number}[]>([]);
  const [seedMsg, setSeedMsg] = React.useState<string>('');
  const [missingRoutes, setMissingRoutes] = React.useState<ReturnType<typeof getMissingRoutes>>([]);

  async function runAll() {
    setRunning(true);
    const res: Result[] = [];

    // 1) Config validation
    const cfg = validateConfigs();
    const cfgStatus = cfg.issues.some(i => i.level === 'error') ? 'fail'
                      : cfg.issues.length ? 'warn' : 'ok';
    res.push({ label:'Configs (catalog + demos)', status: cfgStatus,
               notes: cfg.issues.map(i=> `${i.level.toUpperCase()} ${i.where}: ${i.message}`) });

    // 2) Family tools linkage
    const fam = validateFamilyTools?.();
    if (fam) {
      const famStatus = fam.errors?.length ? 'fail' : fam.warnings?.length ? 'warn' : 'ok';
      res.push({ label:'Family tools config', status: famStatus,
                 notes: [...(fam.errors||[]), ...(fam.warnings||[])] });
    }

    // 3) NIL tools linkage (optional)
    try {
      const nil = validateNil?.();
      if (nil) {
        const nilStatus = nil.errors?.length ? 'fail' : nil.warnings?.length ? 'warn' : 'ok';
        res.push({ label:'NIL tools config', status: nilStatus,
                   notes: [...(nil.errors||[]), ...(nil.warnings||[])] });
      }
    } catch { /* ignore if module absent */ }

    // 4) Public routes reachable
    const rt = await checkPublicRoutes(PUBLIC_ROUTES);
    setRoutes(rt);
    const bad = rt.filter(r => !r.ok);
    res.push({ label:'Public routes', status: bad.length ? 'warn' : 'ok',
               notes: bad.map(b=> `${b.path} -> ${b.status||'ERR'}`) });

    // 5) Route audit - find missing routes we link to
    const missing = getMissingRoutes();
    setMissingRoutes(missing);
    const missingCount = missing.length;
    res.push({ 
      label: 'Route audit', 
      status: missingCount > 0 ? 'warn' : 'ok',
      notes: missingCount > 0 ? 
        [`Missing routes mapped to preview: ${missingCount}`, ...missing.slice(0, 5).map(m => `${m.route} (${m.source})`)] :
        ['All linked routes exist']
    });

    setResults(res);
    setRunning(false);
  }

  async function seed(kind:'nil'|'family') {
    const out = await runDevSeed(kind);
    setSeedMsg(out === 'ok' ? 'Seeded demo receipts.' : out === 'noop' ? 'Seed skipped in prod.' : 'Seed failed.');
    setTimeout(()=>setSeedMsg(''), 3000);
  }

  const statusColor: Record<Result['status'], string> = {
    ok:   '#10B981', // mint
    warn: '#F59E0B',
    fail: '#DC2626'
  };

  return (
    <div className="p-6 space-y-6" style={{ color:'#0B1E33' }}>
      <h1 className="text-2xl font-semibold">Ready-Check</h1>
      <p className="text-sm">Run config & route checks, then (dev only) seed demo Proof Slips.</p>

      <div className="space-x-2">
        <button disabled={running} onClick={runAll}
          className="rounded-xl px-4 py-2 text-[#0A0A0A] border border-[#D4AF37] bg-[#D4AF37]">
          {running ? 'Running…' : 'Run All Checks'}
        </button>
        <button onClick={()=>seed('nil')}
          className="rounded-xl px-4 py-2 border border-gray-300">Seed NIL (dev)</button>
        <button onClick={()=>seed('family')}
          className="rounded-xl px-4 py-2 border border-gray-300">Seed Family (dev)</button>
        {seedMsg && <span className="ml-2 text-sm">{seedMsg}</span>}
      </div>

      <div className="grid gap-4">
        {results.map((r, i) => (
          <div key={i} className="rounded-xl p-4 border"
               style={{borderColor:statusColor[r.status]}}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{r.label}</h2>
              <span className="px-2 py-1 rounded text-white"
                    style={{ backgroundColor: statusColor[r.status] }}>
                {r.status.toUpperCase()}
              </span>
            </div>
            {r.notes && r.notes.length > 0 && (
              <ul className="mt-2 list-disc pl-5 text-sm">
                {r.notes.slice(0,10).map((n, idx)=> <li key={idx}>{n}</li>)}
                {r.notes.length > 10 && <li>…{r.notes.length - 10} more</li>}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-semibold mt-2 mb-1">Public Routes</h3>
        <ul className="text-sm">
          {routes.map((r, i)=> (
            <li key={i}>
              {r.ok ? '✅' : '⚠️'} <a href={r.path} target="_blank" rel="noreferrer">{r.path}</a>
              {typeof r.status !== 'undefined' && ` — ${r.status}`}
            </li>
          ))}
        </ul>
      </div>

      {missingRoutes.length > 0 && (
        <div>
          <h3 className="font-semibold mt-2 mb-1">Missing Routes (Auto-Preview Created)</h3>
          <ul className="text-sm space-y-1">
            {missingRoutes.slice(0, 10).map((miss, i) => (
              <li key={i} className="flex justify-between">
                <span>
                  ⚠️ <a href={miss.route} target="_blank" rel="noreferrer" className="underline">
                    {miss.route}
                  </a>
                  {miss.toolKey && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      → /preview/{miss.toolKey}
                    </span>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">{miss.source}</span>
              </li>
            ))}
            {missingRoutes.length > 10 && (
              <li className="text-xs text-muted-foreground">
                ...{missingRoutes.length - 10} more missing routes
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="text-xs text-gray-600 mt-4">
        Tip: After publishing, run this again in production with feature flags on. Aim for OK across the board.
      </div>
    </div>
  );
}