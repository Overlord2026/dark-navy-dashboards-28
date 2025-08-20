import { useParams, Link } from "react-router-dom";
import type { Goal } from "../types/goal";
import { recordGoalUpdateRDS } from "../lib/rds";
import { track } from "../lib/analytics";

const mock: Record<string, Goal> = {};

const pct = (g:Goal) => Math.min(100, Math.round((g.measurable.current/g.measurable.target)*100));

export default function GoalDetail(){
  const { id } = useParams();
  const g = mock[id!] ?? {
    id:"demo", persona:"retiree", kind:"bucket", priority:2, name:"Greece · Jul 2026",
    cover:"/images/greece.jpg", measurable:{unit:"trips", target:1, current:0},
    timeBound:{deadline:"2026-07-15"}, funding:{ postPaycheck:{ amount:250, day:1 } }, createdAt:new Date().toISOString()
  } as Goal;

  track("goal.opened", {goal_id:g.id});

  const updateMonthly = (delta:number) => {
    const next = Math.max(0, (g.funding?.postPaycheck?.amount || 0) + delta);
    recordGoalUpdateRDS({ goal_id:g.id, monthly: next });
    g.funding = { ...g.funding, postPaycheck:{ amount:next, day:1 } };
  };

  return (
    <main className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8 py-6 space-y-6">
      {g.cover && <img src={g.cover} alt="" className="w-full h-48 object-cover rounded-2xl" />}

      <div className="bg-card text-card-foreground border rounded-lg p-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">{g.name}</h1>
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">{pct(g)}%</div>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Deadline: {g.timeBound?.deadline ? new Date(g.timeBound!.deadline!).toLocaleDateString() : "—"}
        </div>

        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <div className="bg-card text-card-foreground border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Current</div>
            <div className="text-2xl font-semibold">
              {g.measurable.unit==="usd" ? `$${g.measurable.current.toLocaleString()}` : g.measurable.current}
            </div>
          </div>
          <div className="bg-card text-card-foreground border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Target</div>
            <div className="text-2xl font-semibold">
              {g.measurable.unit==="usd" ? `$${g.measurable.target.toLocaleString()}` : g.measurable.target}
            </div>
          </div>
          <div className="bg-card text-card-foreground border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Monthly plan</div>
            <div className="text-2xl font-semibold">${g.funding?.postPaycheck?.amount || 0}/mo</div>
            <div className="mt-2 flex gap-2">
              <button className="bg-secondary text-secondary-foreground border rounded-lg px-3 py-2 text-sm hover:bg-secondary/80 transition-colors" onClick={()=>updateMonthly(-25)}>-25</button>
              <button className="bg-secondary text-secondary-foreground border rounded-lg px-3 py-2 text-sm hover:bg-secondary/80 transition-colors" onClick={()=>updateMonthly(+25)}>+25</button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button className="bg-secondary text-secondary-foreground border rounded-lg px-3 py-2 text-sm hover:bg-secondary/80 transition-colors" onClick={()=>track("goal.explain.opened",{goal_id:g.id, drivers:["contrib","interest"]})}>Why?</button>
          <button className="bg-secondary text-secondary-foreground border rounded-lg px-3 py-2 text-sm hover:bg-secondary/80 transition-colors">Receipts</button>
          <button className="bg-primary text-primary-foreground border rounded-lg px-4 py-2 text-sm hover:bg-primary/90 transition-colors">Invite a Pro</button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <Link className="text-primary hover:underline" to="/goals">Back to goals</Link>
      </div>
    </main>
  );
}