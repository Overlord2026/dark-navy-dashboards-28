import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Goal, Persona, GoalKind } from "../types/goal";
import { track } from "../lib/analytics";
import { recordGoalRDS } from "../lib/rds";

export default function NewGoalWizard(){
  const nav = useNavigate();
  const [query] = useSearchParams();
  const personaDefault = (query.get("persona") as Persona) || "aspiring";
  const kindDefault = (query.get("kind") as GoalKind) || (personaDefault==="retiree" ? "bucket":"financial");

  const [persona,setPersona] = useState<Persona>(personaDefault);
  const [kind,setKind] = useState<GoalKind>(kindDefault);
  const [name,setName] = useState<string>(kind==="bucket" ? "Greece · Jul 2026" : "Emergency Fund");
  const [cover,setCover] = useState<string>("");
  const [target,setTarget] = useState<number>(kind==="bucket" ? 1 : 5000);
  const [current,setCurrent] = useState<number>(0);
  const [deadline,setDeadline] = useState<string>("");
  const [monthly,setMonthly] = useState<number>(250);
  const [why,setWhy] = useState<string>("");

  const monthsToDeadline = () => {
    if(!deadline) return 12;
    const end = new Date(deadline); const now = new Date();
    return Math.max(1, (end.getFullYear()-now.getFullYear())*12 + (end.getMonth()-now.getMonth()));
  };

  const suggestion = () => Math.max(0, Math.ceil((target - current)/monthsToDeadline()));

  const create = () => {
    const g: Goal = {
      id: crypto.randomUUID(),
      persona, kind, priority: 99, name, cover,
      measurable: { unit: kind==="bucket" ? "trips" : "usd", target, current },
      relevant: { why },
      timeBound: { deadline },
      funding: { postPaycheck: { amount: monthly, day: 1 } },
      createdAt: new Date().toISOString()
    };

    recordGoalRDS({ goal_id:g.id, template:kind, target:g.measurable.target, deadline, monthly:g.funding?.postPaycheck?.amount });
    track("goal.wizard.completed",{goal_id:g.id, target, months_to_deadline: monthsToDeadline()});
    // TODO persist to store
    nav(`/goals/${g.id}`);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8 py-6 space-y-6">
      <h1 className="text-4xl font-bold text-foreground">Create a SMART goal</h1>

      {/* Specific */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">Specific</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Persona</label>
            <select 
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground" 
              value={persona} 
              onChange={e=>setPersona(e.target.value as Persona)}
            >
              <option value="aspiring">Aspiring family</option>
              <option value="retiree">Retiree</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Type</label>
            <select 
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground" 
              value={kind} 
              onChange={e=>setKind(e.target.value as GoalKind)}
            >
              <option value="financial">Financial</option>
              <option value="bucket">Bucket list</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1">Name</label>
          <input 
            className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground"
            placeholder={kind==="bucket" ? "Greece · Jul 2026" : "Emergency Fund"}
            value={name} 
            onChange={e=>setName(e.target.value)} 
          />
        </div>
        {kind==="bucket" && (
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Cover image URL (optional)</label>
            <input 
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground" 
              placeholder="https://…"
              value={cover} 
              onChange={e=>setCover(e.target.value)} 
            />
          </div>
        )}
      </div>

      {/* Measurable */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">Measurable</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Target {kind==="bucket" ? "(trips)": "(USD)"}</label>
            <input 
              type="number" 
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground"
              value={target} 
              onChange={e=>setTarget(+e.target.value)} 
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Current</label>
            <input 
              type="number" 
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground"
              value={current} 
              onChange={e=>setCurrent(+e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* Achievable */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">Actionable</h2>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1">Monthly plan (suggested {suggestion()})</label>
          <input 
            type="number" 
            className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground"
            value={monthly} 
            onChange={e=>setMonthly(+e.target.value)} 
          />
        </div>
        <p className="text-xs text-muted-foreground">We'll create a receipt for your plan so it's auditable.</p>
      </div>

      {/* Relevant */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">Relevant</h2>
        <textarea 
          className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground" 
          rows={3}
          placeholder="Why does this matter?" 
          value={why} 
          onChange={e=>setWhy(e.target.value)} 
        />
      </div>

      {/* Time-bound */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">Time-bound</h2>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1">Deadline</label>
          <input 
            type="date" 
            className="rounded-lg border border-border bg-input px-3 py-2 text-foreground" 
            value={deadline} 
            onChange={e=>setDeadline(e.target.value)} 
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button 
          className="px-4 py-2 rounded-lg border border-border bg-muted text-muted-foreground hover:bg-muted/80 transition-colors" 
          onClick={()=>history.back()}
        >
          Cancel
        </button>
        <button 
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" 
          onClick={create}
        >
          Create goal
        </button>
      </div>
    </main>
  );
}