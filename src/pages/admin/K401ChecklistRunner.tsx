import React from 'react';
import { recordReceipt } from '@/features/receipts/record';
import { getPartner } from '@/features/k401/partners';

// Local helpers ----------------------------------------------------------------

type ItemKey =
  | 'data_links'
  | 'roadmap_mc'
  | 'rollover_wizard'
  | 'advisor_book'
  | 'role_gated_ro'
  | 'receipts_anchors'
  | 'smb_partner'
  | 'compliance_pack'
  | 'broker_demo_pack';

type Item = {
  key: ItemKey;
  title: string;
  desc: string;
  // Try to detect automatically. Return {pass:boolean, note?:string}
  check: () => Promise<{ pass: boolean; note?: string }>;
};

type ItemState = { pass: boolean; note?: string; at?: string; version?: string };

const LS_KEY = 'k401.checklist.v1';

function loadState(): Partial<Record<ItemKey, ItemState>> {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
}
function saveState(s: Partial<Record<ItemKey, ItemState>>) {
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}
function envFlag(name: string, def = false) {
  const v = (import.meta as any).env?.[(`VITE_${name}` as any)];
  if (v === 'true') return true;
  if (v === 'false') return false;
  return def;
}

async function logDone(key: ItemKey, version: string) {
  const date = new Date().toISOString();
  try {
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'k401.done',
      reasons: [key, `version:${version}`, `date:${date}`],
      created_at: date
    } as any);
  } catch {}
}

async function logSummary(version: string, completed: ItemKey[]) {
  const date = new Date().toISOString();
  try {
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'k401.done.summary',
      reasons: [`version:${version}`, `count:${completed.length}`, ...completed],
      created_at: date
    } as any);
  } catch {}
}

// Auto-checks -------------------------------------------------------------------

// #1 Data links live (Manual + one aggregator); match rule captured & stored
async function checkDataLinks() {
  try {
    // Simple heuristic check for data presence
    const hasData = localStorage.getItem('k401_plans') || localStorage.getItem('k401_accounts');
    const pass = !!hasData;
    const note = `data_present:${pass}`;
    return { pass, note };
  } catch { return { pass: false, note: 'store/missing' }; }
}

// #2 Roadmap MC displays success probability with contributions & match live-updated
async function checkRoadmapMC() {
  // Heuristic: feature flag + presence of contribution schedule
  try {
    const mcOn = envFlag('ROADMAP_MONTECARLO_ENABLED', true);
    const hasContribs = localStorage.getItem('k401_contributions');
    const pass = mcOn && !!hasContribs;
    const note = `MC:${mcOn} contribs:${!!hasContribs}`;
    return { pass, note };
  } catch { return { pass: false, note: 'check failed' }; }
}

// #3 Rollover Wizard end-to-end (Advice Summary PDF → Vault; provider forms generated)
async function checkRolloverWizard() {
  // Best-effort: check if forms kit is enabled; else manual confirm.
  const kit = envFlag('K401_FORMS_KIT_ENABLED', true);
  return { pass: kit, note: `forms_kit:${kit}` };
}

// #4 Advisor Book of 401(k)s: risk flags + bulk nudges
async function checkAdvisorBook() {
  // Heuristic: page exists not detectable; let admin confirm. Provide env fallback flag if desired.
  const pass = false;
  return { pass, note: 'manual confirm or run bulk nudge once' };
}

// #5 Role-gated read-only for CPA/Attorney
async function checkRoleGatedRO() {
  // Manual confirm (roles are runtime); allow override.
  return { pass: false, note: 'manual confirm (CPA/ATTORNEY read-only)'}; 
}

// #6 Content-free receipts set; optional anchors on advice & rollovers
async function checkReceiptsAnchors() {
  // Heuristic: check ANCHORS flag only; receipts existence varies by environment.
  const anchors = envFlag('ANCHORS_ENABLED', false);
  return { pass: anchors, note: `anchors:${anchors}` };
}

// #7 SMB plan creation partner (white-label) agreed
async function checkSmbPartner() {
  try {
    const p = getPartner();
    const pass = p && p !== 'None';
    return { pass, note: `partner:${p || 'None'}` };
  } catch { return { pass: false, note: 'partner:unknown' }; }
}

// #8 Compliance pack generated (ERISA/PTE 2020-02 + Crypto policy memo)
async function checkCompliancePack() {
  const ready = localStorage.getItem('k401.compliancePack.ready') === 'true';
  const date = localStorage.getItem('k401.compliancePack.date');
  return { pass: ready, note: date ? `generated:${date}` : 'not generated' };
}

// #9 Broker demo pack generated (30-min demo script + materials)
async function checkBrokerDemoPack() {
  const ready = localStorage.getItem('k401.brokerDemoPack.ready') === 'true';
  const date = localStorage.getItem('k401.brokerDemoPack.date');
  return { pass: ready, note: date ? `generated:${date}` : 'not generated' };
}

// Checklist items ---------------------------------------------------------------

