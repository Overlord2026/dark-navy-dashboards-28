import { useEffect, useState } from "react";
import PersonaSwitcher from "@/components/goals/PersonaSwitcher";
import { GoalCard } from "@/components/goals/GoalCard";
import { GoalEditorDrawer } from "@/components/goals/GoalEditorDrawer";
import { listActiveGoals, updateGoalProgress, deleteGoal, type Goal } from "@/data/goals";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, DollarSign, TrendingUp, CheckCircle, Plus } from "lucide-react";
import { toast } from "sonner";

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
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | undefined>(undefined);

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

  const handleEdit = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsEditorOpen(true);
  };

  const handleDelete = async (goalId: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    
    try {
      await deleteGoal(goalId);
      toast.success("Goal deleted successfully");
      await load(persona);
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete goal");
    }
  };

  const handleUpdateProgress = async (goalId: string, newAmount: number) => {
    try {
      await updateGoalProgress(goalId, newAmount);
      toast.success("Progress updated!");
      await load(persona);
    } catch (e: any) {
      toast.error(e?.message || "Failed to update progress");
    }
  };

  const handleCreateNew = () => {
    setSelectedGoal(undefined);
    setIsEditorOpen(true);
  };

  const handleEditorClose = () => {
    setIsEditorOpen(false);
    setSelectedGoal(undefined);
    load(persona);
  };

  // Calculate stats
  const totalSaved = goals?.reduce((sum, g) => sum + g.current_amount, 0) || 0;
  const totalTarget = goals?.reduce((sum, g) => sum + (g.targetAmount || 0), 0) || 0;
  const onTrackCount = goals?.filter(g => g.progress.pct >= 80).length || 0;
  const avgProgress = goals && goals.length > 0
    ? Math.round(goals.reduce((sum, g) => sum + g.progress.pct, 0) / goals.length)
    : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const emptyStateMessages = {
    aspiring: {
      title: "Start Your Wealth-Building Journey",
      description: "Create goals for emergency funds, down payments, education, and more.",
      examples: ["Emergency Fund", "House Down Payment", "College Savings"]
    },
    retiree: {
      title: "Plan Your Dream Retirement",
      description: "Create goals for bucket list travel, healthcare reserves, and legacy planning.",
      examples: ["European River Cruise", "Healthcare Reserve", "Grandchildren's Education Fund"]
    },
    family: {
      title: "Dream Big, Plan Smart",
      description: "Experience Return is the new investment return. What experiences matter most?",
      examples: ["Family Vacation", "New Car", "Home Renovation"]
    }
  };

  const emptyState = emptyStateMessages[persona];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header with PersonaSwitcher */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Goals &amp; Aspirations</h1>
            <p className="text-muted-foreground mt-1">Track your financial goals and celebrate milestones</p>
          </div>
          <div className="flex items-center gap-3">
            <PersonaSwitcher value={persona} onChange={setPersona} />
            <Button onClick={handleCreateNew} className="gap-2">
              <Plus className="h-4 w-4" />
              New Goal
            </Button>
          </div>
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
            <Button onClick={() => load(persona)} variant="outline">
              Retry
            </Button>
          </div>
        )}

        {/* Stats Cards */}
        {!loading && !err && goals && goals.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
                    <p className="text-2xl font-bold text-foreground">{goals.length}</p>
                  </div>
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Saved</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(totalSaved)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">On Track</p>
                    <p className="text-2xl font-bold text-foreground">{onTrackCount}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
                    <p className="text-2xl font-bold text-foreground">{avgProgress}%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Goals Grid */}
        {!loading && !err && goals && goals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onUpdateProgress={handleUpdateProgress}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !err && goals && goals.length === 0 && (
          <div className="rounded-xl border border-border bg-muted/30 p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-foreground">{emptyState.title}</h2>
              <p className="text-muted-foreground">{emptyState.description}</p>
              
              <div className="flex flex-wrap justify-center gap-2 mt-6 mb-6">
                {emptyState.examples.map((example) => (
                  <span key={example} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    {example}
                  </span>
                ))}
              </div>

              <Button onClick={handleCreateNew} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Your First Goal
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Goal Editor Drawer */}
      <GoalEditorDrawer
        isOpen={isEditorOpen}
        onClose={handleEditorClose}
        goal={selectedGoal}
        defaultPersona={persona === "family" ? "aspiring" : persona}
      />
    </div>
  );
}

