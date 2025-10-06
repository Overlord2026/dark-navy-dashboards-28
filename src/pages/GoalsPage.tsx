import { useEffect, useState } from "react";
import PersonaSwitcher from "@/components/goals/PersonaSwitcher";
import { listActiveGoals, createGoal, type Goal } from "@/data/goals";

function getInitialPersona(): "aspiring" | "retiree" | "family" {
  try {
    const saved = localStorage.getItem("__GOALS_PERSONA__") as any;
    if (saved === "aspiring" || saved === "retiree" || saved === "family") return saved;
  } catch {}
  return "family";
}

export default function GoalsPage() {
  const [persona, setPersona] = useState<"aspiring" | "retiree" | "family">(getInitialPersona());
  const [goals, setGoals] = useState<Goal[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load(p: "aspiring" | "retiree" | "family") {
    try {
      setLoading(true);
      const rows = await listActiveGoals(p);
      setGoals(rows);
      setErr(null);
    } catch (e: any) {
      setErr(e?.message || "Failed to load goals");
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    load(persona);
  }, [persona]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto space-y-6">
        {/* Header with PersonaSwitcher */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-foreground">Goals &amp; Aspirations</h1>
          <PersonaSwitcher value={persona} onChange={setPersona} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Loading goals…</span>
          </div>
        )}

        {/* Error State */}
        {!loading && err && (
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6">
            <div className="font-semibold text-destructive mb-2">Couldn't load goals.</div>
            <div className="text-muted-foreground text-sm mb-4">{err}</div>
            <button
              onClick={() => load(persona)}
              className="rounded-md bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !err && (goals?.length ?? 0) === 0 && (
          <div className="rounded-xl border border-border bg-muted/30 p-8 text-center">
            <div className="font-semibold text-foreground mb-2">
              No {persona === "family" ? "general" : persona} goals yet
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Create your first goal to get started.
            </p>
            <button
              className="rounded-md bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-medium transition-colors"
              onClick={async () => {
                try {
                  const g = await createGoal({ title: "New goal", persona });
                  setGoals([...(goals ?? []), g]);
                } catch (e: any) {
                  alert(e?.message || "Failed to create goal");
                }
              }}
            >
              Create New Goal
            </button>
          </div>
        )}

        {/* Goals List */}
        {!loading && !err && (goals?.length ?? 0) > 0 && (
          <ul className="grid gap-4">
            {goals!.map((g) => (
              <li
                key={g.id}
                className="rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors"
              >
                <div className="font-semibold text-foreground">{g.title}</div>
                {g.description && (
                  <div className="text-muted-foreground text-sm mt-1">{g.description}</div>
                )}
                <div className="text-muted-foreground text-xs mt-2 flex gap-2">
                  <span>Persona: {g.persona || "—"}</span>
                  <span>•</span>
                  <span>Category: {g.category ?? "—"}</span>
                  <span>•</span>
                  <span>Status: {g.status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

