import React from "react";
import { listSubscriptions, upsertSubscription, removeSubscription, getCurrentRule } from "@/features/rulesync/store";
import { getProviderFor } from "@/features/rulesync/providers";
import { runRuleSyncOnce } from "@/features/rulesync/runner";
import { canonicalDiff } from "@/features/rulesync/diff";
import { getSchedulerCfg, enableWeekly, disableWeekly, startHeartbeat } from "@/features/rulesync/scheduler";

export default function RuleSyncAdmin(){
  const [env] = React.useState((import.meta.env.MODE==="production") ? "prod":"dev");
  const [subs, setSubs] = React.useState(listSubscriptions());
  const [domain, setDomain] = React.useState<"estate"|"nil"|"advisor"|"cpa"|"attorney"|"insurance"|"medicare"|"healthcare">("estate");
  const [county, setCounty] = React.useState("CA/Los_Angeles");
  const [autoApply, setAuto] = React.useState(true);
  const [anchorAfter, setAnchor] = React.useState(true);
  const [preview, setPreview] = React.useState<any|null>(null);
  const [diffKeys, setDiffKeys] = React.useState<string[]>([]);

  // Scheduler state
  const [sched, setSched] = React.useState(getSchedulerCfg());
  const [day, setDay] = React.useState<number>(sched.day ?? 1);
  const [hour, setHour] = React.useState<number>(sched.hour ?? 3);
  const [minute, setMin] = React.useState<number>(sched.minute ?? 0);

  React.useEffect(()=>{ startHeartbeat(); },[]);

  async function enableSched(){
    const c = enableWeekly(day, hour, minute);
    setSched(c);
    alert(`Weekly RuleSync enabled. Next run: ${c.nextRunISO}`);
  }
  async function disableSched(){
    const c = disableWeekly();
    setSched(c);
    alert("Weekly RuleSync disabled.");
  }

  async function addSub(){
    const id = `${domain}:${county}`;
    const s = upsertSubscription({ id, domain, county_token: county, autoApply, anchorAfterApply: anchorAfter, lastVersion: undefined, lastUpdated: undefined });
    setSubs(listSubscriptions());
  }
  function del(id:string){ setSubs(removeSubscription(id)); }

  async function doPreview(){
    const provider = await getProviderFor(domain);
    if (!provider) { alert("No provider for domain"); return; }
    const payload = await provider.fetch({ domain, county_token: county });
    setPreview(payload);
    const current = getCurrentRule(`${domain}:${county}`);
    setDiffKeys(Object.keys(canonicalDiff(current?.config || {}, payload?.config || {})));
  }
  async function runNow(){
    const res = await runRuleSyncOnce(env as any);
    alert(`Applied: ${res.applied.length}, changes total: ${res.diffs_total}`);
  }

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-xl font-semibold">RuleSync Admin</h1>
      
      {/* Weekly Scheduler */}
      <div className="border rounded p-2 text-sm">
        <div className="font-semibold mb-1">Weekly Scheduler</div>
        <div className="flex flex-wrap gap-2 items-center">
          <label className="inline-flex items-center gap-2">Enabled
            <input type="checkbox" checked={!!sched.enabled} onChange={e=> e.target.checked ? enableSched() : disableSched() }/>
          </label>
          <label className="inline-flex items-center gap-2">Day
            <select className="border rounded px-2 py-1" value={day} onChange={e=>setDay(parseInt(e.target.value,10))}>
              <option value={0}>Sun</option><option value={1}>Mon</option><option value={2}>Tue</option>
              <option value={3}>Wed</option><option value={4}>Thu</option><option value={5}>Fri</option><option value={6}>Sat</option>
            </select>
          </label>
          <label className="inline-flex items-center gap-2">Time (24h)
            <input className="border rounded px-2 py-1 w-16" value={hour} onChange={e=>setHour(Math.max(0, Math.min(23, parseInt(e.target.value||"0",10))))}/>:
            <input className="border rounded px-2 py-1 w-16" value={minute} onChange={e=>setMin(Math.max(0, Math.min(59, parseInt(e.target.value||"0",10))))}/>
          </label>
          <button className="border rounded px-3 py-1" onClick={enableSched}>Save</button>
          <button className="border rounded px-3 py-1" onClick={disableSched}>Disable</button>
          <div className="ml-4 opacity-70">Next run: <code>{sched.nextRunISO || "-"}</code></div>
          <button className="border rounded px-3 py-1" onClick={async()=>{
            const env = (import.meta.env.MODE === "production") ? "prod":"dev";
            const res = await runRuleSyncOnce(env as any);
            alert(`Manual run complete. Applied: ${res.applied.length}, changes total: ${res.diffs_total}`);
          }}>Run now</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-sm items-end">
        <label className="inline-flex flex-col">Domain
          <select className="border rounded px-2 py-1" value={domain} onChange={e=>setDomain(e.target.value as any)}>
            <option>estate</option><option>nil</option><option>advisor</option><option>cpa</option>
            <option>attorney</option><option>insurance</option><option>medicare</option><option>healthcare</option>
          </select>
        </label>
        <label className="inline-flex flex-col">County token
          <input className="border rounded px-2 py-1" value={county} onChange={e=>setCounty(e.target.value)}/>
        </label>
        <label className="inline-flex items-center gap-1">
          <input type="checkbox" checked={autoApply} onChange={e=>setAuto(e.target.checked)}/> Auto apply
        </label>
        <label className="inline-flex items-center gap-1">
          <input type="checkbox" checked={anchorAfter} onChange={e=>setAnchor(e.target.checked)}/> Anchor after apply
        </label>
        <button className="border rounded px-3 py-1" onClick={addSub}>Subscribe</button>
        <button className="border rounded px-3 py-1" onClick={doPreview}>Preview next update</button>
        <button className="border rounded px-3 py-1" onClick={runNow}>Run all now</button>
      </div>

      {/* Subscriptions table */}
      <div className="border rounded">
        <div className="grid grid-cols-6 gap-2 p-2 text-xs font-semibold border-b">
          <div>ID</div><div>Auto</div><div>Anchor</div><div>Last ver</div><div>Last updated</div><div>Actions</div>
        </div>
        {subs.map(s=>(
          <div key={s.id} className="grid grid-cols-6 gap-2 p-2 text-xs border-b">
            <div><code>{s.id}</code></div>
            <div>{s.autoApply ? "YES":"NO"}</div>
            <div>{s.anchorAfterApply ? "YES":"NO"}</div>
            <div>{s.lastVersion || "-"}</div>
            <div>{s.lastUpdated || "-"}</div>
            <div><button className="border rounded px-2 py-0.5" onClick={()=>del(s.id)}>Remove</button></div>
          </div>
        ))}
        {subs.length===0 && <div className="p-3 text-sm">No subscriptions yet.</div>}
      </div>

      {/* Preview block */}
      {preview && (
        <div className="border rounded p-2 text-xs">
          <div className="font-semibold mb-1">Preview payload</div>
          <pre className="whitespace-pre-wrap">{JSON.stringify(preview, null, 2)}</pre>
          <div className="mt-2">Diff keys: <code>{diffKeys.join(", ") || "(none)"}</code></div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        RuleSync is content-free (no PII). All provenance events are captured as receipts. Use Publish Batch and Anchors to snapshot releases.
      </p>
    </div>
  );
}