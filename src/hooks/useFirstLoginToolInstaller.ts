import { toast } from "@/hooks/use-toast";

/**
 * Pure, hook-free installer. Safe to be called inside a useEffect AFTER mount.
 * Idempotent per session.
 */
let installed = false;
export function runFirstLoginToolInstaller() {
  if (installed) return;
  installed = true;
  try {
    // whatever you previously did on first login:
    // e.g., toast.success("Welcome! Tools are ready.");
    toast.success("Welcome! Tools are ready.");
  } catch (e) {
    // swallow; nothing critical
  }
}

export default runFirstLoginToolInstaller;