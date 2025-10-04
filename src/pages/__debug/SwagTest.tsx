import { useState } from "react";
import { enqueueRunAndInvoke, waitForRun, fetchRunSummary } from "@/data/analyzer";

export default function SwagTest(){
  const [out,setOut]=useState<any>(null);
  async function run(){
    try{
      // use any existing scenarioVersionId if you have it; otherwise short-circuit:
      const versionId = (window as any).__SWAG_VERSION__ || prompt("ScenarioVersionId?");
      if(!versionId) return;
      const runId = await enqueueRunAndInvoke(versionId, 1000);
      await waitForRun(runId, { timeoutMs: 20000, intervalMs: 500 });
      const res = await fetchRunSummary(runId);
      const summary = res?.summary as any;
      setOut(summary?.kpis || res);
    }catch(e){ setOut(String(e)); }
  }
  return (
    <div className="p-6 text-bfo-ivory">
      <h1 className="text-xl font-semibold">SWAG Debug</h1>
      <button onClick={run} className="mt-3 rounded bg-bfo-gold text-bfo-black px-3 py-2">Run 1k paths</button>
      <pre className="mt-4 text-xs whitespace-pre-wrap">{JSON.stringify(out,null,2)}</pre>
    </div>
  );
}
