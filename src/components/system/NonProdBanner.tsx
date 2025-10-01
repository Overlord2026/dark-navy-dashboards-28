import { useEffect, useState } from "react";
import { BUILD_ID, FLAGS } from "@/config/flags";

type Health = "ok" | "fail" | "pending";

export default function NonProdBanner() {
  const mode = import.meta.env.PUBLIC_MODE ?? "staging";
  const [health, setHealth] = useState<Health>("pending");

  useEffect(() => {
    if (mode === "prod") return;

    let timer: ReturnType<typeof setInterval>;
    let inflight = false;

    async function check() {
      if (inflight) return;
      inflight = true;
      try {
        const r = await fetch("/healthz", { cache: "no-store" });
        setHealth(r.ok ? "ok" : "fail");
      } catch {
        setHealth("fail");
      } finally {
        inflight = false;
      }
    }

    // initial + light polling (2 minutes)
    check();
    timer = setInterval(check, 120_000);

    return () => clearInterval(timer);
  }, [mode]);

  if (FLAGS.IS_PRODUCTION || !FLAGS.showNonProdBanner || mode === "prod") return null;

  const dotClass =
    health === "ok"
      ? "bg-green-400"
      : health === "fail"
      ? "bg-red-400"
      : "bg-yellow-300 animate-pulse";

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] bg-bfo-navy/95 border-b border-white/10 text-bfo-ivory text-xs px-3 py-1"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto max-w-7xl flex items-center gap-2 justify-center">
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${dotClass}`} aria-hidden="true" />
        <span className="opacity-80">STAGING</span>
        <span aria-hidden="true">•</span>
        <span className="opacity-80">
          Build <span className="font-medium">{BUILD_ID}</span>
        </span>
        <span aria-hidden="true">•</span>
        <span className="opacity-80">
          Health: <span className="font-medium">{health}</span>
        </span>

        {/* subtle divider */}
        <span aria-hidden="true">•</span>

        {/* Accessible link to /_smoke */}
        <a
          href="/_smoke"
          className="rounded px-2 py-0.5 text-bfo-gold hover:text-bfo-black hover:bg-bfo-gold/80 focus:outline-none focus:ring-2 focus:ring-bfo-gold/40"
          aria-label="Open Smoke Check page"
        >
          Verify
        </a>
      </div>
    </div>
  );
}