import { toast } from "@/hooks/use-toast";

/** Pure, hook-free installer. Safe to call after mount (once per session). */
let _installed = false;
export function runFirstLoginToolInstaller() {
  if (_installed) return;
  _installed = true;
  try {
    // put your one-time welcome / tool bootstrap here
    toast.success("Welcome! Tools are ready.");
  } catch {
    // swallow, never crash app
  }
}

export default runFirstLoginToolInstaller;
