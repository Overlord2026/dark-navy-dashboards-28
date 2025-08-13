import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Persona {
  id: string;
  kind: string;
  persona_kind?: string;
  created_at: string;
}

export default function PersonaSwitcher() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [active, setActive] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPersonas();
    // Listen for external switches to keep in sync
    const handler = (e: Event) => {
      const id = (e as CustomEvent).detail?.personaId as string | undefined;
      if (id) setActive(id);
    };
    window.addEventListener("persona-switched", handler as EventListener);
    return () => window.removeEventListener("persona-switched", handler as EventListener);
  }, []);

  const loadPersonas = async () => {
    setLoading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth.user?.id;
      if (!userId) return;

      const { data: pData, error: pErr } = await supabase
        .from("personas")
        .select("*")
        .order("created_at");
      if (pErr) throw pErr;

      setPersonas((pData || []).map((p: any) => ({ ...p, kind: (p.persona_kind ?? p.kind) as any })));

      const { data: session, error: sErr } = await supabase
        .from("persona_sessions")
        .select("persona_id")
        .eq("user_id", userId)
        .eq("active", true)
        .limit(1)
        .maybeSingle();
      if (sErr) throw sErr;

      if (session?.persona_id) setActive(session.persona_id);
    } catch (e: any) {
      console.error(e);
      toast({ title: "Unable to load personas", description: e.message ?? "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const activate = async (id: string) => {
    setLoading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth.user?.id;
      if (!userId) throw new Error("Not authenticated");

      // Deactivate current for this user only
      const { error: upErr } = await supabase
        .from("persona_sessions")
        .update({ active: false })
        .eq("user_id", userId)
        .eq("active", true);
      if (upErr) throw upErr;

      // Create (or upsert) new active session
      const { error: insErr } = await supabase.from("persona_sessions").insert({
        persona_id: id,
        user_id: userId,
        active: true,
      });
      if (insErr) throw insErr;

      setActive(id);
      window.dispatchEvent(new CustomEvent("persona-switched", { detail: { personaId: id } }));
    } catch (e: any) {
      console.error(e);
      toast({ title: "Switch failed", description: e.message ?? "Try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm text-muted-foreground">Persona:</span>
      {loading && personas.length === 0 ? (
        <span className="text-xs text-muted-foreground">Loading…</span>
      ) : (
        personas.map((p) => (
          <Button
            key={p.id}
            onClick={() => activate(p.id)}
            disabled={loading}
            variant={active === p.id ? "default" : "outline"}
            size="sm"
            aria-pressed={active === p.id}
            title={`Switch to ${p.kind}`}
          >
            {p.kind}
          </Button>
        ))
      )}
    </div>
  );
}
