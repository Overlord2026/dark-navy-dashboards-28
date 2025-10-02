import { BUILD_ID, FLAGS } from "@/config/flags";
import { toast } from "@/hooks/use-toast";

export default function DebugStatus() {
  return (
    <div className="container mx-auto px-4 py-10 text-bfo-ivory space-y-4">
      <h1 className="text-2xl font-semibold">Debug Status</h1>
      <div className="rounded-xl border border-white/15 p-4">
        <div><strong>BUILD_ID:</strong> {BUILD_ID || "unknown"}</div>
        <div><strong>Mode:</strong> {FLAGS.IS_PRODUCTION ? "prod" : FLAGS.PUBLIC_MODE || "staging"}</div>
      </div>
      <button
        onClick={() => toast.success("Toasts are working")}
        className="rounded-lg bg-bfo-gold text-bfo-black px-4 py-2"
      >
        Test toast
      </button>
      <p className="text-white/60 text-sm">If the toast appears and there are no errors, you're demo-ready.</p>
    </div>
  );
}