const ITEMS: Item[] = [
  {
    key: 'data_links',
    title: 'Data links live (Manual + one aggregator); match rule captured',
    desc: 'At least one plan/account/schedule present; match rule != none',
    check: checkDataLinks
  },
  {
    key: 'roadmap_mc',
    title: 'Roadmap MC shows success probability (live with contrib+match)',
    desc: 'MC flag ON + contribution schedule present',
    check: checkRoadmapMC
  },
  {
    key: 'rollover_wizard',
    title: 'Rollover Wizard end-to-end (PTE 2020-02 Advice Summary + forms → Vault)',
    desc: 'Forms kit enabled or manual confirm',
    check: checkRolloverWizard
  },
  {
    key: 'advisor_book',
    title: 'Advisor Book (risk flags + bulk nudges)',
    desc: 'Run at least one bulk nudge or confirm',
    check: checkAdvisorBook
  },
  {
    key: 'role_gated_ro',
    title: 'Role-gated read-only for CPA/Attorney',
    desc: 'Confirm CPA/Attorney profiles cannot execute write actions',
    check: checkRoleGatedRO
  },
  {
    key: 'receipts_anchors',
    title: 'Content-free receipts set; optional anchors on advice & rollovers',
    desc: 'Anchors flag ON (optional) and receipts wired',
    check: checkReceiptsAnchors
  },
  {
    key: 'smb_partner',
    title: 'SMB plan creation partner (white-label) agreed',
    desc: 'Partner set in Admin → K401 Partner',
    check: checkSmbPartner
  },
  {
    key: 'compliance_pack',
    title: 'Compliance pack generated (ERISA/PTE 2020-02 + Crypto policy)',
    desc: '2-page compliance overview with policy memos → Vault',
    check: checkCompliancePack
  },
  {
    key: 'broker_demo_pack',
    title: 'Broker demo pack generated (30-min script + materials)',
    desc: 'Demo script and presentation materials → Vault',
    check: checkBrokerDemoPack
  }
];

// UI ----------------------------------------------------------------------------

export default function K401ChecklistRunner() {
  const [state, setState] = React.useState(loadState());
  const [version, setVersion] = React.useState<string>(() => `v1.0-${new Date().toISOString().slice(0,10)}`);
  const [running, setRunning] = React.useState(false);
  const doneCount = (Object.keys(state) as ItemKey[]).filter(k => state[k]?.pass).length;

  async function runOne(it: Item) {
    setRunning(true);
    const res = await it.check();
    const next = { ...state, [it.key]: { pass: res.pass, note: res.note, at: new Date().toISOString(), version } };
    setState(next); saveState(next);
    if (res.pass) await logDone(it.key, version);
    setRunning(false);
  }

  async function runAll() {
    setRunning(true);
    const next = { ...state };
    const completed: ItemKey[] = [];
    for (const it of ITEMS) {
      const res = await it.check();
      next[it.key] = { pass: res.pass, note: res.note, at: new Date().toISOString(), version };
      if (res.pass) completed.push(it.key);
    }
    setState(next); saveState(next);
    if (completed.length) await logSummary(version, completed);
    setRunning(false);
  }

  async function markDoneManual(key: ItemKey) {
    const next = { ...state, [key]: { pass: true, note: 'manual', at: new Date().toISOString(), version } };
    setState(next); saveState(next);
    await logDone(key, version);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify({ version, state }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `k401_checklist_${version}.json`; a.click(); URL.revokeObjectURL(a.href);
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">401(k) Control Plane — Admin Checklist Runner</h1>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm">Release version
          <input className="ml-2 rounded-xl border px-3 py-1" value={version} onChange={e=>setVersion(e.target.value)} />
        </label>
        <button className="rounded-xl border px-3 py-2" onClick={runAll} disabled={running}>Run all checks</button>
        <button className="rounded-xl border px-3 py-2" onClick={exportJson}>Export checklist JSON</button>
        <div className="text-sm text-gray-600">Completed: {doneCount}/{ITEMS.length}</div>
      </div>

      <div className="rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Item</th>
              <th className="text-left p-2">Description</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Note</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ITEMS.map(it => {
              const st = state[it.key];
              const ok = !!st?.pass;
              return (
                <tr key={it.key} className="border-t">
                  <td className="p-2 font-medium">{it.title}</td>
                  <td className="p-2 text-xs text-gray-700">{it.desc}</td>
                  <td className="p-2">{ok ? '✅' : '◷'}</td>
                  <td className="p-2 text-xs text-gray-600">{st?.note || '-'}</td>
                  <td className="p-2">
                    <div className="flex flex-wrap gap-2">
                      <button className="rounded-xl border px-3 py-1" onClick={()=>runOne(it)} disabled={running}>Run check</button>
                      {!ok && (
                        <button className="rounded-xl border px-3 py-1" onClick={()=>markDoneManual(it.key)}>Mark done</button>
                      )}
                      {ok && <span className="text-[11px] text-gray-500">at {st?.at?.replace('T',' ').slice(0,16)}</span>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-600">
        Notes: auto-checks are best-effort (store/env). Use "Mark done" to confirm anything handled outside the app.
        All completions log a content-free <code>Decision-RDS</code> <code>k401.done</code> with version/date.
      </div>
    </div>
  );
}