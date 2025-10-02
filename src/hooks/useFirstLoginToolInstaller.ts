import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

/**
 * First login tool installer hook - runs once per user session
 * MUST be called with user object to prevent premature execution
 */
export default function useFirstLoginToolInstaller(user?: { id?: string }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!user?.id) return;
    if ((window as any).__TOOLS_READY__) return;
    (window as any).__TOOLS_READY__ = true;
    try {
      toast.success("Welcome! Tools are ready.");
    } catch {
      // swallow, never crash app
    }
  }, [user]);
}
