import React, { useMemo, useState } from "react";

/**
 * SWAG™ Retirement Roadmap — Intake + Results + Confidence Score (one-file, persona-agnostic)
 * - Four-phase inputs: Income Now, Income Later, Growth, Legacy
 * - Computes a simple, explainable Retirement Confidence Score (0–100)
 * - Shows recommendations + CTAs (Book a Meeting, Save/Export, Start Over)
 * - No external deps; Tailwind-style utility classes (safe to strip/replace)
 *
 * Optionally wire CTAs to:
 *  - /book?intent=retirement-roadmap
 *  - /signup?from=swag-roadmap
 *  - Edge functions for saving lead payloads
 */

type RoadmapForm = {
  name: string;
  email: string;
  age: string;
  retirementAge: string;
  state: string;

  // Income Now (Years 1–2)
  incomeNow: {
    monthlyExpenses: string;        // $
    guaranteedMonthlyIncome: string; // e.g., SS/Pension ann. today $
    cashBufferMonths: string;       // months of liquidity for emergencies
  };

  // Income Later (Years 3–12)
  incomeLater: {
    discretionaryBudgetYearly: string; // $
    travelBudgetYearly: string;        // $
    rmdEstimateYearly: string;         // $
  };

  // Growth (12+)
  growth: {
    portfolioValue: string;    // $
    annualContributions: string; // $
    assumedGrowthRatePct: string; // %
    riskAlignment: "conservative" | "balanced" | "growth" | ""; // self-assessed
  };

  // Legacy (ongoing)
  legacy: {
    estatePlanDocs: "none" | "will" | "trust" | "will+trust" | "";
    beneficiariesListed: "yes" | "no" | "";
    charitableGoals: string; // text
  };
};

