import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Goal, Persona } from "../types/goal";
import { track } from "../lib/analytics";

const seed: Goal[] = [
  { id:"g1", persona:"aspiring", kind:"financial", priority:1, name:"Emergency Fund",
    measurable:{unit:"usd", target:5000, current:1600}, createdAt:new Date().toISOString(),
    timeBound:{deadline:"2026-12-31"} },
  { id:"g2", persona:"retiree", kind:"bucket", priority:2, name:"Greece · Jul 2026",
    cover:"/images/greece.jpg", measurable:{unit:"trips", target:1, current:0}, createdAt:new Date().toISOString(),
    timeBound:{window:{month:7,year:2026}} },
  { id:"g3", persona:"aspiring", kind:"financial", priority:3, name:"Down Payment",
    measurable:{unit:"usd", target:60000, current:4200}, createdAt:new Date().toISOString(),
    timeBound:{deadline:"2027-06-01"} },
];

export default function GoalsHome(){
  const [goals, setGoals] = useState<Goal[]>(seed);
  const [persona, setPersona] = useState<Persona>("aspiring");

  track("goals.home.viewed", { cohort: persona });

  const list = useMemo(
    () => goals.filter(g => g.persona===persona).sort((a,b)=>a.priority-b.priority),
    [goals, persona]
  );
  const top3 = list.slice(0,3);

  const pct = (g: Goal) =>
    Math.min(100, Math.round((g.measurable.current / g.measurable.target) * 100));

  const bump = (id:string, dir:-1|1) => {
    setGoals(prev=>{
      const copy=[...prev]; const i=copy.findIndex(g=>g.id===id);
      if(i<0) return prev;
      const personaGoals = copy.filter(g=>g.persona===copy[i].persona).sort((a,b)=>a.priority-b.priority);
      const pi = personaGoals.findIndex(g=>g.id===id);
      const pj = pi+dir; if(pj<0 || pj>=personaGoals.length) return prev;
      const gi = personaGoals[pi], gj = personaGoals[pj];
      const giIndex = copy.findIndex(g=>g.id===gi.id);
      const gjIndex = copy.findIndex(g=>g.id===gj.id);
      [copy[giIndex].priority, copy[gjIndex].priority] = [copy[gjIndex].priority, copy[giIndex].priority];
      track("goal.priority.reordered",{goal_id:id, from:pi+1, to:pj+1});
      return copy;
    });
  };

  return (
    <main className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-foreground">Goals</h1>
        <div className="flex items-center gap-2">
          <select 
            className="rounded-lg border border-border bg-input px-3 py-2 text-foreground"
            value={persona} 
            onChange={e=>setPersona(e.target.value as Persona)}
          >
            <option value="aspiring">Aspiring Families</option>
            <option value="retiree">Retirees</option>
          </select>
          <Link 
            to="/goals/new" 
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            New Goal
          </Link>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Top priorities</h2>
        {top3.length===0 && <div className="text-sm text-muted-foreground">No goals yet.</div>}
        <ul className="divide-y divide-border">
          {top3.map(g=>(
            <li key={g.id} className="py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium truncate text-foreground">{g.name}</div>
                <div className="text-sm text-muted-foreground">{pct(g)}% · {g.kind==="bucket" ? "Bucket list" : "Financial"}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  className="px-3 py-1 rounded border border-border bg-muted text-muted-foreground hover:bg-muted/80 transition-colors" 
                  onClick={()=>bump(g.id,-1)}
                >
                  ↑
                </button>
                <button 
                  className="px-3 py-1 rounded border border-border bg-muted text-muted-foreground hover:bg-muted/80 transition-colors" 
                  onClick={()=>bump(g.id, 1)}
                >
                  ↓
                </button>
                <Link 
                  to={`/goals/${g.id}`} 
                  className="px-3 py-1 rounded border border-border bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                >
                  Open
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-foreground mb-4">All goals</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {list.map(g=>(
            <Link 
              key={g.id} 
              to={`/goals/${g.id}`} 
              className="bg-card border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="text-sm text-muted-foreground">{g.kind==="bucket" ? "Bucket list" : "Financial"}</div>
              <div className="font-medium mt-1 text-foreground">{g.name}</div>
              <div className="mt-1 text-sm text-muted-foreground">{pct(g)}% complete</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}