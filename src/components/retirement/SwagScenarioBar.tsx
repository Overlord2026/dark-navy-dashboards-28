import { useState } from "react";
import type { SwagScenario, SwagInputs } from "@/types/retirement";
import { runSwagAnalysis } from "@/lib/retirement/engine";

export default function SwagScenarioBar() {
  const [scenarios, setScenarios] = useState<SwagScenario[]>([]);
  const [name, setName] = useState("Base");
  const [inputs, setInputs] = useState<SwagInputs>({
    horizonYears: 30,
    spendFloor: 60000,
    spendCeiling: 90000
  });

  async function onRun() {
    const result = await runSwagAnalysis(inputs);
    const newScenario: SwagScenario = {
      id: crypto.randomUUID(),
      name,
      inputs,
      result
    };
    setScenarios([newScenario, ...scenarios]);
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-bfo-ivory">
      <div className="flex flex-wrap gap-3">
        <input
          className="rounded-md border bg-white/5 px-3 py-2"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Scenario name"
        />
        <input
          className="rounded-md border bg-white/5 px-3 py-2 w-24"
          type="number"
          value={inputs.horizonYears}
          onChange={e => setInputs({ ...inputs, horizonYears: +e.target.value })}
          placeholder="Years"
        />
        <input
          className="rounded-md border bg-white/5 px-3 py-2 w-32"
          type="number"
          value={inputs.spendFloor}
          onChange={e => setInputs({ ...inputs, spendFloor: +e.target.value })}
          placeholder="Min spend"
        />
        <input
          className="rounded-md border bg-white/5 px-3 py-2 w-32"
          type="number"
          value={inputs.spendCeiling}
          onChange={e => setInputs({ ...inputs, spendCeiling: +e.target.value })}
          placeholder="Max spend"
        />
        <button
          onClick={onRun}
          className="rounded-lg bg-bfo-gold text-bfo-black px-4 py-2 hover:bg-bfo-gold/90 transition"
        >
          Run Analysis
        </button>
      </div>
      
      <div className="mt-4 space-y-2">
        {scenarios.map(s => (
          <div key={s.id} className="rounded-lg border border-white/10 p-3">
            <div className="font-semibold">{s.name}</div>
            {s.result && (
              <div className="text-sm opacity-80">
                Success {(s.result.successProb * 100).toFixed(0)}% — {s.result.summary}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