function n(x?: string) {
  const v = Number(String(x ?? "").toString().replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(v) ? v : 0;
}

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

function pct(v: number) {
  return `${Math.round(v)}%`;
}

export default function SwagRetirementRoadmapWithScore() {
  const [formData, setFormData] = useState<RoadmapForm>({
    name: "",
    email: "",
    age: "",
    retirementAge: "",
    state: "",

    incomeNow: {
      monthlyExpenses: "",
      guaranteedMonthlyIncome: "",
      cashBufferMonths: "",
    },

    incomeLater: {
      discretionaryBudgetYearly: "",
      travelBudgetYearly: "",
      rmdEstimateYearly: "",
    },

    growth: {
      portfolioValue: "",
      annualContributions: "",
      assumedGrowthRatePct: "",
      riskAlignment: "",
    },

    legacy: {
      estatePlanDocs: "",
      beneficiariesListed: "",
      charitableGoals: "",
    },
  });

  const [showResults, setShowResults] = useState(false);

  const handle = (path: (string | number)[], value: string) => {
    setFormData((prev) => {
      const next: any = { ...prev };
      let cur: any = next;
      for (let i = 0; i < path.length - 1; i++) {
        const k = path[i];
        cur[k] = { ...cur[k] };
        cur = cur[k];
      }
      cur[path[path.length - 1]] = value;
      return next;
    });
  };

  // --- Confidence Model (simple, explainable, editable) ---
  const score = useMemo(() => {
    // 1) Income Now coverage (weight 40)
    const expenses = n(formData.incomeNow.monthlyExpenses);
    const guaranteed = n(formData.incomeNow.guaranteedMonthlyIncome);
    const coverage = expenses > 0 ? clamp((guaranteed / expenses) * 100, 0, 130) : 0; // 100% = fully covered
    const coverageScore = clamp((coverage / 100) * 100, 0, 100); // normalize

    // Liquidity buffer bonus: target 6–12 months
    const bufferMonths = n(formData.incomeNow.cashBufferMonths);
    const bufferScore = clamp((Math.min(bufferMonths, 12) / 12) * 100, 0, 100);

    const incomeNowScore = 0.75 * coverageScore + 0.25 * bufferScore; // weighted

    // 2) Growth resilience (weight 35)
    const port = n(formData.growth.portfolioValue);
    const contrib = n(formData.growth.annualContributions);
    const gr = n(formData.growth.assumedGrowthRatePct);
    const risk = formData.growth.riskAlignment;

    // Heuristics: nonzero portfolio & modest growth assumption are healthier.
    const sizeScore = clamp(Math.log10(Math.max(port, 1)) * 20, 0, 100); // log-scaled
    const contribScore = clamp(Math.min(contrib / 12000, 1) * 100, 0, 100); // $12k+/yr ≈ full credit
    const growthAssumptionPenalty = gr > 8 ? clamp(100 - (gr - 8) * 10, 0, 100) : 100; // penalize >8%
    const riskMatch =
      risk === "balanced" || risk === "growth" ? 100 : risk === "conservative" ? 70 : 50;
    const growthScore =
      0.35 * sizeScore +
      0.25 * contribScore +
      0.25 * growthAssumptionPenalty +
      0.15 * riskMatch;

    // 3) Legacy readiness (weight 15)
    const docs = formData.legacy.estatePlanDocs;
    const bens = formData.legacy.beneficiariesListed;
    const docsScore =
      docs === "will+trust" ? 100 : docs === "trust" ? 85 : docs === "will" ? 70 : 30;
    const benScore = bens === "yes" ? 100 : 40;
    const legacyScore = 0.7 * docsScore + 0.3 * benScore;

    // Aggregate with weights
    const total =
      0.4 * incomeNowScore +
      0.35 * growthScore +
      0.15 * legacyScore +
      0.1 * clamp((Boolean(formData.email) ? 100 : 0), 0, 100); // small nudge if contactable

    // Label
    const label =
      total >= 85
        ? "Excellent"
        : total >= 70
        ? "Strong"
        : total >= 55
        ? "Developing"
        : "Needs Attention";

    return {
      total: Math.round(clamp(total, 0, 100)),
      label,
      parts: {
        incomeNowScore: Math.round(incomeNowScore),
        growthScore: Math.round(growthScore),
        legacyScore: Math.round(legacyScore),
      },
      coveragePct: Math.round(coverage),
    };
  }, [formData]);

  const recommendations = useMemo(() => {
    const recs: string[] = [];
    // Income Now
    if (score.coveragePct < 100) {
      recs.push(
        "Increase reliable income for Years 1–2 or lower core expenses until coverage ≥ 100%."
      );
    }
    if (n(formData.incomeNow.cashBufferMonths) < 6) {
      recs.push("Target at least 6 months of cash buffer for emergencies.");
    }

    // Growth
    const gr = n(formData.growth.assumedGrowthRatePct);
    if (gr > 8) recs.push("Stress-test plan with a more conservative growth rate (≤ 8%).");
    if (n(formData.growth.portfolioValue) <= 0)
      recs.push("Fund the growth bucket (Year 12+) to support long-horizon goals.");

    // Legacy
    const docs = formData.legacy.estatePlanDocs;
    const bens = formData.legacy.beneficiariesListed;
    if (!docs || docs === "none") recs.push("Establish at least a will; consider a trust.");
    if (bens !== "yes") recs.push("Add/verify beneficiaries across all accounts & policies.");

    // Call-to-action
    recs.push("Generate a personalized SWAG™ Retirement Roadmap with a professional.");
    return recs;
  }, [formData, score]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  const reset = () => setShowResults(false);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ formData, score }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `swag-roadmap-${(formData.name || "client").replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background rounded-xl shadow">
      {!showResults ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          <header>
            <h1 className="text-2xl font-bold text-foreground">SWAG™ Retirement Roadmap Intake</h1>
            <p className="text-muted-foreground mt-1">
              Complete the four phases below. You'll get a Retirement Confidence Score and
              clear next steps.
            </p>
          </header>

          {/* Contact / Meta */}
          <section className="grid md:grid-cols-2 gap-4">
            <input
              className="border border-border p-2 rounded bg-background text-foreground"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => handle(["name"], e.target.value)}
            />
            <input
              className="border border-border p-2 rounded bg-background text-foreground"
              placeholder="Email (for results)"
              value={formData.email}
              onChange={(e) => handle(["email"], e.target.value)}
              type="email"
            />
            <input
              className="border border-border p-2 rounded bg-background text-foreground"
              placeholder="Current Age"
              value={formData.age}
              onChange={(e) => handle(["age"], e.target.value)}
              type="number"
            />
            <input
              className="border border-border p-2 rounded bg-background text-foreground"
              placeholder="Planned Retirement Age"
              value={formData.retirementAge}
              onChange={(e) => handle(["retirementAge"], e.target.value)}
              type="number"
            />
            <input
              className="border border-border p-2 rounded md:col-span-2 bg-background text-foreground"
              placeholder="State of Residence"
              value={formData.state}
              onChange={(e) => handle(["state"], e.target.value)}
            />
          </section>

          {/* Income Now */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Income Now (Years 1–2)</h2>
            <div className="grid md:grid-cols-3 gap-4 mt-2">
              <input
                className="border border-border p-2 rounded bg-background text-foreground"
                placeholder="Monthly Core Expenses ($)"
                value={formData.incomeNow.monthlyExpenses}
                onChange={(e) => handle(["incomeNow", "monthlyExpenses"], e.target.value)}
                type="number"
                min="0"
              />
              <input
                className="border border-border p-2 rounded bg-background text-foreground"
                placeholder="Guaranteed Monthly Income ($)"
                value={formData.incomeNow.guaranteedMonthlyIncome}
                onChange={(e) =>
                  handle(["incomeNow", "guaranteedMonthlyIncome"], e.target.value)
                }
                type="number"
                min="0"
              />
              <input
                className="border border-border p-2 rounded bg-background text-foreground"
                placeholder="Cash Buffer (months)"
                value={formData.incomeNow.cashBufferMonths}
                onChange={(e) => handle(["incomeNow", "cashBufferMonths"], e.target.value)}
                type="number"
                min="0"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Tip: Aim for 100% coverage of core expenses with reliable income + a 6–12 month cash buffer.
            </p>
          </section>

          {/* Income Later */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Income Later (Years 3–12)</h2>
            <div className="grid md:grid-cols-3 gap-4 mt-2">
              <input
                className="border border-border p-2 rounded bg-background text-foreground"
                placeholder="Discretionary Budget ($/yr)"
                value={formData.incomeLater.discretionaryBudgetYearly}
                onChange={(e) =>
                  handle(["incomeLater", "discretionaryBudgetYearly"], e.target.value)
                }
                type="number"
                min="0"
              />
              <input
                className="border border-border p-2 rounded bg-background text-foreground"
                placeholder="Travel Budget ($/yr)"
                value={formData.incomeLater.travelBudgetYearly}
                onChange={(e) => handle(["incomeLater", "travelBudgetYearly"], e.target.value)}
                type="number"
                min="0"
              />
              <input
                className="border border-border p-2 rounded bg-background text-foreground"
                placeholder="Estimated RMDs ($/yr)"
                value={formData.incomeLater.rmdEstimateYearly}
                onChange={(e) => handle(["incomeLater", "rmdEstimateYearly"], e.target.value)}
                type="number"
                min="0"
              />
            </div>
          </section>

          {/* Growth */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Growth (Year 12+)</h2>
            <div className="grid md:grid-cols-4 gap-4 mt-2">
              <input
                className="border border-border p-2 rounded bg-background text-foreground"
                placeholder="Portfolio Value ($)"
                value={formData.growth.portfolioValue}
                onChange={(e) => handle(["growth", "portfolioValue"], e.target.value)}
                type="number"
                min="0"
              />
              <input
                className="border border-border p-2 rounded bg-background text-foreground"
                placeholder="Annual Contributions ($)"
                value={formData.growth.annualContributions}
                onChange={(e) => handle(["growth", "annualContributions"], e.target.value)}
                type="number"
                min="0"
              />
              <input
                className="border border-border p-2 rounded bg-background text-foreground"
                placeholder="Assumed Growth Rate (%)"
                value={formData.growth.assumedGrowthRatePct}
                onChange={(e) => handle(["growth", "assumedGrowthRatePct"], e.target.value)}
                type="number"
                min="0"
              />
              <select
                className="border border-border p-2 rounded bg-background text-foreground"
                value={formData.growth.riskAlignment}
                onChange={(e) => handle(["growth", "riskAlignment"], e.target.value)}
              >
                <option value="">Risk Alignment</option>
                <option value="conservative">Conservative</option>
                <option value="balanced">Balanced</option>
                <option value="growth">Growth</option>
              </select>
            </div>
          </section>

          {/* Legacy */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Legacy (Ongoing)</h2>
            <div className="grid md:grid-cols-3 gap-4 mt-2">
              <select
                className="border border-border p-2 rounded bg-background text-foreground"
                value={formData.legacy.estatePlanDocs}
                onChange={(e) => handle(["legacy", "estatePlanDocs"], e.target.value)}
              >
                <option value="">Estate Docs</option>
                <option value="none">None</option>
                <option value="will">Will</option>
                <option value="trust">Trust</option>
                <option value="will+trust">Will + Trust</option>
              </select>
              <select
                className="border border-border p-2 rounded bg-background text-foreground"
                value={formData.legacy.beneficiariesListed}
                onChange={(e) => handle(["legacy", "beneficiariesListed"], e.target.value)}
              >
                <option value="">Beneficiaries Listed?</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <input
                className="border border-border p-2 rounded bg-background text-foreground"
                placeholder="Charitable Goals (optional)"
                value={formData.legacy.charitableGoals}
                onChange={(e) => handle(["legacy", "charitableGoals"], e.target.value)}
              />
            </div>
          </section>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
            >
              View My Results
            </button>
            <button
              type="button"
              onClick={exportJson}
              className="border border-border px-4 py-2 rounded hover:bg-muted bg-background text-foreground"
            >
              Save Draft (JSON)
            </button>
          </div>
        </form>
      ) : (
        <div>
          <header className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Your SWAG™ Retirement Roadmap</h1>
              <p className="text-muted-foreground">
                Hi {formData.name || "there"} — here's your summary and{" "}
                <strong>Retirement Confidence Score</strong>.
              </p>
            </div>
            <ScoreBadge score={score.total} label={score.label} />
          </header>

          {/* Snapshot */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <Card title="Income Now (1–2 yrs)">
              <Line label="Monthly Expenses" value={`$${n(formData.incomeNow.monthlyExpenses).toLocaleString()}`} />
              <Line label="Guaranteed Income" value={`$${n(formData.incomeNow.guaranteedMonthlyIncome).toLocaleString()}`} />
              <Line label="Coverage" value={pct(score.coveragePct)} />
              <Line label="Cash Buffer" value={`${n(formData.incomeNow.cashBufferMonths)} months`} />
              <Meter value={score.parts.incomeNowScore} />
            </Card>

            <Card title="Income Later (3–12 yrs)">
              <Line label="Discretionary" value={`$${n(formData.incomeLater.discretionaryBudgetYearly).toLocaleString()}/yr`} />
              <Line label="Travel" value={`$${n(formData.incomeLater.travelBudgetYearly).toLocaleString()}/yr`} />
              <Line label="RMD Est." value={`$${n(formData.incomeLater.rmdEstimateYearly).toLocaleString()}/yr`} />
              <Line label="Assumed Growth" value={`${n(formData.growth.assumedGrowthRatePct)}%`} />
              <Meter value={score.parts.growthScore} />
            </Card>

            <Card title="Legacy (ongoing)">
              <Line label="Estate Docs" value={formData.legacy.estatePlanDocs || "—"} />
              <Line label="Beneficiaries" value={formData.legacy.beneficiariesListed || "—"} />
              <Line label="Charitable" value={formData.legacy.charitableGoals || "—"} />
              <Meter value={score.parts.legacyScore} />
            </Card>
          </div>

          {/* Recommendations */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">Suggested Next Steps</h2>
            <ul className="list-disc pl-6 space-y-1 text-foreground">
              {recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mt-6">
            <a
              href="/book?intent=retirement-roadmap"
              className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
            >
              Book a 30‑min Review
            </a>
            <a
              href={`/signup?from=swag-roadmap&email=${encodeURIComponent(formData.email || "")}`}
              className="border border-border px-4 py-2 rounded hover:bg-muted bg-background text-foreground"
            >
              Save to My Portal
            </a>
            <button onClick={exportJson} className="border border-border px-4 py-2 rounded hover:bg-muted bg-background text-foreground">
              Download JSON
            </button>
            <button
              onClick={reset}
              className="border border-border px-4 py-2 rounded hover:bg-muted bg-background text-foreground"
            >
              Edit Inputs
            </button>
          </div>

          {/* Disclosure */}
          <p className="text-xs text-muted-foreground mt-6">
            Educational only; not investment, tax, or legal advice. Confidence Score is a
            simplified indicator and not a guarantee. Consider a comprehensive plan review.
          </p>
        </div>
      )}
    </div>
  );
}

// ----------------- UI Bits -----------------
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <h3 className="font-semibold mb-2 text-card-foreground">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-card-foreground">{value}</span>
    </div>
  );
}

function Meter({ value }: { value: number }) {
  const w = clamp(value);
  const color =
    w >= 85 ? "bg-emerald-600" : w >= 70 ? "bg-emerald-500" : w >= 55 ? "bg-amber-500" : "bg-destructive";
  return (
    <div className="mt-2">
      <div className="w-full h-2 bg-muted rounded">
        <div className={`h-2 ${color} rounded`} style={{ width: `${w}%` }} />
      </div>
      <div className="text-right text-xs text-muted-foreground mt-1">{w}/100</div>
    </div>
  );
}

function ScoreBadge({ score, label }: { score: number; label: string }) {
  const color =
    score >= 85 ? "bg-emerald-100 text-emerald-700" :
    score >= 70 ? "bg-emerald-100 text-emerald-700" :
    score >= 55 ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700";
  return (
    <div className={`px-3 py-2 rounded-lg ${color} text-sm font-semibold`}>
      Confidence: {score}/100 · {label}
    </div>
  );
}