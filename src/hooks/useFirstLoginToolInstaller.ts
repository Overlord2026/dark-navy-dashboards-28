import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

/**
 * First-login tool installer hook.
 * Only runs after user is authenticated and mounted.
 */
export default function useFirstLoginToolInstaller(user?: { id?: string } | null) {
  useEffect(() => {
    if (typeof window === "undefined") return; // SSR/preview guard
    if (!user?.id) return;                      // only after auth resolves
    if ((window as any).__TOOLS_READY__) return;
    (window as any).__TOOLS_READY__ = true;

    try { toast.success("Tools ready"); } catch {}
  }, [user]);
}