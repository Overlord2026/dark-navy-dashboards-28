type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

const ANALYTICS_ENABLED = Boolean(import.meta.env.VITE_ANALYTICS_ENABLED);

/**
 * Minimal analytics emitter with:
 * - name normalization
 * - automatic context (path, ts)
 * - de-dupe window (prevents double fires)
 * - multi-sink (PostHog/Segment if present, otherwise Supabase Edge)
 * 
 * Legacy event examples:
 * - legacy.flow_started, legacy.checklist_completed
 * - legacy.export_created, legacy.share_grant_created
 * - legacy.reminder_scheduled, legacy.item_updated
 */
export async function track(
  event: string,
  props: AnalyticsProps = {},
  opts: { dedupeMs?: number } = {}
) {
  if (!ANALYTICS_ENABLED) return;

  const name = event.trim().toLowerCase(); // e.g., "roadmap_submitted"
  const now = Date.now();
  const dedupeMs = opts.dedupeMs ?? 800;

  // simple de-dupe across this tab
  const key = `__evt_${name}`;
  const last = (window as any)[key] as number | undefined;
  if (last && now - last < dedupeMs) return;
  (window as any)[key] = now;

  // gather safe context (no PII in props)
  const ctx = {
    path: typeof window !== "undefined" ? location.pathname : undefined,
    ts: new Date(now).toISOString(),
  };

  const payload = { event: name, ...sanitize(props), ...ctx };

  // 1) Send to Segment/PostHog if available
  try {
    if ((window as any).analytics?.track) {
      (window as any).analytics.track(name, payload);
    } else if ((window as any).posthog?.capture) {
      (window as any).posthog.capture(name, payload);
    } else {
      // 2) Fallback to Supabase Edge Function via proxy
      await fetch("/functions/v1/analytics-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true, // still send on unload
        body: JSON.stringify(payload),
      });
    }
  } catch {
    // fail silently; never block UX
  }
}

function sanitize(obj: AnalyticsProps) {
  // strip obviously sensitive keys; expand as needed
  const disallow = new Set(["email", "ssn", "dob", "phone", "address"]);
  const out: AnalyticsProps = {};
  for (const k in obj) {
    if (disallow.has(k.toLowerCase())) continue;
    out[k] = obj[k];
  }
  return out;
}