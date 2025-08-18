import { analytics } from "@/lib/analytics";

// Narrow the feature keys if you have a union type; string keeps it flexible for now.
export function goToPricingForFeature(
  navigate: (path: string) => void,
  featureKey: string,
  opts?: { source?: string; planHint?: "basic" | "premium" | "elite" }
) {
  const qp = new URLSearchParams();
  qp.set("feature", featureKey);
  if (opts?.planHint) qp.set("plan", opts.planHint);
  if (opts?.source) qp.set("src", opts.source);

  analytics.trackEvent("upgrade.intent", {
    feature: featureKey,
    plan_hint: opts?.planHint,
    source: opts?.source ?? "unknown",
  });

  navigate(`/pricing?${qp.toString()}`);
}
