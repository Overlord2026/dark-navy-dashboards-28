import * as Canonical from "@/lib/canonical";

/** Mock cohort + quantiles aligned to JSON appendix and figures */
const COHORT_ID = "size_5_asset_mix_3";
const QUANTILES = { P10: 0.35, P50: 0.54, P90: 0.88 }; // fees as fraction, per sample
const DELTA_BP_DEFAULT = 12; // example delta basis points

/** Creates inputs_hash and a plan_benchmark object (content-free) */
export async function runPlanBenchmark() {
  // Minimal, PII-free plan inputs example; canonical hash represents "inputs_hash"
  const planInputs = {
    participants: 85,
    assets_usd: 11800000,
    recordkeeper_fee_pct: 0.66, // 0.66% (example)
    share_class: "R3",
  };
  const inputsCanonical = JSON.stringify(planInputs, Object.keys(planInputs).sort());
  const inputs_hash = await Canonical.sha256Hex(inputsCanonical);

  const delta_bp = DELTA_BP_DEFAULT;
  const FeeCompare_RDS = { quantiles: QUANTILES, delta_bp, reasons: ["share class differential","recordkeeper fee"] };
  const Plan_Benchmark_Receipt = {
    cohort_id: COHORT_ID,
    cohort_method: "size_asset_mix",
    proofs: { incl: "...", cons: "..." } // placeholder per K-5 figure flow
  };

  return { inputs_hash, FeeCompare_RDS, Plan_Benchmark_Receipt };
}