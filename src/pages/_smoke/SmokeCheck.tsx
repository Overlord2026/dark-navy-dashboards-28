import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function SmokeCheck(){
  const [health, setHealth] = useState<"pending"|"ok"|"fail">("pending");
  const mode = (import.meta as any).env.PUBLIC_MODE ?? "staging";
  const build = (globalThis as any).__BUILD_ID__ ?? "dev";

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/healthz", { cache: "no-store" });
        setHealth(r.ok ? "ok" : "fail");
      } catch { setHealth("fail"); }
    })();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10 text-bfo-ivory">
      <h1 className="text-2xl font-bold">Smoke Check</h1>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="text-sm opacity-70">Flags</div>
          <div>PUBLIC_MODE: <b>{String(mode)}</b></div>
          <div>BUILD_ID: <b>{String(build)}</b></div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="text-sm opacity-70">Health</div>
          <div>/healthz:{" "}
            <b className={health==="ok" ? "text-green-400" : health==="fail" ? "text-red-400" : ""}>
              {health}
            </b>
          </div>
          <button
            className="mt-3 rounded-md bg-bfo-gold text-bfo-black px-3 py-2"
            onClick={() => toast.success("Toast OK")}
          >
            Trigger Toast
          </button>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="text-sm opacity-70">Pricing anchor</div>
          <div className="space-x-2">
            <Link to="/pricing#families" className="underline text-bfo-gold">Go to Pricing (Families)</Link>
            <span className="text-xs opacity-70">Make sure this anchor loads the Families section.</span>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="text-sm opacity-70">Hero presence</div>
          <div className="text-sm">Confirm the landing shows Hero → Catalog → Pricing after clicking Home.</div>
          <Link to="/" className="underline hover:text-bfo-gold">Home</Link>
        </div>
      </div>
    </div>
  );
}
