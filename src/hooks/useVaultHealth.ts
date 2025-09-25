import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useVaultHealth() {
  const [vaultReady, setVaultReady] = useState<boolean | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase.rpc("vault_is_configured", {});
        if (mounted) setVaultReady(error ? false : !!data);
      } catch {
        if (mounted) setVaultReady(false);
      }
    })();
    return () => { mounted = false; };
  }, []);
  return { vaultReady };
}

export default useVaultHealth;