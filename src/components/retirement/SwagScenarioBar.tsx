import { useState, useEffect } from "react";
import type { SwagScenario, SwagInputs } from "@/types/retirement";
import { runSwagAnalysis } from "@/lib/retirement/engine";
import { saveScenario, listScenarios } from "@/lib/retirement/scenarioStore";
import { supabase } from "@/integrations/supabase/client";
import ResultCard from "./ResultCard";

export default function SwagScenarioBar() {
  const [scenarios, setScenarios] = useState<SwagScenario[]>([]);
  const [name, setName] = useState("Base");
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState<SwagInputs>({
    horizonYears: 30,
    spendFloor: 60000,
    spendCeiling: 90000
  });

  // Load saved scenarios on mount
  useEffect(() => {
    loadScenarios();
  }, []);

  async function loadScenarios() {
    try {
      const saved = await listScenarios();
      const mapped: SwagScenario[] = saved.map(s => ({
        id: s.id,
        name: s.name,
        inputs: s.inputs as SwagInputs,
        result: s.result
      }));
      setScenarios(mapped);
    } catch (err) {
      console.error("Failed to load scenarios:", err);
    }
  }

  async function onRun() {
    setLoading(true);
    try {
      const result = await runSwagAnalysis(inputs);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Save to database
        const saved = await saveScenario({
          user_id: user.id,
          name,
          inputs,
          result
        });
        
        const newScenario: SwagScenario = {
          id: saved.id,
          name: saved.name,
          inputs: saved.inputs as SwagInputs,
          result: saved.result
        };
        setScenarios([newScenario, ...scenarios]);
      } else {
        // Fallback to local-only if not authenticated
        const newScenario: SwagScenario = {
          id: crypto.randomUUID(),
          name,
          inputs,
          result
        };
        setScenarios([newScenario, ...scenarios]);
      }
    } catch (err) {
      console.error("Failed to save scenario:", err);
    } finally {
      setLoading(false);
    }
  }

  function restoreScenario(scenario: SwagScenario) {
    setName(scenario.name + " (Copy)");
    setInputs(scenario.inputs);
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
          disabled={loading}
          className="rounded-lg bg-bfo-gold text-bfo-black px-4 py-2 hover:bg-bfo-gold/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Running..." : "Run Analysis"}
        </button>
      </div>
      
      <div className="mt-4 space-y-3">
        {scenarios.map(s => (
          <div 
            key={s.id} 
            className="rounded-lg border border-white/10 p-3 space-y-2 cursor-pointer hover:bg-white/5 transition"
            onClick={() => restoreScenario(s)}
            title="Click to restore this scenario's inputs"
          >
            <div className="font-semibold">{s.name}</div>
            {s.result && (
              <ResultCard p={s.result.successProb} flags={s.result.guardrailFlags} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
